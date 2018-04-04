//销售收入分析
const AV = require('../../../libs/leancloud-storage.js');
var wxCharts = require('../../../libs/wxcharts-min.js');
var app = getApp()
Page({
  onReady: function () {
    var that = this;
    if (app.roleData.role.unit){                     //用户有所属单位
      var income = wx.getStorageSync('income'+app.roleData.role.unit) || [];                  //产品成交率
      new wxCharts({
        canvasId: 'areaCanvas',
        type: 'area',
        categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
        series: [{
            name: '本年成交额',
            data: [70, 40, 65, 100, 34, 18],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }, {
            name: '去年成交额',
            data: [15, 20, 45, 37, 4, 80],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }],
        yAxis: {
            format: function (val) {
                return val + '万';
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
