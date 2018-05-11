//销售优惠
const { getMonInterval,readRoleData,allUpdateData,aDataSum } = require('../../model/dataAnalysis.js');
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
    pageData: {},
    sPages: [{
      pageName: 'tabPanelPage'
    }],
    reqData: require('../../model/procedureclass').orderlist.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  sMons:[],
  fSum: {},

  onReady:function(){
    var that = this;
    if (checkRols(3,app.roleData.user)) {
      that.sMons = getMonInterval().yearMon;        //用户注册日到本月的月份信息数组
      return new Promise.all([readRoleData('orderlist'),allUpdateData('unfinishedorder')]).then(()=>{
        let pageData = {};
        app.mData.unfinishedorder.forEach(ufod=>{
          if (app.mData.orderlist.indexOf(ufod)>=0){
            pageData[ufod] = app.aData.unfinishedorder[ufod];
            if (app.aData.orderlist[ufod].afamily == 0){
              that.data.cPage[0].push(ufod);
            } else { that.data.cPage[1].push(ufod); }
          }
        })
        app.aData.unfinishedorder = pageData;
        that.fSum=aDataSum(that.sMons,'unfinishedorder',['amount','sale'],that.data.cPage[0]);
        that.setCanvas();
      }).catch( console.error )
    };
  },

  setCanvas: function () {
    var that = this;
    new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: that.sMons,
      series: [{
          name: '成交额',
          data: that.fSum[0],
          format: function (val) {
              return val.toFixed(2) + '万';
          }
      }, {
          name: '优惠额',
          data: that.fSum[1],
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
