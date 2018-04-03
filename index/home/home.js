const AV = require('../../libs/leancloud-storage.js');
const { readAllData, initConfig, loginAndMenu,openWxLogin,setTiringRoom } = require('../../util/util');
const { integration } = require('../../model/initForm.js');
const { tabClick } = require('../../model/initupdate');
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
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    wWidth: app.globalData.sysinfo.windowWidth,
    signuped: app.globalData.user.mobilePhoneVerified,
    tiringRoom: app.configData.tiringRoom,
    mPage: app.mData.goods,
    pNo: 'goods',                       //商品信息
    pageData: app.aData.goods
  },

  onLoad: function () {
    return Promise.all([initConfig(app), loginAndMenu(app)]).then(() => {
      if (app.globalData.user.mobilePhoneVerified && app.configData.tiringRoom) { setTiringRoom(true) }
      wx.setStorage({ key: 'configData', data: app.configData });
    });
    this.setPage(true);
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mPage:app.mData.goods,
        pageData:app.aData.goods
      })
    }
  },

  onReady: function(){
    readAllData(true, 'goods', app).then(isupdated => { this.setPage(isupdated) });
  },

  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(app).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo.toString()]);                      //用户授权时间记入日志
      that.setData({ unAuthorize: false })
    }).catch( console.error );
  },

  changeTiring: function (e) {
    var that = this;
    if (app.globalData.user.mobilePhoneVerified) {
      app.configData.tiringRoom = ! app.configData.tiringRoom;
      setTiringRoom(app.configData.tiringRoom);
      that.setData({ tiringRoom: app.configData.tiringRoom });
    };
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true,'goods',app).then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false,'goods',app).then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: function () {
    return {
      title: '乐农汇',
      desc: '扶贫济困，共享良品。',
      path: '/index/home/home?sjId='+app.globalData.user.objectId
    }
  }
})
