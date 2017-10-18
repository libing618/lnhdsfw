// 浏览pages
var app=getApp()
Page({
  data:{
    uEV: false,
    viewData: {},
    reqData: []
  },

  onLoad: function(options) {
    var that = this ;
    let cUnitName = app.globalData.user.emailVerified ? app.uUnit.uName : '体验用户';     //用户已通过单位和职位审核
    if (typeof options.pNo =='number' && typeof options.artId =='string') {             //检查参数
      let apNo = 'prdct'+options.pNo;
      let pClass = require('../../libs/procedureclass.js')[options.pNo];
      that.data.reqData=pClass.pSuccess.map( rField=>{
        switch (rField.t){
          case 'sproduct' :
            rField.ad = app.aData[3];
            break;
          case 'afamily' :
            break;
        }
        return rField;
      })
      that.data.uEV = app.globalData.user.emailVerified && app.uUnit.objectId==app.aData[apNo][options.artId].unitId;
      that.data.pNo = options.pNo;
      that.data.viewData = app.aData[apNo][options.artId];
      that.setData(that.data);
      wx.setNavigationBarTitle({
        title: cUnitName+ '的' + pClass.afamily.constructor == 'Array' ? pClass.afamily[that.data.viewData.afamily] : ppClass.pName ,
      })
    }else{
      wx.showToast({ title: '数据传输有误，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }
  },

  fEditProcedure: function(e){
    var that = this;
    var url='/pages/fprocedure/fprocedure?pNo='+that.data.pNo;
    switch (e.currentTarget.id){
      case 'fModify' :
        url += '&artId='+that.data.viewData.objectId;
        break;
      case 'fTemplate' :
        if (typeof that.data.viewData.afamily=='number') {url += '&artId='+that.data.viewData.afamily};
        let proName=require('../libs/procedureclass.js')[that.data.pNo].pModle;
        app.aData[that.data.pNo][proName] = that.data.viewData;
        break;
    };
    wx.navigateTo({ url: url});
  }

})
