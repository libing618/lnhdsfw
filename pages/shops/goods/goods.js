const { readAllData,updateData,classInFamily ,isAllData } = require('../../../model/initupdate');
const {droneId,master,slave} = require('../../../libs/goodstype')
var app = getApp()
Page ({
  data: {
    pNo: 'goods',                       //流程
    pMasterNo: -1,
    goodsIndex: app.configData.goodsIndex,
    droneId: droneId,
    master: master,
    slave: slave,
    goodsPage: {},                 //页面管理数组
    pickSlaveId: '0',             //
    pageData: []
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空
    this.setPage(true);
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

  onReady: function(){
    readAllData(true, 'goods').then(isupdated => { this.setPage(isupdated) });
  },

  f_pickMaster: function(e){                           //选择打开的主数组下标
    let masterNo = Number(e.currentTarget.id);
    if (this.data.pMasterNo != masterNo){
      this.setData({
        pMasterNo: masterNo,
        pickSlaveId: '0'
      });
    }
  },

  f_pickSlave: function(e){                           //选择打开的从数组本身id
    this.setData({ pickSlaveId: e.currentTarget.id });
  },

  onPullDownRefresh:function(){
    readAllData(true,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false,'goods').then(isupdated=>{ this.setPage(isupdated) });
  },

  onShareAppMessage: function () {
    return {
      title: '乐农汇',
      desc: '扶贫济困，共享良品。',
      path: '/index/home/home?sjid='+app.roleData.user.objectId
    }
  }
})
