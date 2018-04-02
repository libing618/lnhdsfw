const { updateData,classInFamily ,isAllData } = require('../../model/initupdate');
var app = getApp()
Page ({
  data: {
    pNo: 'goods',                       //流程
    pMasterNo: app.configData.goods
    goodsPage: {},                 //页面管理数组
    pickSlaveId: '0',             //
    pageData: []
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空
    var that = this;
    that.artid = Number(ops.artId);
    that.inFamily = classInFamily(ops.pNo);
    that.isAll = isAllData(ops.pNo);
    that.setData({
      pNo: ops.pNo,
      artId: isNaN(that.artid) ? ops.pNo : that.artid
    });
    that.setPage(true);
  },

  setPage: function(iu){     //有更新则重新传输页面数据
    if (iu){
      if (this.isAll){
        if (this.inFamily){
          this.data.mPage = app.mData[this.data.pNo][this.artid] || []
        } else {
          this.data.mPage = app.mData[this.data.pNo] || []
        }
      } else {
        if (this.inFamily){
          this.data.mPage = app.mData[this.data.pNo][app.roleData.uUnit.objectId][this.artid] || []
        } else {
          this.data.mPage = app.mData[this.data.pNo][app.roleData.uUnit.objectId] || []
        }
      }
      this.setData({
        mPage: this.data.mPage,
        pageData: app.aData[this.data.pNo]
      })
    }
  },

  onReady: function(){
    updateData(true,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});                       //更新缓存以后有变化的数据
  },
  onPullDownRefresh: function () {
    updateData(true,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});
  },
  onReachBottom: function () {
    updateData(false,this.data.pNo).then(isupdated=>{ this.setPage(isupdated)});
  },
  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})
