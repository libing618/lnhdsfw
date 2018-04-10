const AV = require('../../../../libs/leancloud-storage.js')
var app = getApp()
Page({
  data:{
    profit: {}
  },
  onLoad: function () {
    var that = this;
    that.setData({		    		// 获得当前用户
      user: app.roleData.user,
    })
    var query = new AV.Query('xs_profit');
    query.equalTo('user', AV.User.current());
    query.find().then(function (profit) {
      that.setData({
        profit: profit[0]
      })
    });
  },

})
