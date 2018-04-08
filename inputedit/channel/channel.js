//签约厂家
const AV = require('../../libs/leancloud-storage.js');
const weutil = require('../../util/util.js');
var app = getApp()
Page({
  data:{
    reqData:[
      {gname:"uName", p:'单位名称',t:"h3" },
      {gname:"nick", p:'单位简称',t:"h3" },
      {gname: "title", p: '单位简介', t: "p"},
      {gname: "desc", p: '单位描述', t: "p"},
      {gname: "thumbnail", p: '图片简介', t: "thumb" },
      {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
      {gname: "address", p: '详细地址', t: "ed"}
    ],

  },
  onLoad:function(options){
    var that = this;
    if (app.roleData.user.userRolName=='admin') {
      new AV.Query('manufactor').equalTo('bState',true).find(manufactors=>{
        if (manufactors){
          let mfData = [];
          manufactors.forEach(manufactor=>{
            if (mIdArr.indexOf(manufactor.unitId)<0) {mfData.push(manufactor.toJSON())}
          })
          if (!mfData) { that.setData({mfData:mfData}) }
        };
      }).catch(console.error);
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
