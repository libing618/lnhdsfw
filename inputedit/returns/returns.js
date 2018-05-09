//退换货
const { updateRoleData } = require('../../model/initupdate.js');
const { procedureSum } = require('../../model/dataAnalysis.js');
var app = getApp()
Page({
  data:{
    pw: app.sysinfo.pw
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
