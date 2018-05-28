//交易状况及提现
const { checkRols,updateRoleData } =  require('../../model/initForm');
const { getMonInterval,countData } = require('../../model/dataAnalysis.js');
const orderListFamily = require('../../model/procedureclass').orderlist.afamily;
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  data:{
    pw: app.sysinfo.pw
  },
  pieSumData: [],
  onReady: function () {
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      sumFamily('orderlist',['amount','quantity'],6).then(sf=>{
        that.pieData = sf;
        that.setCanvas();
      }).catch( console.error )
    };
  },

  setCanvas: function(){
    let pieData = [];
    for (let i=0;i<orderListFamilyist.length;i++){
      pieData.push({name:orderListFamily[i],data:this.pieData[this.data.ht.pageCk]})
    }
    new wxCharts({
      canvasId: 'ringCanvas',
      type: 'ring',
      series: pewData,
      width: app.sysinfo.windowWidth,
      height: app.sysinfo.windowWidth,
      dataLabel: true
    });
  },

  hTabClick: function (e) {                                //点击tab
    this.data.ht.pageCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": this.data.ht.pageCk
    });
    this.setCanvas()
  }
})
