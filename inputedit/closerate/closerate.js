//访问购买率（成交率）分析
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
      Promise.all([countData(mInterval,'Order','status','1'),
        countData(mInterval, 'browseLog', 'pModel', 'goods')]).then(()=>{
        var yms = mInterval.map(([year, Mon, yearMon])=>{return yearMon});
        var closerates = [];
        yms.forEach(ym=>{closerates.push( app.aCount.goodsCount[ym]==0 ? 0 : app.aCount.orderCount[ym]/app.aCount.goodsCount[ym]*100)})
        new wxCharts({
          canvasId: 'columnCanvas',
          type: 'column',
          categories: yms,
          series: [{
              name: '成交率',
              data: closerates
          }],
          yAxis: {
              format: function (val) {
                  return val + '%';
              }
          },
          width: app.sysinfo.windowWidth,
          height: app.sysinfo.windowWidth
        });
      }).catch( console.error )
    };
  },
})
