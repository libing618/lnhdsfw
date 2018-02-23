const AV = require('../../libs/leancloud-storage.js');
const { updateData } = require('../../model/initupdate');
const {openWxLogin,fetchMenu,iMenu,tabClick} = require('../../util/util');
var app = getApp()
Page({
  data: {
    autoplay: true,
    scrollTop : 0,
    scrollHeight: app.globalData.sysinfo.windowHeight-80,
    mPage: app.mData.articles,
    pNo: 1,                       //流程的序号1为文章类信息
    pageData: app.aData.articles,
    tabs: ["品牌建设", "政策扶持", "我的商圈"],
    userAuthorize: -2,              //中间部分-2显示欢迎词，-1为授权按钮,0为用户授权,1为用户已注册
    pageCk: app.mData.pCk1,
    wWidth: app.globalData.sysinfo.windowWidth,
    grids: []
  },

  onLoad: function () {
    var that = this;
    return Promise.resolve( AV.User.current()).then(lcuser => {           //读缓存登录信息
      if (lcuser) {                //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
        app.globalData.user = lcuser.toJSON();
        fetchMenu().then(()=>{ that.setData({ userAuthorize: 0, grids: iMenu('manage') }) });
      } else {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
              openWxLogin(that.data.userAuthorize).then( mstate=> {
                app.logData.push([Date.now(), '系统初始化设备' + app.globalData.sysinfo.toString()]);                      //本机初始化时间记入日志
                fetchMenu().then(()=>{
                  that.setData({ userAuthorize: mstate, grids: iMenu('manage') })
                }).catch((menuErr) => {
                  app.logData.push([Date.now(), '菜单更新失败' + menuErr.toString()]);
                });
              }).catch((loginErr) => {
                app.logData.push([Date.now(), '系统登录失败' + loginErr.toString()]);
              });
            } else {
              that.setData({ userAuthorize:-1 });
              wx.hideTabBar();           //未授权则关闭TabBar
            }
          }
        })
      }
    }).catch((lcuErr) => {
      app.logData.push([Date.now(), '注册用户状态错误失败' + lcuErr.toString()]);
    })
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
    updateData(true,1).then(isupdated=>{ this.setPage(isupdated) });        //更新缓存以后有变化的数据
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
    updateData(true,1).then(isupdated=>{ this.setPage(isupdated) });
  },
  onReachBottom:function(){
    updateData(false,1).then(isupdated=>{ this.setPage(isupdated) });
  },
  onShareAppMessage: function() {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})
