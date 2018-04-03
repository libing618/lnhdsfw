const { updateRoleData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {indexClick} = require('../../util/util.js');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data:{
    tiringRoom: app.globalData.user.mobilePhoneVerified && app.configData.tiringRoom,
    mPage: app.mData.product[app.roleData.uUnit.objectId],
    pNo: "orderlist",                       //流程的序号5为成品信息
    pageData: unitData('cargo'),
    iClicked: '0',
    grids: []
  },
  onLoad:function(options){
    this.setPage(app.mData.orderlist[app.roleData.uUnit.objectId]);
  },

  setPage: function(iu){
    if (iu){
      let fields = ['sold', 'reserve', 'payment', 'delivering', 'delivered'];
      let sLength = 5;
      let fieldSum = new Array(sLength);
      let mSum = {};
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      if (app.mData.orderlist[app.globalData.user.objectId]){
        app.mData.orderlist[app.globalData.user.objectId].forEach(mId=>{
          mSum[mId] = [];
          for (let i = 0; i < sLength; i++) {mSum[mId].push(0)};
          app.aData.orderlist[app.globalData.user.objectId][mId].cargo.forEach(aId=>{
            for (let i=0;i<sLength;i++){
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i]+app.aData.cargo[aId][fields[i]];
            }
          })
        })
      }
      this.setData({
        mPage:app.mData.orderlist[app.globalData.user.objectId],
        pageData:app.aData.orderlist,
        pandect:fieldSum,
        mSum: mSum
      })
    }
  },

  onReady:function(){
    updateRoleData(true,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.roleData.uUnit.uName+'的客户服务' : '用户体验客户服务',
    });
    this.setData({ grids: aimenu(app.roleData.wmenu.customer, 'customer')})
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateRoleData(true,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateRoleData(false,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
  }
})
