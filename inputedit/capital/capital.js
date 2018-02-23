//资金状况及提现
const AV = require('../../../libs/leancloud-storage.js');
var wxCharts = require('../../../libs/wxcharts-min.js');
var app = getApp()
Page({
  onReady: function () {
    var that = this;
    if (app.globalData.role.unit){                     //用户有所属单位
      var income = wx.getStorageSync('income'+app.globalData.role.unit) || [];                  //产品成交率
      new wxCharts({
        canvasId: 'pieCanvas',
        type: 'pie',
        series: [{
            name: '订单',
            data: 50,
        }, {
            name: '发货',
            data: 30,
        }, {
            name: '已付',
            data: 1,
        }, {
            name: '保证金',
            data: 1,
        }, {
            name: '可提现',
            data: 46,
        }],
        width: 400,
        height: 300,
        dataLabel: true
      });   
    }else
    {
      wx.showModal({
        title: '请确认您的单位',
        content: '请确认您申请的所属单位已通过审批。',
        success: function(res) {
            if (res.confirm) {                          //用户点击确定
                wx.navigateBack({
                delta: 1,                             // 回退前 delta(默认为1) 页面
                })
            }
        }
      })        
    }
  },
})