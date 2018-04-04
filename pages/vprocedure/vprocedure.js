// 浏览pages
const { readShowFormat } = require('../../model/initForm.js');
var app=getApp()
Page({
  data:{
    uEV: app.roleData.user.emailVerified,
    enUpdate: false,
    pno:'goods',
    vData: {},
    reqData: []
  },
  inFamily:false,

  onLoad: function(options) {
    var that = this ;
    let cUnitName = app.roleData.user.emailVerified ? app.roleData.uUnit.uName : '体验用户';     //用户已通过单位和职位审核
    that.data.pno = options.pNo;
    let artid = Number(options.artId);
    let pClass = require('../../model/procedureclass.js')[that.data.pno];
    that.inFamily = (typeof pClass.afamily != 'undefined');
    that.data.vData = app.aData[that.data.pno][options.artId];
    readShowFormat(pClass.pSuccess, that.data.vData).then(req=>{
      that.data.reqData=req;
      that.data.enUpdate = typeof that.data.vData.shopId!='undefined' && typeof pClass.suRoles!='undefined';  //有本店信息且流程有上级审批的才允许修改
      that.setData(that.data);
    });
    wx.setNavigationBarTitle({
      title: (that.inFamily ? pClass.afamily[that.data.vData.afamily] : pClass.pName) + '--' + that.data.vData.uName,
    })
  },

  fEditProcedure: function(e){
    var that = this;
    var url='/inputedit/fprocedure/fprocedure?pNo='+that.data.pno;
    switch (e.currentTarget.id){
      case 'fModify' :
        url += '&artId='+that.data.vData.objectId;
        break;
      case 'fTemplate' :
        url += that.inFamily ? '&artId='+that.data.vData.afamily : '';
        let newRecord = that.inFamily ? that.data.pno+that.data.vData.afamily : that.data.pno;
        app.aData[that.data.pno][newRecord] = that.data.vData;
        break;
    };
    wx.navigateTo({ url: url});
  }
})
