const AV = require('../../libs/leancloud-storage.js');
const { updateData, appDataExist } = require('../../model/initupdate');
const { integration } = require('../../model/initForm.js');
const {openWxLogin,fetchMenu,tabClick} = require('../../util/util');
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
    grids: [
      {tourl: '/pages/category/category',
      mIcon: '../../images/icon_forum.png',
      mName: '经典'},
      {tourl: '/pages/category/category',
      mIcon: '../../images/icon_find.png',
      mName: '牛货'},
      {tourl: '/pages/cart/cart',
      mIcon: '../../images/icon_cart.png',
      mName: '购物车'},
      {tourl: '/pages/member/index/index',
      mIcon: '../../images/icon_my.png',
      mName: '我的'}
    ]
  },

  onLoad: function () {
    var that = this;
    return Promise.resolve( AV.User.current()).then(lcuser => {           //读缓存登录信息
      if (lcuser) {                //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
        app.globalData.user = lcuser.toJSON();
        that.setSignup();
      } else {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
              openWxLogin(that.data.userAuthorize).then( mstate=> {
                app.logData.push([Date.now(), '系统初始化设备' + app.globalData.sysinfo.toString()]);                      //本机初始化时间记入日志
                that.setSignup();
              }).catch((loginErr) => {
                app.logData.push([Date.now(), '系统登录失败' + loginErr.toString()]);
              });
            } else {
              that.setSignup();
            }
          }
        })
      }
    }).catch((lcuErr) => {
      app.logData.push([Date.now(), '注册用户状态错误失败' + lcuErr.toString()]);
    })
  },

  setSignup: function(){
    if (app.globalData.user.mobilePhoneVerified){
      fetchMenu().then(()=>{
        wx.showTabBar()
      }).catch((menuErr) => {
        app.logData.push([Date.now(), '菜单更新失败' + menuErr.toString()]);
      });
    } else {
      this.data.grids.push({tourl: '/util/login/login',mIcon: 'https://eqr6jmehq1rpgmny-10007535.file.myqcloud.com/2c4093f310964d281bc0.jpg',mName: '合伙推广'})
      this.setData({ grids:this.data.grids })
      wx.hideTabBar();           //未授权则关闭TabBar
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

  onReady: function(){
    updateData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    updateData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    updateData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: function () {
    return {
      title: '乐农汇',
      desc: '扶贫济困，共享良品。',
      path: '/index/shops/shops?sjId='+app.globalData.user.objectId
    }
  }
})
