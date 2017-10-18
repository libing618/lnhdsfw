const weutil = require('../../util/util.js');
var app = getApp();
Page({
  data:{
    mPage: app.mData.prdct3,
    pName: 'production',
    tanbBar: app.tabBar,
    pNo: 3,                       //流程的序号3为产品服务类信息
    pageData: {},
    fLength: 2,
    tabs: ['我的产品','我的服务'],
    pageCk: app.mData.pCk3,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: app.wmenu[1]
  },
  onLoad:function(options){    // 生命周期函数--监听页面加载
    var that = this;
    let pageSetData = weutil.pName(3);
    pageSetData.pandect = '产品' + app.mData.prdct3[0].length + '种  服务' + app.mData.prdct3[1].length + '类';//'  众筹'XX只 上架商品XX 团购XX  成品库存XX 订单未发货XX单 运输过程商品XX单 已结款XXX元
    pageSetData.grids = app.wmenu[1]          //更新数据
    that.setData( pageSetData )
  },
  onReady: function(){
    weutil.updateData(true,3);                       //更新缓存以后有变化的数据
    wx.setNavigationBarTitle({
      title: app.globalData.user.emailVerified ? app.uUnit.uName+'的产品服务' : '用户体验产品服务',
    })
  },
  tabClick: weutil.tabClick,

  onPullDownRefresh:function(){
    weutil.updateData(true,3);
  },
  onReachBottom:function(){
    weutil.updateData(false,3);
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})
