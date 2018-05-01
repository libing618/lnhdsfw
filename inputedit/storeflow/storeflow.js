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
      Promise.all([countData(mInterval,'browseLog', 'pModel', 'artshop').then(bg=>{yms=bg.yearMon}),
        countData( mInterval,'browseLog', 'pModel', 'goods')]).then(()=>{
        var goodsBrowse = [],artshopBrowse = [];
        yms.forEach(ym=>{
          goodsBrowse.push( app.aCount.browseLoggoods[ym] );
          artshopBrowse.push(app.aCount.browseLogartshop[ym]);
        });
        new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: mInterval.yearMon,
          series: [{
              name: '产品访问量',
              data: goodsBrowse,
              format: function (val) {
                  return val + '次';
              }
          }, {
              name: '文章访问量',
              data: artshopBrowse,
              format: function (val) {
                  return val + '次';
              }
          }],
          yAxis: {
              title: '访问量',
              format: function (val) {
                return val + '次';
              },
              min: 0
          },
          width: app.sysinfo.windowWidth,
          height: app.sysinfo.windowWidth
        });
      });
    };
  }

})
