// 店铺货架
const AV = require('../../libs/leancloud-storage.js');
const weutil = require('../../libs/util.js');
var app = getApp()
Page({
  data:{
    reqData:[
      {gname: "uName", p:'名称', t:"h3" },
      {inclose: true, gname:"protype", p:'产品类别',t:"producttype", apdclist:[11301,11302,11303,11304,11305], apdvalue:[0, 0, 0] },
      {gname:"title", p:'简介',t:"p" },
      {gname:"desc", p:'描述',t:"p" },
      {gname:"thumbnail", p:'图片简介',t:"thumb" },
      {gname:"pics", p:'图片集',t:"pics"},
      {gname:"tvidio", p:'视频简介',t: "vidio" }
    ]
  },
  onLoad:function(options){
    var that = this;
    if (app.roleData.user.userRolName=='admin') {

    } else {
      wx.showToast({ title: '权限不足请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
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
