//交易状况及提现
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
          new wxCharts({
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [{
              name: '订单',
              data: 50,
            }, {
              name: '已付',
              data: 1,
            }, {
              name: '发货',
              data: 30,
            }, {
              name: '已签收',
              data: 1,
            }, {
              name: '保证金',
              data: 1,
            }, {
              name: '已结算',
              data: 46,
            }],
            width: app.sysinfo.windowWidth,
            height: app.sysinfo.windowWidth,
            dataLabel: true
          });
      }).catch( console.error )
    };
  }

})
