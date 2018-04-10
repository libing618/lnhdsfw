const AV = require('../../../../libs/leancloud-storage.js');
var that;
var app = getApp()
Page({
  data: {
    orderlist: [],
  },
  onShow: function () {
    this.loadOrder();
    this.sjid();
  },

  sjid: function () {
    var sj = AV.User.current().attributes.sjid
    console.log(AV.User.current())
    var sjid = app.sjid
    console.log(sjid)
    if (sjid) {
      if (sj != "") { console.log(0) } else {
        this.setData({
          sjid: sjid
        })
        const user = AV.User.current();
        user.set({ sjid });
        user.save();
      }
    }
  },
  loadOrder: function () {
    var that = this;
    var query = new AV.Query('xs_orderlist');
    query.equalTo('status', "3");
    query.descending('createdAt');
    query.equalTo('user', AV.User.current());
    query.find().then(function (orderlist) {
      console.log(orderlist);
      that.setData({
        orderlist: orderlist,
      })
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },

 
  
})