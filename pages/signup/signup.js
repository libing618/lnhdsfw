//合伙人或伙伴注册
const AV = require('../../libs/leancloud-storage.js');
const { initConfig, loginAndMenu,openWxLogin,setTiringRoom } = require('../../libs/util');
var app = getApp()
Page({
  data:{
    user: app.roleData.user,
    pw: app.sysinfo.pw,
    sysheight: app.sysinfo.windowHeight-260,
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
    if (!app.netState) { wx.redirectTo({ url: 'pages/home/home' }); }
    let nowPages = getCurrentPages();
    let rtUrl = '';
    return new Promise((resolve, reject) => {
      if (nowPages.length==1) {
        rtUrl = '/pages/home/home';
        let proGoodsUpdate = app.configData.goods.updatedAt;
        initConfig(app.configData).then(icData => {
          app.configData = icData;
          if (app.configData.goods.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
          loginAndMenu(AV.User.current(), app.roleData).then(rData => {
            app.roleData = rData;
            if (app.roleData.user.objectId == '0') {
              wx.authorize({    //请用户授权登录本平台
                scope: 'scope.userInfo',
                success() {          // 用户同意小程序使用用户信息
                  app.roleData.user.userRolName = ops.type;
                  opepWxLogin(app.roleData).then(resLogin => {
                    app.roleData = resLogin;
                    resolve(app.roleData.user.objectId)
                  })
                },
                fail: () => { wx.switchTab({ url: rtUrl }); }
              })
            } else { resolve(app.roleData.user.objectId) }
            wx.setStorage({ key: 'configData', data: app.configData });
          })
        })
      } else { resolve(app.roleData.user.objectId) }
    }).then(userId=>{
      if (userId == '0') {                 //非授权用户
        wx.showToast({ title: '请授权微信登录', duration: 2500 });
        setTimeout(function () {
            wx.navigateBack({ delta: 1 })
        }, 2000);
      } else {
        let usertype=ops.type,nbTitle;
        switch (ops.type) {
          case 'promoter':
            nbTitle = '注册成为推广合伙人';
            break;
          case 'channel':
            nbTitle = '注册成为渠道合伙人';
            break;
          default:
            usertype = 'partner';
            nbTitle = '注册成为事业合伙人';
        }
        that.setData({		    		// 获得当前用户channelid
          iName: app.roleData.user.uName ? app.roleData.user.uName : '',
          user: app.roleData.user,
          useRol: ops.type,
          navBarTitle: nbTitle,
          rtUrl: rtUrl,
          userType: usertype
        });
      }
    }).catch(console.error)
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
          userRolName: that.data.userRol
        };
        AV.Cloud.run('gPN', lcCloudReq).then(()=> {
          wx.showToast({
            title: '微信绑定的手机号注册成功', icon:'none', duration: 2000
          })
          app.roleData.user.mobilePhoneVerified = true;
          app.roleData.user.uName = that.data.iName;
          app.roleData.user.userRolName = that.data.userType;
          that.setData({ user:app.roleData.user })
          setTimeout(function () {
            if (that.data.rtUrl){
              wx.switchTab({ url: that.data.rtUrl });
            } else {
              wx.navigateBack({ delta: 1 })
            }
          }, 2000 );
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
