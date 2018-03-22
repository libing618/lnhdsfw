const AV = require('../../libs/leancloud-storage.js');
const { readAllData } = require('../../model/initupdate');
const { integration } = require('../../model/initForm.js');
const {tabClick} = require('../../util/util');
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
      {tourl: '/index/shops/shops',
      mIcon: '../../images/icon_forum.png',
      mName: '经典'},
      {tourl: '/pages/shops/category/category',
      mIcon: '../../images/icon_find.png',
      mName: '牛货'},
      {tourl: '/pages/shops/cart/cart',
      mIcon: '../../images/icon_cart.png',
      mName: '购物车'},
      {tourl: '/pages/shops/member/index/index',
      mIcon: '../../images/icon_my.png',
      mName: '我的'}
    ]
  },
 
  onLoad: function () {
    if (!app.globalData.user.mobilePhoneVerified){
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
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShow: function (options) {
    var that = this; 
    that.loadzhongchou();
  },

  loadzhongchou: function () {
    var that = this;
    var query = new AV.Query('xs_Goods');
    query.equalTo('isHot', true);
    query.addAscending('priority');
    query.find().then(function (goodsObjects) {
      that.setData({
        goods: goodsObjects
      });
    });
  },
  showDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var goodsId = this.data.goods[index].id;
    wx.navigateTo({
      url: "/pages/shops/goods/detail/detail?objectId=" + goodsId
    });
  },

  onShareAppMessage: function () {
    return {
      title: '乐农汇',
      desc: '扶贫济困，共享良品。',
      path: '/index/shops/shops?sjId='+app.globalData.user.objectId
    }
  }
})
