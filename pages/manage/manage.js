const { readAllData, tabClick } = require('../../model/initupdate');
const aimenu = require('../../libs/allmenu.js').iMenu;
var app = getApp()
Page({
  data: {
    autoplay: true,
    tiringRoom: app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom,
    user: app.roleData.user,
    mSwiper: app.mData.articles[0],
    scrollTop : 0,
    scrollHeight: app.sysinfo.windowHeight-80,
    mPage: [app.mData.articles[1],app.mData.articles[3]],
    pNo: 'articles',                       //文章类信息
    pageData: app.aData.articles,
    fLength:2,
    tabs: ["厂商品牌", "产品宣传"],
    pageCk: app.mData.pCkarticles,
    wWidth: app.sysinfo.windowWidth,
    grids: []
  },

  onShow: function (options) {
    this.data.tiringRoom = app.roleData.user.mobilePhoneVerified && app.configData.tiringRoom
    if (this.data.tiringRoom) {
      this.data.grids = aimenu(app.roleData.wmenu.manage, 'manage')
      this.data.grids[0].mIcon = app.roleData.user.avatarUrl; //把微信头像地址存入第一个菜单icon
    }
    this.setData({
      tiringRoom: this.data.tiringRoom,
      user: app.roleData.user,
      grids: this.data.grids
    })
    this.setPage(app.mData.articles);
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
  },

  tabClick: tabClick,

  onPullDownRefresh:function(){
    readAllData(true, 'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    readAllData(false, 'articles').then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: require('../../libs/util').shareMessage
})
