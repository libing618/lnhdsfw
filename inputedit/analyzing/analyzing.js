// 客户分析
const { updateRoleData } = require('../../model/initupdate.js');
const { getMonInterval,countData } = require('../../model/dataAnalysis.js');
var wxCharts = require('../../libs/wxcharts-min.js');
var app = getApp()
Page({
  data:{
    pw: app.sysinfo.pw
  },

  onReady:function(){
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      let mInterval = getMonInterval();        //用户注册日到本月的月份信息数组
      Promise.all([countData(mInterval,'Order','status','1'),
        countData(mInterval, 'browseLog', 'pModel', 'goods')]).then(()=>{

        
      }).catch( console.error )

    };
  }

})
