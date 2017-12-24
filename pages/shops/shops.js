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
    grids:  app.shopMenu
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
      app.tabBar[0].sams=2
      that.setData({ tabBar: app.tabBar })
  }
})
