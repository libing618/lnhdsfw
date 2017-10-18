//流量分析
const AV = require('../../../libs/leancloud-storage.js');
var wxCharts = require('../../../libs/wxcharts-min.js');
var app = getApp()
Page({
  onReady: function () {
    var that = this;
    if (app.globalData.role.unit){                     //用户有所属单位
      var goodslog = wx.getStorageSync('goodslog'+app.globalData.role.unit) || [];                 //产品访问量
      var artlog = wx.getStorageSync('artlog'+app.globalData.role.unit) || [];                  //文章访问量
      new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
        series: [{
            name: '产品访问量',
            data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }, {
            name: '文章访问量',
            data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }],
        yAxis: {
            title: '访问量',
            format: function (val) {
                return val.toFixed(2);
            },
            min: 0
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