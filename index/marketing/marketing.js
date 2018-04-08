const { readAllData,updateRoleData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {droneId,master,slave} = require('../../libs/goodstype')
const {indexClick} = require('../../util/util.js');
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
    this.setData({
      tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
      goodsIndex: app.configData.goodsIndex,
      grids: (app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom) ? aimenu(app.roleData.wmenu.marketing, 'marketing') : []
    })
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

  sumData: function(dataUpdated){
    if (dataUpdated){
      let fields = ['canSupply', 'cargoStock'];
      let sLength = 2;
      let fieldSum = new Array(sLength);
      let mSum = {};
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      if (app.mData.order[app.roleData.user.objectId]){
        app.mData.order[app.roleData.user.objectId].forEach(mId=>{
          mSum[mId] = [];
          for (let i = 0; i < sLength; i++) {mSum[mId].push(0)};
          app.aData.order[app.roleData.user.objectId][mId].cargo.forEach(aId=>{
            for (let i=0;i<sLength;i++){
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i]+app.aData.cargo[aId][fields[i]];
            }
          })
        })
      }
      this.setData({
        pandect:fieldSum,
        mSum: mSum
      })
    }
  },

  onReady:function(){
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
    updateRoleData(true,'order').then(dUpdated=>{this.sumData(dUpdated)});
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
    updateRoleData(true,'order').then(dUpdated=>{this.sumData(dUpdated)});
  },
  onReachBottom: function() {
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  }
})
