//签约厂家
const AV = require('../../libs/leancloud-storage.js');
const {checkRols} = require('../../libs/util.js');
const { updateData } = require('../../model/initupdate');
const {showProcedureModal,hideSwitchModal} = require('../../model/controlModal');
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
    cPage: [],
    pageData: app.aData.manufactor,
    modalStatus: false,
    modalFormat: require('../../model/procedureclass').manufactor.pSuccess,
    modalId: '0'
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(9,app.roleData.user)) {
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

  tabClick: function (e) {                                //点击tab
    let pCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": pCk
    });
  },

  showModal: showProcedureModal,

  hideModal: hideSwitchModal,

  fSumber:function({target:{id}}){
    var that = this;
    app.configData.goods.fConfig = that.data.cPage[0];
    if (id=='fSave'){
      AV.Object.createWithoutData('shopConfig',app.configData.goods.objectId).set('fConfig',that.data.cPage[0]).save();
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }
  
})
