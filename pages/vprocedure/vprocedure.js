// 浏览pages
const { readShowFormat } = require('../../model/initForm.js');
var app=getApp()
Page({
  data:{
    uEV: app.globalData.user.emailVerified,
    enUpdate: false,
    vData: {},
    reqData: []
  },
  pno:'articles',
  inFamily:false,

  onLoad: function(options) {
    var that = this ;
    let cUnitName = app.globalData.user.emailVerified ? app.roleData.uUnit.uName : '体验用户';     //用户已通过单位和职位审核
    that.pno = options.pNo;
    let artid = Number(options.artId);
    let pClass = require('../../model/procedureclass.js')[that.pno];
    that.inFamily = (typeof pClass.afamily != 'undefined');
    that.data.vData = app.aData[that.pno][options.artId];
    readShowFormat(pClass.pSuccess, that.data.vData).then(req=>{
      that.data.reqData=req;
      that.data.enUpdate = that.data.vData.unitId==app.roleData.uUnit.objectId && typeof pClass.suRoles!='undefined';  //本单位信息且流程有上级审批的才允许修改
      that.setData(that.data);
    });
    wx.setNavigationBarTitle({
      title: cUnitName+ '的' + (that.inFamily ? pClass.afamily[that.data.vData.afamily] : pClass.pName) ,
    })
  },

  fEditProcedure: function(e){
    var that = this;
    var url='/inputedit/fprocedure/fprocedure?pNo='+that.pno;
    switch (e.currentTarget.id){
      case 'fModify' :
        url += '&artId='+that.data.vData.objectId;
        break;
      case 'fTemplate' :
        url += that.inFamily ? '&artId='+that.data.vData.afamily : '';
        let newRecord = that.inFamily ? that.pno+that.data.vData.afamily : that.pno;
        app.aData[that.pno][newRecord] = that.data.vData;
        break;
    };
    wx.navigateTo({ url: url});
  }
})
