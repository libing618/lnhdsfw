const { readAllData } = require('../../model/initupdate');
const {tabClick} = require('../../util/util');
var app = getApp()
Page({
  data: {
    autoplay: true,
    scrollTop : 0,
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    mPage: app.mData.articles,
    pNo: 'articles',                       //文章类信息
    pageData: app.aData.articles,
    tabs: ["厂商品牌", "产品宣传"],
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: app.roleData.iMenu.manage
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mPage:app.mData.articles,
        pageData:app.aData.articles
      })
    }
  },

  onReady: function(){
    readAllData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });        //更新缓存以后有变化的数据
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})
