const AV = require('../../../../libs/leancloud-storage.js');
var that;

Page({
  data: {
    orderlist: [],
  },
  onShow: function () {
    this.loadOrder();
  },
  loadOrder: function () {
    var that = this;
    var query = new AV.Query('xs_orderlist');
    query.notEqualTo('status', "0");
    query.equalTo('isgive', "1");
    query.descending('createdAt');
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