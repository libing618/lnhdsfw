//调整当日成品生产计划
const AV = require('../../../libs/leancloud-storage.js');
const weutil = require('../../../util/util.js');
var app = getApp();

Page({
  data: {
    oNo: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空06
    var that = this;
    let oClass = require('../../../libs/operationclass.js')[1];
    if (weutil.checkRols(app.globalData.user.userRolName, oClass.ouRoles[ops.oState])) {  //检查用户操作权限
      that.setData({
        oArray: weutil.arrClose(oClass.oSuccess[ops.oNo].gname, app.nData[1]),     //确定数组分类字段
        pageData: app.oData[1],
        mPage: app.nData[1]
      });
      wx.setNavigationBarTitle({
        title: app.uUnit.nick + '的' + oClass.oprocess[ops.oState]
      })
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },


  onReady: function () {
    weutil.updateOperate(true, this.data.oState);                       //更新缓存以后有变化的数据
  },
  onPullDownRefresh: function () {
    weutil.updateOperate(true, this.data.oState);
  },
  onReachBottom: function () {
    weutil.updateOperate(false, this.data.oState);
  },
  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})
