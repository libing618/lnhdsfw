const AV = require('../../libs/leancloud-storage.js');
const { initConfig, loginAndMenu,openWxLogin,setTiringRoom } = require('../../util/util');
const { integration } = require('../../model/initForm.js');
const { readAllData, tabClick } = require('../../model/initupdate');
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
    scrollTop : 0,
    scrollHeight: app.sysinfo.windowHeight-80,
    wWidth: app.sysinfo.windowWidth,
    signuped: app.roleData.user.mobilePhoneVerified,
    tiringRoom: false,//app.configData.tiringRoom,
    mPage: app.mData.goods,
    pNo: 'goods',                       //商品信息
    pageData: app.aData.goods
  },

  onLoad: function () {
    if (app.netState) {
      let proGoodsUpdate = app.configData.goods.updatedAt ;
      initConfig(app.configData).then(icData=>{
        app.configData = icData;
        if (app.configData.goods.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
        loginAndMenu(AV.User.current(),app.roleData).then(rData=>{
          app.roleData = rData;
          readAllData(true, 'goods').then(isupdated => {
            this.setData({
              signuped: app.roleData.user.mobilePhoneVerified,
              tiringRoom: app.configData.tiringRoom,
              mPage: app.mData.goods,
              pageData: app.aData.goods
            });
          })
        }),
        wx.setStorage({ key: 'configData', data: app.configData });
      }).catch(console.error)
    }
    setTiringRoom(false);
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
    app.roleData.user.sjid = app.configData.sjid;
    app.roleData.user.channelid = app.configData.channelid;
    openWxLogin(app.roleData).then( mstate=> {
      app.roleData = mstate;
      app.logData.push([Date.now(), '用户授权' + app.sysinfo.toString()]);                //用户授权时间记入日志
      wx.navigateTo({url:'/util/signup/signup?type=promoter'});                //进行推广合伙人注册
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

  onShareAppMessage: function () {
    return {
      title: '乐农汇',
      desc: '扶贫济困，共享良品。',
      path: '/index/home/home?sjid='+app.roleData.user.objectId
    }
  }
})
