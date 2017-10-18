// pages/marketing/distributor/distributor.js分销招募
const AV = require('../../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data:{
    reqData:[
      {gname:"agreement", p:'分销协议',t: "p"},
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
      new AV.Query('manufactor').equalTo('unitId',app.uUnit.objectId).find(manufactors=>{
        if (manufactors){
          let mfData = [];
          manufactors.forEach(manufactor=>{
            if (mIdArr.indexOf(manufactor.unitId)<0) {mfData.push(manufactor.toJSON())}
          })
          if (!mfData) { that.setData({mfData:mfData}) }
        };
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
  fSave:function(e){
    var that = this;
    let aq = new AV.Query('manufactor');
    aq.equalTo('unitId',app.uUnit.objectId);
    let bq = new AV.Query('manufactor');
    bq.equalTo('bState',true);
    let mfData = AV.Query.and(aq,bq);
    mfData.find().then((mf)=>{
      if (mf) {mf.forEach(m=>{ m.set('bState',false)} )}
      AV.Object.saveAll(mf).then(()=>{
        let newmf=new AV.Object.extend('manufactor');
        newmf.set('unitId',app.uUnit.objectId);
        newmf.set('bState',true);
        newmf.set('uName',app.uUnit.uName);
        newmf.set('nick', app.uUnit.nick);
        newmf.set('title', app.uUnit.title);
        newmf.set('seriaNumber', app.uUnit.seriaNumber);
        newmf.set('desc', app.uUnit.desc);
        newmf.set('thumbnail', app.uUnit.thumbnail);
        newmf.set('aGeoPoint', app.uUnit.aGeoPoint);
        newmf.set('address', app.uUnit.address);
        newmf.set('agreement',e.detail.value.agreement)
      })


    })
  }
})
