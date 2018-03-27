const AV = require('../../libs/leancloud-storage.js');
const { readAllData, initConfig, loginAndMenu} = require('../../util/util');
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
    mPage: app.mData.goods,
    pNo: 'goods',                       //流程的序号6为商品信息
    pageData: app.aData.goods,
    grids: app.shopsGrids
  },

  onLoad: function () {
    return Promise.all([initConfig(app), loginAndMenu(app)]).then((nQuery, sTab) => {
      if (app.globalData.user.mobilePhoneVerified) {
        wx.showTabBar()
      } else {
        app.shopsGrids.push({ tourl: '/util/login/login', mIcon: 'https://eqr6jmehq1rpgmny-10007535.file.myqcloud.com/2c4093f310964d281bc0.jpg', mName: '合伙推广' })
        wx.hideTabBar();
      }
      readAllData(true, 'goods', app).then(isupdated => {
        this.setData({
          grids: app.shopsGrids,
          mPage: app.mData.goods,
          pageData: app.aData.goods
        })
      });
      wx.setStorage({ key: 'configData', data: app.configData });
    });
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
      path: '/index/shops/shops?sjId='+app.globalData.user.objectId
    }
  }
})
