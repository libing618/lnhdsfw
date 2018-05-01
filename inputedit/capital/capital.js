//交易状况及提现
const { updateRoleData } = require('../../model/initupdate.js');
const { getMonInterval,countData } = require('../../model/dataAnalysis.js');
const orderListFamily = require('../../model/procedureclass').orderlist.afamily;
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  data:{
    pw: app.sysinfo.pw
  },
  onReady: function () {
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      sumFamily('orderlist',['amount','quantity'],6).then(sf=>{

      }).catch( console.error )
    };
  },

  setCanvas: function(num){
    let 
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: orderListFamily.map(afname=>{ return {name:afname,data:this.fSum[num,]})
        name: '订单',
        data: sf[num,0]
      }, {
        name: '已付',
        data: sf[num,0]
      }, {
        name: '发货',
        data: sf[num,0]
      }, {
        name: '已签收',
        data: sf[num,0]
      }, {
        name: '保证金',
        data: sf[num,0]
      }, {
        name: '已结算',
        data: sf[num,0]
      }],
      width: app.sysinfo.windowWidth,
      height: app.sysinfo.windowWidth,
      dataLabel: true
    });
  }

  hTabClick: function (e) {                                //点击tab
    let pCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": pCk
    });
  },
})
