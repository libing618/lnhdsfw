const { updateRoleData } = require('../../model/initupdate.js');
const { integration,unitData } = require('../../model/initForm.js');
const {indexClick} = require('../../util/util.js');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data:{
    mPage: [],
    pNo: 'order',                       //流程的序号5为成品信息
    pageData: {},
    iClicked: '0',
    mSum: {},
    grids:[]
  },
  onLoad:function(options){
    this.setPage(app.mData.order[app.roleData.uUnit.objectId]);
  },

  setPage: function(iu){
    if (iu){
      let fields = ['canSupply', 'cargoStock'];
      let sLength = 2;
      let fieldSum = new Array(sLength);
      let mSum = {};
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      if (app.mData.order[app.globalData.user.objectId]){
        app.mData.order[app.globalData.user.objectId].forEach(mId=>{
          mSum[mId] = [];
          for (let i = 0; i < sLength; i++) {mSum[mId].push(0)};
          app.aData.order[app.globalData.user.objectId][mId].cargo.forEach(aId=>{
            for (let i=0;i<sLength;i++){
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i]+app.aData.cargo[aId][fields[i]];
            }
          })
        })
      }
      this.setData({
        mPage:app.mData.order[app.globalData.user.objectId],
        pageData:app.aData.order,
        pandect:fieldSum,
        mSum: mSum
      })
    }
  },

  onReady:function(){
    updateRoleData(true,'order').then(isupdated=>{this.setPage(isupdated)});
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.roleData.uUnit.uName+'的销售管理' : '用户体验销售管理',
    })
    this.setData({grids: aimenu(app.roleData.wmenu.marketing, 'marketing')})
  },

  indexClick:indexClick,

  onPullDownRefresh: function() {
    updateRoleData(true,'order').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom: function() {
    updateRoleData(false,'order').then(isupdated=>{ this.setPage(isupdated) });
  }
})
