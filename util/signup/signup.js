//合伙人或伙伴注册
const AV = require('../../libs/leancloud-storage.js');
const { initConfig, loginAndMenu,openWxLogin,setTiringRoom } = require('../../util/util');
var app = getApp()
Page({
  data:{
    user: app.roleData.user,
    sysheight: app.sysinfo.windowHeight-160,
    swcheck: true,
    iName: app.roleData.user.uName,
    activemobile: true,
    rejectWxPhone: false
	},
  wxlogincode: '',

  getLoginCode: function() {
    var that=this;
    wx.login({
      success: function (wxlogined) {
        that.wxlogincode = (wxlogined.code) ? wxlogined.code : ''
      }
    });
  },

  onLoad: function (ops) {
    var that = this;
    if (app.roleData.user.objectId=='0'){                 //非授权用户
      wx.showToast({ title: '请授权微信登录', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    } else {
      that.setData({		    		// 获得当前用户channelid
        iName: app.roleData.user.uName,
        navBarTitle:
        userType: (ops.type =='promoter' || ops.type =='channel') ? ops.type : 'partner'
      });
    }
  },

	fswcheck: function(e){
		this.setData({ swcheck: !this.data.swcheck });
	},

  gUserPhoneNumber: function(e) {
    var that = this;
    if (that.wxlogincode) {
      if (e.detail.errMsg == 'getPhoneNumber:ok'){
        let lcCloudReq = {
          code: that.wxlogincode,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          uName: that.data.iName,
          userRolName: that.data.userType
        };
        AV.Cloud.run('gPN', lcCloudReq).then(()=> {
          wx.showToast({
            title: '微信绑定的手机号注册成功', icon:'none', duration: 2000
          })
          app.roleData.user.mobilePhoneVerified = true;
          app.roleData.user.uName = that.data.iName;
          app.roleData.user.userRolName = that.data.userType;
          that.setData({ user:app.roleData.user })
        }).catch( ()=>{
          wx.showToast({
            title: '微信手机号注册失败，请检查是否已在本平台上使用。', icon:'none', duration: 2000
          });
        });
      } else {
        wx.showToast({
          title: '未授权使用微信手机号', icon:'none', duration: 2000
        });
        that.setData({ rejectWxPhone: true });               //输入手机号验证注册
      }
    } else {
      wx.showToast({
        title: '需要进行微信登录，请再次点击本按钮。', icon:'none', duration: 2000
      });
      that.getLoginCode();
    }
  },

  i_Name: function(e) {							//修改用户姓名
    this.setData({ iName: e.detail.value })
  }

})
