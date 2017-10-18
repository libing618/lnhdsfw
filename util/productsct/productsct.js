//产品类型选择pages
var app = getApp()
var productPage = {                       //选择产品类型后列出该类产品并选择产品返回ID号
  data:{
    reqData:[
      { n: 0, inclose: false, gname: "proType", p: '产品类型', t: "producttype", apdclist: app.uUnit.indType, apdvalue:[0, 0, 0] },
    ],
    products: app.mData.products,
    proShow: '',
    pNo: 3,
    pageData: app.aData[3]
  },
  reqField: '',
  prevPage: {},
  onLoad:function(options){
    var that = this;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    that.reqField = that.prevPage.data.selectd<0 ? 'vData.'+options.reqName : 'vData.'+options.reqName+'['+that.prevPage.data.selectd+'].c';
  },

  fapdsct: function(e){
    this.setData({proShow:e.detail.value.proType})
  },

  fapdReset: function(e){
    this.setData({proShow:''})
  },

  cSure: function(e) {
    let prevSet = {};
    prevSet[this.reqField] = this.data.goods[Number(e.target.id)];
    this.prevPage.setData( prevSet );
    wx.navigateBack({ delta: 1 }) // 回退前 delta(默认为1) 页面
  }
}
productPage['i_producttype'] = require('../../libs/weimport.js').i_producttype;
Page(productPage)
