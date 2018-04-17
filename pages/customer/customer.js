const { updateRoleData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {indexClick} = require('../../libs/util.js');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data:{
    tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
    mPage: app.mData.orderlist[app.roleData.shopId],
    pNo: "orderlist",                       //订单信息
    pageData: {},
    iClicked: '0',
    grids: []
  },
  onShow:function(options){
    this.setData({
      tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
      grids: (app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom) ? aimenu(app.roleData.wmenu.customer, 'customer') : []
    })
    this.setPage(app.mData.orderlist[app.roleData.shopId]);
  },

  setPage: function(iu){
    if (iu){
      let fields = ['sold', 'reserve', 'payment', 'delivering', 'delivered'];
      let sLength = 5;
      let fieldSum = new Array(sLength);
      let mSum = {};
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      if (app.mData.orderlist[app.roleData.user.objectId]){
        app.mData.orderlist[app.roleData.user.objectId].forEach(mId=>{
          mSum[mId] = [];
          for (let i = 0; i < sLength; i++) {mSum[mId].push(0)};
          app.aData.orderlist[app.roleData.user.objectId][mId].cargo.forEach(aId=>{
            for (let i=0;i<sLength;i++){
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i]+app.aData.cargo[aId][fields[i]];
            }
          })
        })
      }
      this.setData({
        mPage:app.mData.orderlist[app.roleData.user.objectId],
        pageData:app.aData.orderlist,
        pandect:fieldSum,
        mSum: mSum
      })
    }
  },

  onReady:function(){
    updateRoleData(true,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateRoleData(true,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateRoleData(false,'orderlist').then(isupdated=>{ this.setPage(isupdated) });
  }
})
