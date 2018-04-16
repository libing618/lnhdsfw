// 浏览
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
  startTime: new Date(),

  onLoad: function(options) {
    var that = this ;
    let nowPages = getCurrentPages();
    let rtUrl = 0;
    that.data.pno = options.pNo;
    let pClass = require('../../model/procedureclass.js')[that.data.pno];
    that.inFamily = (typeof pClass.afamily != 'undefined');
    if (nowPages.length == 1) {
      rtUrl = '/pages/home/home';
      let proGoodsUpdate = app.configData.goods.updatedAt;
      initConfig(app.configData).then(icData => {
        app.configData = icData;
        if (app.configData.goods.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
        loginAndMenu(AV.User.current(), app.roleData).then(rData => {
          app.roleData = rData;
        }),
        wx.setStorage({ key: 'configData', data: app.configData });
      }).catch(console.error)
    }
    return new Promise((resolve, reject) => {
      if (app.aData[that.data.pno][options.artId]){
        resolve(true)
      } else {
        AV.Object.createWithoutData(that.data.pno,options.artId).fetch().then(getData=>{
          app.aData[that.data.pno][options.artId] = getData.toJSON();
          resolve(true)
        }).catch(resolve(false))
      }
    }).then(canView=>{
      if (canView){
        that.data.vData = app.aData[that.data.pno][options.artId];
        readShowFormat(pClass.pSuccess, that.data.vData).then(req=>{
          that.data.reqData=req;
          that.data.enUpdate = typeof that.data.vData.shopId!='undefined' && typeof pClass.suRoles!='undefined';  //有本店信息且流程有上级审批的才允许修改
          that.setData(that.data);
        });
      } else {
        wx.showToast({ title: '数据传输有误',icon:'loading', duration: 2500 });
        setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
      }
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
  },

  onUnload: function () {             //进入后台时缓存数据。
    var that = this;
    let browseLog=wx.getStorageSync('browseLog') || [];  //如有旧日志则拼成一个新日志数组
    let userId = app.roleData.user.objectId=='0' ? app.configData.browser : app.roleData.user.objectId;
    browseLog.push({ userId: userId, pModel: that.data.pno, broweObject: that.data.vData.objectId, sjid:app.configData.sjid,channelid:app.configData.channelid,startTime:that.startTime, stayTime:new Date()-that.startTime})
    wx.setStorage({
      key: 'browseLog',
      data: browseLog
    })
  },

  onShareAppMessage: function () {
    if (this.data.vData.objectId.indexOf(this.data.pno)<0){
      return {
        title: '扶贫济困，共享良品。',
        desc: '乐农汇',
        path: 'pages/vprocedure/vprocedure?sjid='+app.roleData.user.objectId+'&pNo='+this.data.pno+'&artId='+this.data.vData.objectId
      }
    } else {
      wx.showToast({title:'本地文件不能共享！',icon:'none'})
    }
  }
})
