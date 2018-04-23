//地址编辑
const AV = require('../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    adclist: require('../../model/addresclass.js'),   //读取行政区划分类数据
    adglist: [],
    saddv: 0,
    adcvalue: [3, 9, 15],
    adgvalue: [0, 0]
  },
  regionName: '',
  reqField: '',
  prevPage: {},

  onLoad: function (options) {
    var that = this;
    that.reqField = 'vData.' + options.reqName;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    that.setData({
      address1: that.prevPage.data.vData[options.reqName].sName,
      saddv: that.prevPage.data.vData[options.reqName].code
    });
  },

  faddclass: function (e) {                         //选择行政区划
    var val = e.detail.value;
    var saddv = 0;
    if (this.data.adcvalue[0] == val[0]){
      if (this.data.adcvalue[1] == val[1]) {
        saddv = this.data.adclist[val[0]].st[val[1]].ct[val[2]].c;
        this.regionName = this.data.adclist[val[0]].n + this.data.adclist[val[0]].st[val[1]].n + this.data.adclist[val[0]].st[val[1]].ct[val[2]].n;
        this.setData({ address1: this.regionName });
      } else { val[2]=0 }
    } else { val[1]=0 }
    this.setData({ adcvalue: val, saddv: saddv });
  },

  raddgroup: function (e) {                     //读村镇区划数据
    var that = this;
    if (that.data.saddv != 0) {
      return new AV.Query('ssq4')
        .equalTo('tncode', that.data.saddv)
        .find()
        .then((results) => {
          let adgroup = results[0].toJSON() ;
          that.setData({ adglist: adgroup.tn });
        }).catch((error) => { console.log(error) });
    };
  },

  saddgroup: function (e) {                         //选择村镇
    var val = e.detail.value;
    var saddg = 0;
    if (this.data.adgvalue[0] == val[0]) {
      this.setData({ address1: this.regionName + this.data.adglist[val[0]].n + this.data.adglist[val[0]].cm[val[1]].n });
    }
    this.setData({ adgvalue: val });
  },

  i_address: function (e) {
    var that = this;
    let reqField = {};
    reqField[that.reqField] = { code: that.data.saddv, sName: e.detail.value.address1 + e.detail.value.address2 };
    that.prevPage.setData( reqField, ()=>{wx.navigateBack({ delta: 1 })} );         //回退前 delta(默认为1) 页面
  }
})
