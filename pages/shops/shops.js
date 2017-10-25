const AV = require('../../libs/leancloud-storage.js')
var app = getApp()
Page({
    data: {
      images: [
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/790f500d14e467fe28e3.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/ff933806fce411614341.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/c4b4edf57363e801162c.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/4827cf0d996f80a86266.JPG'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/d5140a5a494b03139854.jpg'},
      {thumbnail:'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/42e17b8efd6a01896496.JPG'}
    ],
    pName: 'shops',
    tabBar: app.tabBar,
    isWorker: typeof app.globalData.user.userRolName == 'string',
    grids:  [
        {tourl: '../category/category',
        mIcon: 'https://eqr6jmehq1rpgmny-10007535.file.myqcloud.com/a18e62b4cdcac3f3dd07.jpg',
        mName: '产品精选'
    },{
        tourl: '../cart/cart',
        mIcon: 'https://eqr6jmehq1rpgmny-10007535.file.myqcloud.com/1b2d1577ca9cbcefc06f.jpg',
        mName: '购物车'
    },{
        tourl: '/util/login/login',
        mIcon: 'https://eqr6jmehq1rpgmny-10007535.file.myqcloud.com/2c4093f310964d281bc0.jpg',
        mName: '合伙推广'
    },{
        tourl: '../shop/shop',
        mIcon: 'https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/5daf25bdfefc82a9a0c4.png',
        mName: '店铺保存'
    }]
    },
onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/index?id='+app.globalData.user.objectId
    }
  },
  onShow :function(){
      var that = this;
      that.setData({ tabBar: app.tabBar })
  }
})