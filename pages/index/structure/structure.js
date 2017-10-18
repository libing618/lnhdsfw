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
  aUser: {},

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

	fManageRole: function(e) {                         //点击解职、调岗操作
    var that = this;
		let unitRole = new AV.Role(app.uUnit.name);
		let rN = Number(e.currentTarget.dataset.id), muRole = 'sessionuser';
		return new Promise((resolve, reject) => {
			var uId = app.uUnit.unitUsers[rn].objectId;
      if (e.currentTarget.id=='mr_0') {               //解职
        unitRole.getUsers().remove(uId);
				app.uUnit.unitUsers.splice(rN,1);
      } else {                                     //调岗
				that.data.crole[uId] = true;
	    	that.setData({ crole: that.data.crole });
				app.uUnit.unitUsers[rN].userRolName = that.data.cmRole[0].toString()+ that.data.cmRole[1].toString() ;
				muRole = app.uUnit.unitUsers[rN].userRolName;
			};
			unitRole.set('unitUsers',app.uUnit.unitUsers);
			unitRole.save().then((muser) => { resolve(muRole); })
		}).then((uSetRole)=>{
			AV.Cloud.run( 'gRole',{ rHandle: app.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , operation:uId , sRole: uSetRole } ).then( (cUser)=>{
				that.setData({ uUnitUsers: app.uUnit.unitUsers });
			})
    }).catch(console.error())
	},

	fManageApply: function(rn){
		var that = this;
		let unitRole = new AV.Role(app.uUnit.name);
		let rN = Number(e.currentTarget.dataset.id);
		return new Promise((resolve, reject) => {
			var uId = that.data.applyUser[rN].userId;
      if (e.currentTarget.id=='mr_2') {                          //同意
					let auRole = that.data.applyUser[rN].rRolArray[0].toString()+that.data.applyUser[rn].rRolArray[1].toString()
					app.uUnit.unitUsers.push({"objectId":uId, "userRolName":rR, 'uName':that.data.applyUser[rn].uName, 'avatarUrl':that.data.applyUser[rn].avatarUrl,'nickName':that.data.applyUser[rn].nickName})
					that.setData({ uUnitUsers: app.uUnit.unitUsers });
					unitRole.getUsers().add(uId);
					unitRole.set('unitUsers',app.uUnit.unitUsers);
          unitRole.save().then((adduser) => { resolve(auRole) })
      } else {             //拒绝
				resolve('sessionuser');
			};
		}).then((uSetRole)=>{
			AV.Cloud.run( 'gRole',{ rHandle: app.uUnit.indType.indexOf(620406)>=0 ? 'bu' : 'au' , operation:uId , sRole: uSetRole } ).then( (cUser)=>{
				AV.Object.createWithoutData('reqUnit',that.data.applyUser[rN].objectId).destroy().then(()=>{
					that.data.applyUser[rn].splice(rN,1);
					that.setData({applyUser:that.data.applyUser});
				})
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

	fApply: function (e) {
		if (this.data.reqstate==1){
			wx.showToast({title: '岗位申请等待审批。',duration: 3500});
		} else {
			this.aUser.set('rRolArray',this.data.reqrole );
			let mReqUnit = new AV.Role(app.uUnit.name);
			let mReqACL = new AV.ACL();
			mReqACL.setPublicReadAccess(false);
			mReqACL.setPublicWriteAccess(false);
			mReqACL.setRoleWriteAccess(mReqUnit,true);
			mReqACL.setRoleReadAccess(mReqUnit,true);
			mReqACL.setReadAccess(app.globalData.user.objectId,true)
			this.aUser.setACL(mReqACL);
	    this.aUser.save().then((suser)=>{
				wx.showToast({title: '岗位申请已提交,请等待审批。',duration: 3500});
			}).catch(console.error())
		};
		wx.navigateBack({ delta: 1 })
  }
})
