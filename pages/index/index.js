const weutil = require('../../util/util.js');
var app = getApp()
Page({
  data: {
    autoplay: true,
    pName: 'index',
    tabBar: app.tabBar,
    isWorker: typeof app.globalData.user.userRolName == 'string',
    scrollTop : 0,
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    mPage: app.mData.prdct1,
    pNo: 1,                       //流程的序号1为文章类信息
    pageData: {},
    tabs: ["品牌建设", "政策扶持", '商圈人脉'],
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: app.wmenu[0]
  },

  onLoad: function () {
    var that = this;
    if (app.aData[1].length>0) {
      that.setData({ mPage: app.mData.prdct1, pageData: app.aData[1]});
    }
  },

  onReady: function(){
    weutil.updateData(true,1);                       //更新缓存以后有变化的数据
  },

  tabClick: function (e) {                                //点击tab
    app.mData.pCk1 = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData.pCk1                  //点击序号切换
    });
  },

  onPullDownRefresh:function(){
    weutil.updateData(true,1);
  },
  onReachBottom:function(){
    weutil.updateData(false,1);
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})
