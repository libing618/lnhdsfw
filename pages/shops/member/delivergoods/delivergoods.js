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
    this.profit();
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
    var query = new AV.Query('orderlist');
    query.equalTo('status', "2");
    query.descending('createdAt');
    query.equalTo('user', AV.User.current());
    query.find().then(function (orderlist) {
      that.setData({
        orderlist: orderlist,
      })
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },
  finish:function(res){
    var index = parseInt(res.target.dataset.index); 
    var that = this;
    var query = new AV.Query('orderlist');
    query.equalTo('status', "2");
    query.descending('createdAt');
    query.equalTo('user', AV.User.current());
    query.find().then(function (orderlist) {
      var orderlist= orderlist[index]
      that.distribution(orderlist)
      var xs_orderlist = AV.Object.createWithoutData('orderlist', orderlist.id);
      xs_orderlist.set('status', "2");
      xs_orderlist.save().then(function (xs_orderlist) { })
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },
  distribution: function (orderlist){
    var that =this
    var query = new AV.Query('xs_distribution');
    query.equalTo('orderlist', orderlist)
    query.equalTo('user', AV.User.current());
    query.find().then(function(distribution){
      var arr = []
      for (var a = 0; a < distribution.length; a++){
        var date_distribution={
          sendee: distribution[a].attributes.sendee,
          amount: distribution[a].attributes.amount,
        }
        arr.push(date_distribution);
      }
      that.date_distribution(arr)
      for (var i = 0; i < distribution.length; i++) {
        var distribution_id = distribution[i].id
        var income = new AV.Object('xs_income');
        income.set('amount', distribution[i].attributes.amount);
        income.set('orderlist', distribution[i].attributes.orderlist);
        income.set('status', '1');
        income.set('user', AV.User.current());
        income.set('sendee', distribution[i].attributes.sendee);
        income.set('distribution', distribution[i])
        income.save().then(function (income) {
          var xs_distribution = AV.Object.createWithoutData('xs_distribution', distribution_id);
          xs_distribution.set('status', "2");
          xs_distribution.save().then(function (xs_orderlist) { })
        })
      } 
    }, function (error) {
      alert("查询失败: " + error.code + " " + error.message);
    });
  },
  income: function (income){
    var that = this ;
    for (var i=0; i < income.length; i++){
      var amount = income[i].amount;
      var sendee = income[i].sendee;
      AV.Cloud.run('distribution',{amount:amount,sendee:sendee} ).then(function (data){})
  }
  },
  profit: function () {
    var query = new AV.Query('xs_profit');
    query.equalTo('user', AV.User.current());
    query.find().then(function (profit) {
      if (profit.length == 0) {
        var Profit = AV.Object.extend('xs_profit');
        var profit = new Profit();
        profit.set('user', AV.User.current());
        profit.set('count', '0');
        profit.set('owe', '0');
        profit.set('sendee', AV.User.current().id);
        profit.save().then(function (profit) {
        })
      }
    }, function (error) { }
    );
  },
  date_distribution:function(arr){
    var that = this;
    let income = arr.sort((pre, next) => pre.sendee > next.sendee).reduce((pre, v) => {
      let lastIndex = pre.length - 1;
      if (lastIndex >= 0 && pre[lastIndex].sendee === v.sendee) {
        pre[lastIndex].amount += v.amount;
      } else {
        pre.push(Object.assign({}, v));
      }
      return pre;
    }, []);
    that.income(income)
  }
})