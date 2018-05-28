// 客户分析
const { checkRols,updateRoleData } =  require('../../model/initForm');
const { countSort } = require('../../model/dataAnalysis.js');
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  data:{
    ht:{
      navTabs: ['性别', '城市', '省份'],
      fLength: 3,
      pageCk: 0
    },
    pw: app.sysinfo.pw
  },
  sumSort: [],

  onReady:function(){
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      countSort('_User', ['gender', 'city', 'province']).then(resSort=>{
        that.sumSort = resSort;
        that.setCanvas();
      }).catch( console.error )
    };
  },

  setCanvas: function () {
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: this.sumSort[this.data.ht.pageCk],
      width: app.sysinfo.windowWidth,
      height: app.sysinfo.windowWidth,
      dataLabel: true
    });
  },

  hTabClick: function (e) {                                //点击tab
    this.setData({
      "ht.pageCk": Number(e.currentTarget.id)
    });
    this.setCanvas()
  }

})
