//单位（机构类）组织架构管理
const AV = require('../../../libs/leancloud-storage.js');
var app = getApp()          //设置组织架构
Page({
	data:{
    userRolName: '',
		uUnitUsers: {},
		mRols: [
			['办公','产品','营销','客服'],
			['负责人','部门管理','员工']
		],
		crole: {},
		applyUser: [],
		cmRole:[0,0],
		reqrole: [0,0],
    reqstate: 0,
		eRole: '00'                        //岗位代码
	},

  onLoad: function () {
    var that = this;
    if (app.globalData.user.mobilePhoneNumber && app.uUnit.length>0) {			// 当前用户已注册且已有单位
      if (app.uUnit.unitType<2) {
        wx.showToast({ title: '非机构类单位,没有下级员工设置。', duration: 7500 })
        wx.navigateBack({ delta: 1 })                // 回退前1 页面
      } else {
        if (app.uUnit.name == app.globalData.user.objectId) {                //创建人读取单位员工信息
          let crole = {};
          app.uUnit.unitUsers.map((cuser) => { return crole[cuser.objectId] = true });
          that.setData({
            crole: crole,
            uUnitUsers: app.uUnit.unitUsers
          })
        } else {
					wx.showToast({ title: '非单位创始人,不能进行员工管理。', duration: 7500 })
	        wx.navigateBack({ delta: 1 })                // 回退前1 页面
        }
        wx.setNavigationBarTitle({
          title: app.uUnit.uName+'的组织架构'     //将页面标题设置成单位名称
        })
      };
    } else {
      wx.showToast({ title: '没有注册用户或申请单位,请在个人信息菜单注册。', duration: 7500 })
      wx.navigateBack({ delta: 1 })                // 回退前1 页面
    };
    that.setData({ userRolName: app.globalData.user.userRolName })
  },

	fSpicker: function(e) {                         //选择岗位和条线
		let rval = e.detail.value;
		this.setData({ reqrole: rval,
			eRole: rval[0].toString()+ rval[1].toString() });     //对申请条线和岗位进行编码
	},

	fManageRole: function(e) {                         //点击解职、入职、调岗操作
    var that = this;
		let newUnitUsers = app.uUnit.unitUsers;
		let unitRole = new AV.Role(app.uUnit.name);
		let rN = Number(e.currentTarget.dataset.id), muRole = 'sessionuser';
		return new Promise((resolve, reject) => {
			var uId = newUnitUsers[rn].objectId;
      if (e.currentTarget.id=='mr_0') {               //解职
        unitRole.getUsers().remove(uId);
				newUnitUsers.splice(rN,1);
      } else {                                     //调岗
				that.data.crole[uId] = true;
	    	that.setData({ crole: that.data.crole });
				newUnitUsers[rN].userRolName = that.data.cmRole[0].toString()+ that.data.cmRole[1].toString() ;
				muRole = newUnitUsers[rN].userRolName;
			};
			unitRole.set('unitUsers',newUnitUsers);
			unitRole.save().then((muser) => { resolve(muRole); })
		}).then((uSetRole)=>{
			AV.Cloud.run( 'gRole',{ rHandle: app.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , operation:uId , sRole: uSetRole } ).then( (cUser)=>{
				app.uUnit.unitUsers = newUnitUsers;
				that.setData({ uUnitUsers: app.uUnit.unitUsers });
			})
    }).catch(console.error())
	},

	fChangeRole: function(e){                  //打开调岗选择
    this.data.crole[e.currentTarget.dataset.id] = !this.data.crole[e.currentTarget.dataset.id];
    this.setData({ crole: this.data.crole })
	},
	rChange: function (e) {
    this.setData({ mIndex: e.detail.value })
  },

	mColumnChange: function (e) {
		this.data.cmRole[e.detail.column] = e.detail.value;
    this.setData({ cmRole: this.data.cmRole })
  },

	fSelApply: function({detail:{value:{inputmpn}}}){
		var that = this;
		if ( inputmpn && /^1\d{10}$/.test(inputmpn) ) {
			new AV.Query('shops').equalTo('mobilePhoneNumber',inputmpn).find().then(applyUser=>{
				if (applyUser) {
					that.setData(applyUser)
				} else {
					wx.showToast({title:'该用户没有注册'})
				}
			});
		} else {
			wx.showModal({
			title: '手机号输入错误',
			content: '请重新输入正确的手机号！'
			});
			this.setData({applyUser : null});
		}
	},

	fManageApply: function (e) {
		var that = this;
		let newUnitUsers = app.uUnit.unitUsers;
		newUnitUsers.push({"objectId":that.data.applyUser.objectId, "userRolName":that.data.eRole, 'uName':that.data.applyUser.uName, 'avatarUrl':that.data.applyUser.avatarUrl,'nickName':that.data.applyUser.nickName});
		new AV.Role(app.uUnit.name)
			.getUsers.add(that.data.applyUser.objectId)
			.set('unitUsers',newUnitUsers)
			.save()
		.then(()=>{
				return that.data.eRole;
		}).then((uSetRole)=>{
      AV.Cloud.run( 'gRole',{ rHandle: app.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , operation:that.data.applyUser.objectId , sRole: uSetRole } ).then( (cUser)=>{
        app.uUnit.unitUsers = newUnitUsers;
        that.setData({ uUnitUsers: app.uUnit.unitUsers });
      })
    }).catch(console.error);
  }
})
