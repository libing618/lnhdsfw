//签约厂家
const AV = require('../../libs/leancloud-storage.js');
const { checkRols } =  require('../../model/initForm');
const {hTabClick} = require('../../libs/util.js');
const { updateData } = require('../../model/initupdate');
const {f_modalSwitchBox} = require('../../model/controlModal');
var app = getApp()
Page({
  data:{
    pNo: 'manufactor',
    pw: app.sysinfo.pw,
    ht:{
      navTabs: ['已签约厂家','未签约厂家'],
      modalBtn: ['解约','签约'],
      fLength: 2,
      pageCk: 0
    },
    cPage: [app.configData.goods.fConfig,[]],
    pageData: app.aData.manufactor,
    sPages: [{
      pageName: 'tabPanelChange'
    }],
    reqData: require('../../model/procedureclass').manufactor.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(5,app.roleData.user)) {
      updateData(true,'manufactor').then(isupdated=>{
        let mfData = app.mData.manufactor.filter(manufactorId=>{
          return (app.configData.goods.fConfig.indexOf(manufactorId)<0)
        })
        that.setData({
          cPage: [app.configData.goods.fConfig,mfData],
          pageData: app.aData.manufactor
        })
      }).catch(console.error);
    };
  },

  hTabClick: hTabClick,

  f_modalSwitchBox: f_modalSwitchBox,

  f_tabPanelChange:function({currentTarget:{id}}){
    var that = this;
    app.configData.goods.fConfig = that.data.cPage[0];
    if (id=='fSave'){
      let scObject = AV.Object.createWithoutData('shopConfig',app.configData.goods.objectId)
      scObject.fecth({keys:'fConfig'}).then(fcdata=>{
        let lcfConfig = fcdata.get('fConfig');
        if(lcfConfig.toString()!=app.configData.goods.fConfig.toString()){
          scObject.set('fConfig',that.data.cPage[0]).save();
        }
      })
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }

})
