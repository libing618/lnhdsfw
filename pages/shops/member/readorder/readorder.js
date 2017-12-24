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
    query.notEqualTo('status', "0");
    query.descending('createdAt');
    query.equalTo('user', AV.User.current());
    query.find().then(function (orderlist) {
      console.log(orderlist);
      that.setData({
        orderlist:orderlist,
      })
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },

  give:function(e){
    var index = parseInt(e.currentTarget.dataset.index);
    var orderlist = this.data.orderlist;
    orderlist[index].set('givestatus', '2');
    this.setData({
      orderlist: orderlist,
    });
    orderlist[index].save()
  },
  onShareAppMessage: function (res) {
    var that = this
    var orderlist = that.data.orderlist;
    var sjid = AV.User.current().id;
    if (res.from === 'button') { 
      var index = parseInt(res.target.dataset.index); 
      var tradeId = orderlist[index].attributes.tradeId
      console.log(tradeId)
      }
    return {
      imageUrl: '/images/give.jpg',
      title: '您有礼物到了，注意接收',
      path: '/pages/give/receive/receive?givetradeId=' + tradeId + '&sjid=' +sjid,
      success: function (res) {
        if(res){
          orderlist[index].set('givestatus', '2');
          that.setData({
            orderlist: orderlist,
          });
          orderlist[index].save()
        }
      },
      fail: function (res) { }
    }
  
  }
})