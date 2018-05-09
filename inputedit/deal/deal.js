//销售优惠
const { updateRoleData } = require('../../model/initupdate.js');
const { getMonInterval,sumData } = require('../../model/dataAnalysis.js');
var app = getApp()
Page({
  data:{
    ht:{
      navTabs: ['已用', '未用'],
      fLength: 2,
      pageCk: 0
    },
    pw: app.sysinfo.pw,
    cPage: [[],[]],
    pageData: {}
  },

  onReady:function(){
    var that = this;
    if (checkRols(3,app.roleData.user)) {
      let mInterval = getMonInterval();        //用户注册日到本月的月份信息数组
      sumData(mInterval.yearMon,'distribution',['income','amount']).then((fSum)=>{
        that.setData({fSum:fSum});
        that.setCanvas();
      }).catch( console.error )
    };
  },

  setCanvas: function () {
    new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: mInterval.yearMon,
      series: [{
          name: '成交额',
          data: that.data.fSum.pandect[0],
          format: function (val) {
              return val.toFixed(2) + '万';
          }
      }, {
          name: '优惠额',
          data: that.data.fSum.pandect[1],
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
  },

  hTabClick: function (e) {                                //点击tab
    this.data.ht.pageCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": this.data.ht.pageCk
    });
    if (this.data.ht.pageCk==0){this.setCanvas()}
  }
})
