const {User} = require('../../libs/leancloud-storage.js');
const { integration } = require('../../model/initupdate');
const { readAllData,initConfig, loginAndMenu, initLogStg,shareMessage } = require('../../model/initForm.js');
const { getMonInterval,sumData,countData } = require('../../model/dataAnalysis.js');
const {droneId,master,slave} = require('../../libs/goodstype')
const { indexClick } = require('../../libs/util');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data:{
    tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
    pNo: 'goods',                       //流程
    statusBar: app.sysinfo.statusBarHeight,
    pMasterNo: -1,
    goodsIndex: app.configData.goodsIndex,
    droneId: droneId,
    master: master,
    slave: slave,
    goodsPage: {},                 //页面管理数组
    pageData: {},
    idClicked: '0',
    mSum: {},
    grids:[]
  },
  onLoad: function(options) {
    var that = this ;
    return new Promise((resolve, reject) => {
      if (app.configData.path == 'pages/marketing/marketing') {
        let proGoodsUpdate = app.configData.goods.updatedAt;
        initConfig(app.configData).then(icData => {
          app.configData = icData;
          if (app.configData.goods.updatedAt != proGoodsUpdate) { app.mData.pAt.goods = [new Date(0).toISOString(), new Date(0).toISOString()] };   //店铺签约厂家有变化则重新读商品数据
          loginAndMenu(User.current(), app.roleData).then(rData => {
            app.roleData = rData;
            initLogStg('marketing');
            resolve(true);
          });
        })
      } else { resolve(false) }
    }).then(()=>{
      readAllData(true, 'goods').then(isupdated => {
        this.setData({
          tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
          goodsIndex: app.configData.goodsIndex
        });
        that.setPage(true)
      })
    }).catch(console.error);
  },

  onShow:function(options){
    this.setData({
      tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom
    })
  },

  setPage: function(iu){
    if (iu){
      let gPage = {},slaveData;
      droneId.forEach(ms=>{
        ms.slaveId.forEach(sId=>{
          slaveData = app.mData.goods.filter(goodsId=> {return app.aData.goods[goodsId].goodstype==sId});
          if (slaveData.length>0) {gPage[sId]=slaveData}
        })
      })
      this.setData({
        goodsPage: gPage,
        pageData:app.aData.goods
      })
    }
  },

  onReady:function(){
    if (app.roleData.user.mobilePhoneVerified){
      let showPage = {};
      showPage.grids = aimenu(app.roleData.wmenu.marketing, 'marketing')
      let mInterval = getMonInterval();        //用户注册日到本月的月份信息数组
      Promise.all([countData(mInterval,'Order','status','1').then(orderCount=>{showPage.orderCount = orderCount}),
        countData(mInterval, 'browseLog', 'pModel', 'goods').then(goodsCount => { showPage.goodsCount = goodsCount })]).then(()=>{
        this.setData(showPage);
      }).catch(error=>{
        this.setData(showPage);
        console.log(error)
      })
    };
  },

  f_pickMaster: function(e){                           //选择打开的主数组下标
    let masterNo = Number(e.currentTarget.id);
    if (this.data.pMasterNo != masterNo){
      this.setData({
        pMasterNo: masterNo,
        idClicked: '0'
      });
    }
  },

  f_pickSlave:indexClick,

  onPullDownRefresh: function() {
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: shareMessage
})
