//交易状况
const { checkRols,updateRoleData } = require('../../model/initForm');
const { getMonInterval,countData } = require('../../model/dataAnalysis.js');
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
      sumFamily('orderlist',['amount','quantity'],app.fData.orderlist.afamily.length).then(sf=>{
        that.pieData = sf;
        that.setCanvas();
      }).catch( console.error )
    };
  },

  setCanvas: function(){
    let pieData = [];
    for (let i=0;i<app.fData.orderlist.afamily.length;i++){
      pieData.push({name:app.fData.orderlist.afamily[i],data:this.pieData[i]})
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
