//访问购买率（成交率）分析
const AV = require('../../libs/leancloud-storage.js');
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  onReady: function () {
    var that = this;
    if (app.roleData.role.unit){                     //用户有所属单位
      var closerate = wx.getStorageSync('closerate'+app.roleData.role.unit) || [];                  //产品成交率
      new wxCharts({
        canvasId: 'columnCanvas',
        type: 'column',
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: [{
            name: '本年成交率',
            data: [15, 20, 45, 37, 4, 80]
        }, {
            name: '去年成交率',
            data: [70, 40, 65, 100, 34, 18]
        }],
        yAxis: {
            format: function (val) {
                return val + '%';
            }
        },
        width: 400,
        height: 300
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
