// 联系厂家
const {indexClick} = require('../../libs/util.js');
const { checkRols } =  require('../../model/initForm');
const { updateData } = require('../../model/initupdate');
var app = getApp();
Page({
  data:{
    statusBar: app.sysinfo.statusBarHeight，
    tPage: app.configData.units.fConfig,
    pageData: app.aData.manufactor,
    idClicked: '0'
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(5,app.roleData.user)) {
      updateData(true,'manufactor').then(isupdated=>{
        if (isupdated) {
          that.setData({
            cPage: app.configData.units.fConfig,
            pageData: app.aData.manufactor
          })
        }
      }).catch(console.error);
    };
  },

  indexClick: indexClick,

  makePhone: function({currentTarget:{id}}){
    wx.makePhoneCall({phoneNumber:id})
  }

})
