//未发货物流信息
const AV = require('leancloud-storage.js');
const {checkRols,indexClick} = require('../../libs/util.js');
const { updateData } = require('../../model/initupdate');
var app = getApp();
Page({
  data:{
    pw: app.sysinfo.pw，
    tPage: [],
    pageData: {},
    unit: app.aData.manufactor,
    idClicked: '0'
  },
  csq: new AV.Query('cargoSupplies'),
  notEnd: true,
  onReady:function(){
    var that = this;
    if (checkRols(5,app.roleData.user)) {
      updateData(true,'manufactor').then(isupdated=>{
        if (isupdated) {
          that.setData({
            unit: app.aData.manufactor
          })
        }
      }).catch(console.error);
      that.csq.lessThan('afamily',2);
      that.csq.lessThan('createdAt',new Date(new Date().getTime()-172800000));   // 两天前新建订单
      that.csq.ascending('createdAt');
      that.csq.limit(100);
      that.updatePage();
    };
  },
  updatePage: function(){
    var that = this;
    if (that.notEnd){
      that.csq.find().then(logistics=>{
        if (logistics){
          logistics.forEach(logistic=>{
            that.data.tPage.push(logistic.id);
            that.data.pageData[logistic.id] = logistic.toJSON();
          })
          that.setData({
            tPage: that.data.tPage,
            pageData: that.data.pageDate
          })
          that.csq.skip(100);
        } else { that.notEnd = false }
      })
    }
  },

  indexClick: indexClick,

  makePhone: function({currentTarget:{id}}){
    wx.makePhoneCall({phoneNumber:id})
  },

  onReachBottom:function(){
    this.updatePage();
  }
})
