//退换货
const { getMonInterval,readRoleData,allUpdateData,aDataSum } = require('../../model/dataAnalysis.js');
const { checkRols } = require('../../model/initForm');
var app = getApp()
Page({
  data:{
    ht:{
      navTabs: ['退货', '退款', ' 换发'],
      fLength: 3,
      pageCk: 0
    },
    statusBar: app.sysinfo.statusBarHeight,
    cPage: [[],[],[]],
    pageData: {},
    sPages: [{
      pageName: 'tabPanelPage'
    }],
    iFormat: app.fData.orderlist.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  sMons:[],
  fSum: {},

  onReady:function(){
    var that = this;
    if (checkRols(3,app.roleData.user)) {
      that.sMons = getMonInterval().yearMon;        //用户注册日到本月的月份信息数组
      return new Promise.all([readRoleData('cargoSupplies'),allUpdateData('returns')]).then(()=>{
        let pageData = {};
        let pageSuccess = app.fData.returns.pSuccess;
        app.mData.returns.forEach(ufod=>{
          if (app.mData.cargoSupplies.indexOf(ufod)>=0){
            let pck = 0;
            pageData[ufod] = {uName:app.aData.cargoSupplies[ufod].uName,thumbnail:app.aData.cargoSupplies[ufod].thumbnail};
            if (app.aData.returns[ufod].returnAmount){       //退款额有数据
              pck = 1;
            } else {
              if (app.aData.returns[ufod].invoice){ pck=2 }; }       //如换货单号有数据
            that.data.cPage[pck].push(ufod);
            pageData[ufod].title = pageSuccess[pck+1].p+app.aData.returns[ufod][pageSuccess[pck+1].gname] +'/'+ pageSuccess[0].p+app.aData.cargo[][app.aData.returns[ufod].cargo];
          }
        })
        that.setData({
          cPage: that.data.cPage,
          pageDaga: pageData
        });
        that.fSum.push(aDataSum(that.sMons,'cargoSupplies',['amount'],that.data.cPage[0]));
        that.fSum.push(aDataSum(that.sMons,'returns',['returnAmount'],that.data.cPage[1]));
        that.fSum.push(aDataSum(that.sMons,'returns',['returnPrice'],that.data.cPage[2]));
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
            return val.toFixed(2) + '元';
        }
      }, {
        name: that.data.ht.pageCk== 1 ? '退货额' : '换货额',
        data: that.fSum[that.data.ht.pageCk],
        format: function (val) {
            return val.toFixed(2) + '元';
        }
      }],
      yAxis: { format: function (val) { return val + '万'; } },
      width: app.sysinfo.windowWidth,
      height: app.sysinfo.windowWidth
    });
  },

  hTabClick: function (e) {                                //点击tab
    this.data.ht.pageCk = Number(e.currentTarget.id)
    this.setData({
      "ht.pageCk": this.data.ht.pageCk
    });
    if (this.data.ht.pageCk!=0){this.setCanvas()}
  }
})
