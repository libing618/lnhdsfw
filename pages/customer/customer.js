const AV = require('../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    grids:[],
    pName: 'customer',
    tabBar: app.tabBar,
    approvPending: [],
    text : '沟通开始：'
  },

  onLoad:function(options){    // 生命周期函数--监听页面加载
    this.setData({ grids: app.wmenu[3] })          //更新菜单
  },

  onReady:function(){    // 生命周期函数--监听页面初次渲染完成
    this.updatepending(true);
  },
  onShow:function(){    // 生命周期函数--监听页面显示
    if (this.data.approvPending.length==0){ this.updatepending(true); }
  },

  onPullDownRefresh: function() {
    this.updatepending(true)
  },
  onReachBottom: function() {
    this.updatepending(false);
  },
  updatepending: function(upOrDown) {
    if(upOrDown){this.setData({text: '上拉刷新'})};
  },

  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})
