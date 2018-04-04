const { readAllData, tabClick } = require('../../model/initupdate');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data: {
    autoplay: true,
    tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
    mSwiper: app.mData.articles[0],
    scrollTop : 0,
    scrollHeight: app.sysinfo.windowHeight-80,
    mPage: [app.mData.articles[1],app.mData.articles[3]],
    pNo: 'articles',                       //文章类信息
    pageData: app.aData.articles,
    fLength:2,
    tabs: ["厂商品牌", "产品宣传"],
    pageCk: app.mData.pCk1,
    wWidth: app.sysinfo.windowWidth,
    grids: []
  },

  setPage: function(iu){
    if (iu){
      this.setData({
        mSwiper: app.mData.articles[0],
        mPage:[app.mData.articles[1],app.mData.articles[3]],
        pageData:app.aData.articles
      })
    }
  },

  onReady: function(){
    readAllData(true,'articles').then(isupdated=>{ this.setPage(isupdated) });        //更新缓存以后有变化的数据
    this.grids = aimenu(app.roleData.wmenu.manage, 'manage')
    this.grids[0].mIcon = app.roleData.user.avatarUrl; //把微信头像地址存入第一个菜单icon
    this.setData({grids:this.grids})
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true, 'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false, 'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/home/home' // 分享路径
    }
  }
})
