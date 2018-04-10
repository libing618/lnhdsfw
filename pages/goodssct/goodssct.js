//商品选择pages
var app = getApp();
Page({                       //选择产品类型后列出该类产品并选择产品返回ID号
  data:{
    goods: [],
    proShow: '',
    pNo: 6,
    pageData: {}
  },
  reqField: '',
  prevPage: {},
  onLoad:function(options){
    var that = this;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    that.reqField = that.prevPage.data.selectd<0 ? 'vData.'+options.reqName : 'vData.'+options.reqName+'['+that.prevPage.data.selectd+'].c';
      that.setData({
        goods: app.mData.goods,
        pageData: app.aData.goods
      })
  },

  cSure: function(e) {
    let prevSet = {};
    prevSet[this.reqField] = app.aData.goods[e.currenttarget.id];
    this.prevPage.setData( prevSet );
    wx.navigateBack({ delta: 1 }) // 回退前 delta(默认为1) 页面
  }

})
