//流量分析
const { updateRoleData } = require('../../model/initupdate.js');
const { getMonInterval,countData } = require('../../model/dataAnalysis.js');
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  data:{
    pw: app.sysinfo.pw
  },
  onReady: function () {
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      let mInterval = getMonInterval();        //用户注册日到本月的月份信息数组
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
    };
  }

})
