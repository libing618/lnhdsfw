const { readAllData,updateRoleData } = require('../../model/initupdate.js');
const { integration } = require('../../model/initForm.js');
const { getMonInterval,sumData,countData } = require('../../model/dataAnalysis.js');
const {droneId,master,slave} = require('../../libs/goodstype')
const {indexClick} = require('../../libs/util.js');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data:{
    tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
    pNo: 'goods',                       //流程
    pMasterNo: -1,
    goodsIndex: app.configData.goodsIndex,
    droneId: droneId,
    master: master,
    slave: slave,
    goodsPage: {},                 //页面管理数组
    pageData: {},
    iClicked: '0',
    mSum: {},
    grids:[]
  },
  onShow:function(options){
    let tRoom = app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom;
    if (tRoom != this.data.tiringRoom){
      this.setData({
        tiringRoom: tRoom,
  //      goodsIndex: app.configData.goodsIndex,
        grids: tRoom ? aimenu(app.roleData.wmenu.marketing, 'marketing') : []
      })
    };
    this.setPage(app.mData.goods);
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
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
    this.setData({
      goodsIndex: app.configData.goodsIndex
    })
  //  updateRoleData(true,'order').then(dUpdated=>{ if(dUpdated) {sumData('order',['amount','return'])} });
  },

  f_pickMaster: function(e){                           //选择打开的主数组下标
    let masterNo = Number(e.currentTarget.id);
    if (this.data.pMasterNo != masterNo){
      this.setData({
        pMasterNo: masterNo,
        iClicked: '0'
      });
    }
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
//    updateRoleData(true,'order').then(dUpdated=>{this.sumData(dUpdated)});
  },
  onReachBottom: function() {
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: require('../../libs/util').shareMessage
})
