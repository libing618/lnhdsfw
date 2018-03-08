const { updateData } = require('../../model/initupdate');
const {openWxLogin,fetchMenu,iMenu,tabClick} = require('../../util/util');
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
    grids: []
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
    updateData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });        //更新缓存以后有变化的数据
  },
  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(that.data.userAuthorize).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo.toString()]);                      //用户授权时间记入日志
      that.setData({ userAuthorize: 0, grids: iMenu('manage') })
    }).catch( console.error );
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    updateData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    updateData(false,'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})
