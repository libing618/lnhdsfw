// 店铺货架
const AV = require('../../libs/leancloud-storage.js');
const {checkRols,hTabClick} = require('../../libs/util.js');
const { readAllData } = require('../../model/initupdate');
const {f_modalSwitchBox} = require('../../model/controlModal');
var app = getApp()
Page({
  data:{
    pNo: 'goods',
    pw: app.sysinfo.pw,
    ht:{
      navTabs: ['推荐排名','尚未推荐'],
      modalBtn: ['移出','推荐'],
      fLength: 2,
      pageCk: 0
    },
    qd:['分红比例',app.roleData.user.userRolName],
    cPage: [app.configData.goodsindex,[]],
    pageData: app.aData.goods,
    sPages: [{
      pageName: 'tabPanelPage'
    }],
    reqData: require('../../model/procedureclass').goods.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      readAllData(true,'goods').then(isupdated=>{
        let mgData = app.mData.goods.filter(goodsId=>{
          return (app.configData.goodsindex.indexOf(goodsId)<0)
        })
        that.setData({
          cPage: [app.configData.goodsindex,mgData],
          pageData: app.aData.goods
        })
      }).catch(console.error);
    };
  },

  hTabClick: hTabClick,

  f_modalSwitchBox: f_modalSwitchBox,

  f_tabPanelPage:function({currentTarget:{id}}){
    var that = this;
    app.configData.goods.fConfig = that.data.cPage[0];
    if (id=='fSave'){
      AV.Object.createWithoutData('shopConfig',app.configData.goods.objectId).set('fConfig',that.data.cPage[0]).save();
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }

})
