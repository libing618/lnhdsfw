// 生产过程
var app = getApp()
Page({
  data:{
	pageData: {},
    fLength: 3,
    tabs: ['','今日工作',''],
    pageCk: app.mData.pCk3,
    wWidth: app.globalData.sysinfo.windowWidth
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
