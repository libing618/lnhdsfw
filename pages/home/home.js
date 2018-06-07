const { User,ACL } = require('../../libs/leancloud-storage.js');
const { openWxLogin } = require('../../libs/util');
const { readAllData, initConfig,fetchCargoStock, loginAndMenu,initLogStg,setTiringRoom,shareMessage } = require('../../model/initForm.js');
const { integration,tabClick } = require('../../model/initupdate');
var app = getApp()
Page({
  data: {
    images: [
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/ff933806fce411614341.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/c4b4edf57363e801162c.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/4827cf0d996f80a86266.JPG'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/d5140a5a494b03139854.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/42e17b8efd6a01896496.JPG'}
    ],
    autoplay: true,
    pw: app.sysinfo.pw,
    signuped: app.roleData.user.mobilePhoneVerified,
    tiringRoom: app.configData.tiringRoom,
    mPage: app.mData.goods,
    pNo: 'goods',                       //商品信息
    pageData: app.aData.goods
  },

  onLoad: function (options) {
    var that = this ;
    return new Promise((resolve, reject) => {
      if (app.configData.path == 'pages/home/home') {         //判断本次登录本页是否首页
        let proGoodsUpdate = app.configData.units.updatedAt ;
        initConfig(app.configData).then(icData=>{    //系统初妈化
          app.configData = icData;
          if (app.configData.units.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
          loginAndMenu(User.current(),app.roleData).then(rData=>{    //用户登录及读菜单权限
            app.roleData = rData;
            if (app.roleData.user.objectId!=='0'){            //用户已注册
              if (typeof options.sjid=='undefined'){    //非分享入口
                app.configData.sjid = app.roleData.user.sjid;
                app.configData.channelid = app.roleData.user.channelid;
              };
              app.imLogin();
            }
            initLogStg('home');
            fetchCargoStock().then(()=>{resolve(true)});
          });
        })
      } else { resolve(false) }
    }).then(firstVer=>{
      readAllData(true, 'goods').then(isupdated => {
        this.setData({
          signuped: app.roleData.user.mobilePhoneVerified,
          tiringRoom: app.configData.tiringRoom,
          mPage: app.mData.goods,
          pageData: app.aData.goods
        });
      })
      if (firstVer) { setTiringRoom(app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom);}
    }).catch(console.error)
  },

  onShow: function(){
    this.setData({
      signuped: app.roleData.user.mobilePhoneVerified,
      tiringRoom: app.configData.tiringRoom
    });
    if (app.roleData.orders && !app.configData.tiringRoom){
      wx.showTabBarRedDot({index:3});
      wx.setTabBarBadge({
        index: 3,
        text: ''+app.roleData.orders.length
      })
    } else {
      wx.hideTabBarRedDot({index:3});
      wx.setTabBarBadge({
        index: 3,
        text: ''
      })
    }
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mPage:app.mData.goods,
        pageData:app.aData.goods
      })
    }
  },

  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(app.roleData).then( mstate=> {
      app.roleData = mstate;
      let userControl = new ACL();
      userControl.setReadAccess(User.current(),true);
      userControl.setReadAccess(app.configData.sjid,true);
      userControl.setReadAccess(app.configData.channelid,true);
      userControl.setRoleReadAccess(app.roleData.shopId,true);
      userControl.setWriteAccess(User.current(),true);
      userControl.setRoleWriteAccess(app.roleData.shopId,true);
      User.current()
        .set({sjid:app.configData.sjid,channelid:app.configData.channelid,goodsIndex:app.configData.unitsIndex})
        .setACL(userControl)
        .save()
        .then(()=>{
          app.roleData.user.sjid = app.configData.sjid;
          app.roleData.user.channelid = app.configData.channelid;
          app.roleData.user.goodsIndex = app.configData.unitsIndex;
          app.logData.push([Date.now(), '用户授权' + app.sysinfo.toString()]);                //用户授权时间记入日志
          wx.navigateTo({url:'/pages/signup/signup?type=promoter'});                //进行推广合伙人注册
        })
    }).catch( console.error );
  },

  changeTiring: function (e) {
    var that = this;
    if (app.roleData.user.mobilePhoneVerified) {
      app.configData.tiringRoom = ! that.data.tiringRoom;
      setTiringRoom(app.configData.tiringRoom);
      that.setData({ tiringRoom: app.configData.tiringRoom });
    };
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: shareMessage
})
