//销售收入分析
const { updateRoleData } = require('../../model/initupdate.js');
const { getMonInterval,sumData } = require('../../model/dataAnalysis.js');
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
      sumData(mInterval.yearMon,'distribution',['income','amount']).then((fSum)=>{
      new wxCharts({
        canvasId: 'areaCanvas',
        type: 'area',
        categories: mInterval.yearMon,
        series: [{
            name: '成交额',
            data: fSum.pandect[0],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }, {
            name: '分红额',
            data: fSum.pandect[1],
            format: function (val) {
                return val.toFixed(2) + '万';
            }
        }],
        yAxis: {
            format: function (val) {
                return val + '万';
            }
        },
        width: app.sysinfo.windowWidth,
        height: app.sysinfo.windowWidth
      });
    }
  },
})
