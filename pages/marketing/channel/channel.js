//店铺管理
const AV = require('../../../libs/leancloud-storage.js');
const weutil = require('../../../util/util.js');
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
    shops: app.uUnit.shops
  },
  onLoad:function(options){
    var that = this;
    if (app.globalData.user.userRolName=='admin' && app.uUnit.seriaNumber>=0) {
      new AV.Query('shops').equalTo('seriaNumber',app.uUnit.seriaNumber).find(shops=>{
        if (shops.length>0){
          that.setData({pageDate:shops});
          return weutil.arrClose('unitId',shops);
        } else {
          let newShop={unitId:app.uUnit.objectId,uName:app.uUnit.uName,nick:app.uUnit.nick,title:app.uUnit.title,seriaNumber:app.uUnit.seriaNumber,desc:app.uUnit.desc,thumbnail:app.uUnit.thumbnail,aGeoPoint:app.uUnit.aGeoPoint,address:app.uUnit.address};
          let nShops = [];
          for (let i=0;i<app.uUnit.shops.length;i++){
            newShop.shopNumber = i;
            nShops.app(newShop)
          }
          that.setData({pageDate:nShops});
          return [app.uUnit.objectId];
        }
      }).then((mIdArr)=>{
        new AV.Query('manufactor').equalTo('bState',true).find(manufactors=>{
          if (manufactors){
            let mfData = [];
            manufactors.forEach(manufactor=>{
              if (mIdArr.indexOf(manufactor.unitId)<0) {mfData.push(manufactor.toJSON())}
            })
            if (!mfData) { that.setData({mfData:mfData}) }
          };
        })
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
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
