const AV = require('../../../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    orderlist: {},
    userAuthorize: -2,   //中间部分-2显示欢迎词，-1为授权按钮
    grids: []           
  },
  onLoad: function () {
    var that = this;
    that.updateData(true);                       //更新缓存以后有变化的数据
    let mData = wx.getStorageSync('menudata');
    var mUpdateTime = '0';
    let lcuser = AV.User.current();           //读缓存登录信息
    if (mData) {            //有菜单缓存则本手机正常使用中必有登录信息
      app.wmenu = mData.initVale;
      mUpdateTime = mData.updatedAt;
      that.data.userAuthorize = 1;
    } else {
      if (lcuser) { that.data.userAuthorize = 0; }
    };
    if (lcuser) { app.globalData.user = lcuser.toJSON() };
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType != 'none') {                     //如果有网络
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
                app.openWxLogin(that.data.userAuthorize, mUpdateTime).then((mstate) => {
                  app.wmenu[0][0].mIcon = app.globalData.user.avatarUrl;
                  that.setData({ userAuthorize: mstate, grids: app.wmenu[0] })
                  app.logData.push([Date.now(), '系统初始化设备' + app.globalData.sysinfo]);                      //本机初始化时间记入日志
                }).catch((loginErr) => {
                  app.logData.push([Date.now(), '系统初始化失败' + loginErr]);
                });
              } else { that.setData({ userAuthorize: -1 }) }
            }
          });
        }
      }
    });
  },

  userInfoHandler: function (e) {
    var that = this;
    app.openWxLogin(that.data.userAuthorize, 0).then((mstate) => {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo]);                      //用户授权时间记入日志

      that.setData({ userAuthorize: mstate, grids: app.wmenu[0] })
    }).catch((error) => { console.log(error) });
  },

  updateData: function (isDown) {    //更新页面显示数据,isDown下拉刷新
    var that = this;
    var readArticles = new AV.Query('Goods');                                      //进行数据库初始化操作
    if (isDown) {
      readArticles.ascending('updatedAt');           //按更新时间升序排列
      readArticles.limit(1000);                      //取最大数量新闻
    } else {
      readArticles.descending('updatedAt');           //按更新时间降序排列
    };
    readArticles.find().then((art) => {
      var lena = art.length;
      if (lena > 0) {
        let article = {}, artPlace = -1;
        if (isDown) {
          app.aData.artupdateAt.artnowdate = art[lena - 1].updatedAt;                          //更新本地最新时间

        } else {

        };
      }
    }).catch((error) => { console.log(error) });
  },

  onPullDownRefresh: function () {
    this.updateData(true);
  },
  onReachBottom: function () {
    this.updateData(false);
  },


  onShow: function () {
    this.loadOrder();
  },
  loadOrder: function (options) {
    var that =this;
    var tradeId = app.givetradeId;
    console.log(tradeId)
    // var senduser = options.senduser;
    var query = new AV.Query('orderlist');
    query.equalTo('tradeId', tradeId);
    query.find().then(function (orderlist) {
      console.log(orderlist)
      that.setData({
        orderlist: orderlist['0']
      });
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },
  address: function () {
    var id = this.data.orderlist.id
    console.log(id)
    wx.navigateTo({
      url: "../../../../../address/address?id=" + id
    });
  },
  receive: function () {
    wx.showToast({
      title: '您已经接受成功',
      icon: 'success',
      duration: 1500,
    });
  },
  back: function () {
    wx.showToast({
      title: '产品已经退回',
      icon: 'fail',
      duration: 1500,
    });
  }
})