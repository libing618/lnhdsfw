// 浏览
const AV = require('../../libs/leancloud-storage.js');
const { initConfig, loginAndMenu,initLogStg } = require('../../model/initForm.js');
const { readShowFormat } = require('../../libs/util');
var app=getApp()
Page({
  data:{
    uEV: app.roleData.user.emailVerified,
    enUpdate: false,
    pNo:'goods',
    pw: app.sysinfo.pw,
    sPages: ['viewFields'],
    vData: {},
    vFormat: []
  },
  inFamily:false,
  startTime: new Date(),

  onLoad: function(options) {
    var that = this ;
    let rtUrl = 0;
    that.data.pNo = options.pNo;
    that.inFamily = (typeof app.fData[that.data.pNo].afamily != 'undefined');
    return new Promise((resolve, reject) => {
      let nowPages = getCurrentPages();
      if (nowPages.length == 1) {
        rtUrl = '/pages/home/home';
        let proGoodsUpdate = app.configData.units.updatedAt;
        initConfig(app.configData).then(icData => {
          app.configData = icData;
          if (app.configData.units.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
          loginAndMenu(AV.User.current(), app.roleData).then(rData => {
            app.roleData = rData;
            initLogStg(options.pNo);
            resolve(true);
          });
        })
      } else { resolve(false) }
    }).then(() => {
      return new Promise((resolve, reject) => {
        if (app.aData[that.data.pNo][options.artId]){
          resolve(true)
        } else {
          AV.Object.createWithoutData(that.data.pNo,options.artId).fetch().then(getData=>{
            app.aData[that.data.pNo][options.artId] = getData.toJSON();
            resolve(true)
          }).catch(reject(false))
        }
      })
    }).then(canView=>{
      that.data.vData = app.aData[that.data.pNo][options.artId];
      readShowFormat(app.fData[that.data.pNo].pSuccess, that.data.vData).then(({vFormat,fModal})=>{
        that.data.vFormat=vFormat;
        if (fModal){that.f_modalFieldView = require('../../model/controlModal').f_modalFieldView}
        that.data.enUpdate = typeof that.data.vData.shopId!='undefined' && typeof app.fData[that.data.pNo].suRoles!='undefined';  //有本店信息且流程有上级审批的才允许修改
        that.setData(that.data);
      });
    }).catch( error=>{
      wx.showToast({ title: '数据传输有误',icon:'loading', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    })
  },

  fEditProcedure: function(e){
    var that = this;
    var url='/inputedit/fprocedure/fprocedure?pNo='+that.data.pNo;
    switch (e.currentTarget.id){
      case 'fModify' :
        url += '&artId='+that.data.vData.objectId;
        break;
      case 'fTemplate' :
        url += that.inFamily ? '&artId='+that.data.vData.afamily : '';
        let newRecord = that.inFamily ? that.data.pNo+that.data.vData.afamily : that.data.pNo;
        app.aData[that.data.pNo][newRecord] = that.data.vData;
        break;
    };
    wx.navigateTo({ url: url});
  },

  onUnload: function () {             //进入后台时缓存数据。
    var that = this;
    let browseLog=wx.getStorageSync('browseLog') || [];  //如有旧日志则拼成一个新日志数组
    let userId = app.roleData.user.objectId=='0' ? app.configData.browser : app.roleData.user.objectId;
    browseLog.push({ userId: userId, pModel: that.data.pNo, broweObject: that.data.vData.objectId, promoter:app.configData.sjid,channel:app.configData.channelid,startTime:that.startTime, stayTime:new Date()-that.startTime})
    wx.setStorage({
      key: 'browseLog',
      data: browseLog
    })
  },

  onShareAppMessage: function () {
    if (this.data.vData.objectId.indexOf(this.data.pNo)<0){
      return {
        title: '扶贫济困，共享良品。',
        desc: '乐农汇',
        path: 'pages/vprocedure/vprocedure?sjid='+app.roleData.user.objectId+'&pNo='+this.data.pNo+'&artId='+this.data.vData.objectId
      }
    } else {
      wx.showToast({title:'本地文件不能共享！',icon:'none'})
    }
  }
})
