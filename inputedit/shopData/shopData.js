// 店铺
const AV = require('../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    pw: app.sysinfo.pw,
    ht:{
      navTabs: ['事业合伙人','渠道合伙人'],
      fLength: 2,
      pageCk: 1
    },
		mRols: [
			['办公','产品','营销','客服'],
			['负责人','部门管理','员工']
		],
		roleUser: [],
		applyUser: [],
		cmRole:[0,0],
		reqrole: [0,0],
    crole: '0',
    eRole: 'channel'                        //岗位代码
	},
  aUser: {},

  onLoad: function () {
    var that = this;
    if (app.roleData.user.emailVerified && app.roleData.user.userRolName=='admin') {			// 当前用户为单位负责人
      let mRolJsons = {};
      mRolJsons.channel = '渠道合伙人';
      for (let tx=0;tx<4;tx++){
        for (let gw=0;gw<3;gw++){
          mRolJsons[tx.toString() + gw.toString()] = '事业合伙人(' +that.data.mRols[0][tx]+' 条线 '+that.data.mRols[1][gw]+')';
        }
      }
      new AV.Query('_User')
      .equalTo('mobilePhoneVerified',true)
      .select(['emailVerified','uName','nickName','avatarUrl','userRolName','channelid'])
      .find().then((allUser) => {
        let channel=[],aChannel=[],partner=[],aPartner=[],promoter={},userJson;
          allUser.forEach(cuser => {
            that.aUser[cuser.id] = cuser;
            userJson = cuser.toJSON();
            switch (userJson.userRolName) {
              case 'promoter':
                if (!promoter[userJson.channelid]) {promoter[userJson.channelid]=[]};
                promoter[userJson.channelid].push(userJson.objectId)
                break;
              case 'channel':
                if (userJson.emailVerified) {
                  channel.push(userJson.objectId)
                } else { aChannel.push(userJson.objectId) }
                break;
              case 'admin':
                break;
              default:
                if (userJson.emailVerified) {
                  partner.push(userJson.objectId)
                } else { aPartner.push(userJson.objectId) }
            };
          });
          that.setData({
            mRolJsons: mRolJsons,
            roleUser: [channel,partner],
            applyUser: [aChannel,aPartner],
            aUser: that.aUser
          });
        }).catch(console.error);
    } else {
      wx.showToast({ title: '没有注册用户或申请单位,请联系系统开发人员。', icon:'none',duration: 7500 })
      wx.navigateBack({ delta: 1 })                // 回退前1 页面
    };
  },

  tabClick: function (e) {                                //点击tab
    let pCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": pCk,               //点击序号切换
      eRole: pCk==0 ? ''+this.data.reqrole[0]+this.data.reqrole[1] : 'channel'
    });
  },

	fSpicker: function(e) {                         //选择岗位和条线
		let rval = e.detail.value;
		this.setData({ reqrole: rval,
			eRole: rval[0].toString()+ rval[1].toString() });     //对申请条线和岗位进行编码
	},

	fManageRole: function(e) {                         //点击解职、调岗操作
    var that = this;
		let roleUserId = e.currentTarget.dataset.id;
    switch (e.currentTarget.id) {
      case 'mr_0':               //解职为渠道合伙人
        that.data.aUser[roleUserId].set('userRolName','channel');
        break;
      case 'mr_1':                        //调岗
        that.data.aUser[roleUserId].set('userRolName',''+that.data.mrrole[0]+that.data.mrrole[1]);
        break;
      case 'mr_2':                        //同意
        that.data.aUser[roleUserId].set('emailVerified',true);
        that.data.aUser[roleUserId].set('channelid',roleUserId);
        that.data.aUser[roleUserId].set('sjid',roleUserId);
        break;
      default:                        //mr_3拒绝,mr_4解约
        that.data.aUser[roleUserId].set('emailVerified',false);
  			that.data.aUser[roleUserId].set('channelid',app.roleData.shopId);
        that.data.aUser[roleUserId].set('userRolName','promoter');
        break;
		};
    that.data.aUser[roleUserId].save().then((uSetRole)=>{
      let rNo;
      switch (e.currentTarget.id) {
        case 'mr_0':
          rNo = that.data.roleUser[0].indexOf(roleUserId);
          that.data.roleUser[0].splice(rNo,1);
          that.data.roleUser[1].push(roleUserId);
          break;
        case 'mr_2':
          rNo = that.data.applyUser[that.data.ht.pageCk].indexOf(roleUserId);
          that.data.applyUser[that.data.ht.pageCk].splice(rNo,1);
          that.data.roleUser[that.data.ht.pageCk].push(roleUserId);
          break;
        case 'mr_3':
          rNo = that.data.applyUser[that.data.ht.pageCk].indexOf(roleUserId);
          that.data.applyUser[that.data.ht.pageCk].splice(rNo,1);
          break;
        case 'mr_4':
          rNo = that.data.roleUser[1].indexOf(roleUserId);
          that.data.roleUser[1].splice(rNo,1);
          break;
      };
      that.setData({
        roleUser:that.data.roleUser,
        applyUser:that.data.applyUser,
        aUser:that.data.aUser
      });
    }).catch(()=>{
      wx.showToast({title: '数据保存失败。',duration: 3500});
      wx.navigateBack({ delta: 1 })
    })
	},

	fChangeRole: function(e){                  //打开调岗选择
    this.setData({ crole: e.currentTarget.dataset.id });
	},
	rChange: function (e) {
    this.setData({ mIndex: e.detail.value })
  },

	mColumnChange: function (e) {
		this.data.cmRole[e.detail.column] = e.detail.value;
    this.setData({ cmRole: this.data.cmRole })
  },

  onShareAppMessage: function () {
    console.log('/pages/signup/signup?sjid=' + app.roleData.user.objectId + '&type=' + this.data.eRole)
    return {
      title: app.roleData.user.uName + '诚邀您加入乐农汇的大家庭，邀请您成为' + this.data.mRolJsons[this.data.eRole],
      desc: '扶贫济困，共享良品。',
      imageUrl:'../../images/logo.png',
      path: '/pages/signup/signup?sjid=' + app.roleData.user.objectId + '&type=' + this.data.eRole
    }
  }
})
