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
    iFormat: app.fData.manufactor.pSuccess,
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
          scObject.set('fConfig',that.data.cPage[0]).save().then(()=>{
            new AV.Query('distributor').equalTo('unitId',app.roleData.shopId).ascending('updatedAt').find().then(channel=>{
              if (channel) {
                let fc,sChannel=new Set(),cs=new Set();
                channel.forEach(csi=>{
                  fc = csi.toJSON();
                  if (that.data.cPage[0].indexOf(fc.unitId)<0){                   //是否要签约
                    sChannel.add(csi.set('agreeState',1))                   //解约
                  } else {
                    if (fc.agreeState==1) {sChannel.add(csi.set('agreeState',0))}                   //重签约
                  };
                  if (fc.agreeState==0) {cs.add(fc.unitId)};
                });
                if (cs){
                  let addcs = AV.Object.extend('distributor');
                  function addcs(unitId){
                    let adcs = new addcs();
                    adcs.set('unitId',unitId);
                    adcs.set('unitName',that.data.pageData[unitId].uName);
                    adcs.set('shopId',app.roleData.shopId);
                    adcs.set('shopName',app.roleData.shopName);
                    adcs.set('shopLogo','https://e3sl2viw1q4ta7me-10007535.file.myqcloud.com/ff933806fce411614341.jpg');
                    adcs.set('address','山西省太原市');
                    adcs.set('agreeState',0)
                    return adcs;
                  }
                  that.data.cPage[0].forEach(cUnitId=>{
                    if(cs.indexOf(cUnitId)<0){sChannel.add(addcs(cUnitId))}
                  })
                };
                AV.Object.saveAll(sChannel).then(()=>{
                  app.logData.push([Date.now(), app.roleData.shopName+'厂家签约'])
                }).catch(error=>{ app.logData.push([Date.now(), '厂家签约发生错误:' + error.toString()]) })
              }
            });
          });
        }
      })
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }

})
