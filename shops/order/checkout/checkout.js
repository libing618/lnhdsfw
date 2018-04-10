const AV = require('../../../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    order: '',
    carts: [],
    orderList: [],
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    selectedAllStatus: false,
    total: '',
    amount: 0,
    cart: [],
    orders: [],
    error: null,
    addressObjects: [],
    addressIndex: 0,
    address: '',
    addresslist: '',
    success: ""
  },
  onShow: function () {
    this.loadAddress();
    this.profit();
  },
  profit:function(){
    var query = new AV.Query('xs_profit');
    query.equalTo('user', AV.User.current());
    query.find().then(function (profit) {
      if(profit.length == 0){
        var Profit = AV.Object.extend('xs_profit');
        var profit = new Profit();
        profit.set('user',AV.User.current());
        profit.set('count',0);
        profit.set('owe',0);
        profit.set('sendee', AV.User.current().id);
        profit.save().then(function(profit){
        })
      }
    }, function (error) {}
    );
  },
  reloadData: function (carts) {
    // auto login
    var that = this;
    var carts = that.data.carts;
    this.setData({
      carts: carts
    })
    that.sum()
  },
  addaddress: function () {
    var address = this.data.address;
    var addresslist = this.data.addresslist
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      var isgive = carts[i].isgive
      if (isgive != "1") { 
        carts[i].address = address;
        carts[i].addresslist = addresslist;
      }
      if (isgive != "0") {
        carts[i].address = '礼物还未送出'
        carts[i].addresslist = '礼物还未送出'
      }
    }
    this.reloadData()
  },
  onLoad: function (options) {
    var cart = options.cart
    var carts = JSON.parse(cart)
    this.setData({
      carts: carts
    })
    this.reloadData();
  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      total += carts[i].amount;
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      total: total
    });
  },
  loadAddress: function () {
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('xs_Address');
    query.equalTo('user', user);
    query.find().then(function (address) {
      var addressList = [];
      var addressObjects = [];
      for (var i = 0; i < address.length; i++) {
        // find the default address
        if (address[i].get('isDefault') == true) {
          that.setData({
            addressIndex: i
          });
        }
        addressList.push(address[i].get('detail'));
        addressObjects.push(address[i].get('objectId'));
      }
      that.setData({
        addressList: addressList,
        addressObjects: addressObjects
      });
      that.addressObjects = address;
      var addressIndex = that.data.addressIndex
      var addresslist = address[addressIndex].attributes.detail
      var address = '收件人：' + address[addressIndex].attributes.realname + '\u3000\u3000电话:' + address[addressIndex].attributes.mobile + '\u3000\u3000详细地址：' + address[addressIndex].attributes.province + address[addressIndex].attributes.city + address[addressIndex].attributes.region + address[addressIndex].attributes.detail
      that.setData({
        address: address,
        addresslist: addresslist
      })
      that.addaddress()
    });
  },
  bindPickerChange: function (e) {
    var that = this
    var carts = that.data.carts
    var objectId = parseInt(e.currentTarget.dataset.index);
    that.setData({
      addressIndex: e.detail.value
    })
    var addressIndex = that.data.addressIndex;
    var address = that.data.addressObjects[addressIndex];
    var query = new AV.Query('xs_Address');
    query.get(address).then(function (address) {
      var addresslist = address.attributes.detail
      var address = '收件人：' + address.attributes.realname + '\u3000\u3000电话:' + address.attributes.mobile + '\u3000\u3000详细地址：' + address.attributes.province + address.attributes.city + address.attributes.region + address.attributes.detail;
      carts[objectId].address = address
      carts[objectId].addresslist = addresslist
      that.reloadData();
    })
  },
  bindCreateNew: function () {
    var addressList = this.data.addressList;
    if (addressList.length == 0) {
      wx.navigateTo({
        url: '../../address/add/add'
      });
    }
  },
  deleteOne: function (e) {
    var that = this;
    // 购物车单个删除
    var objectId = parseInt(e.currentTarget.dataset.index);
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
          var carts = that.data.carts
          carts.splice(objectId, 1);
          that.reloadData();
        }
      }
    })
  },
  confirmOrder: function () {
    var that = this;
    var amount = that.data.total;
    var carts = that.data.carts
    var address = that.data.address
    var addressList = that.data.addressList;
    if (addressList.length == 0) {
      wx.showModal({
        title: '您还没有填写地址',
        content: '请您填写地址'
      });
    } else {
      wx.showToast({
        title: '正在创建订单',
        icon: 'loading',
        duration: 10000,
        mask: true,
      })
      AV.Cloud.run('order',
        {
          amount: amount,
          address: address,
          cart: carts,
        }).then((data) => {
          wx.hideToast();
          data.success = () => { }
          data.fail = ({ errMsg }) => that.setData({ error: errMsg });
          wx.requestPayment({
            'timeStamp': data.pay.timeStamp,
            'nonceStr': data.pay.nonceStr,
            'package': data.pay.package,
            'signType': data.pay.signType,
            'paySign': data.paySign,
            'success': function (res) {
              if (res) {
                for (var i = 0; i < carts.length; i++) {
                  var query = new AV.Object('xs_orderlist');
                  query.set('cart', carts[i]);
                  query.set('address', carts[i].address);
                  query.set('addresslist', carts[i].addresslist);
                  query.set('amount', carts[i].amount);
                  query.set('goodsId', carts[i].cartId);
                  query.set('isgive', carts[i].isgive);
                  query.set('price', carts[i].price);
                  query.set('quantity', carts[i].quantity);
                  query.set('title', carts[i].title);
                  query.set('tradeId', carts[i].tradeId);
                  query.set('user', AV.User.current());
                  query.set('nickname', AV.User.current().attributes.nickName);
                  query.set('status', '1');
                  query.set('givestatus', '1');
                  query.save().then(function (orderlist) {
                    var orderlistid = orderlist.id;
                    AV.Cloud.run('distribution', {
                      id: orderlistid,
                    }).then(function (data) {}, function (error) {});
                    that.sales();
                  })
                }
              }
              var success = "1";
              that.setData({
                success: success
              })
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
              });
            },
            'fail': function (err) {
              if(err){
                for (var i = 0; i < carts.length; i++) {
                  var query = new AV.Object('orderlist');
                  query.set('cart', carts[i]);
                  query.set('standard', carts[i].standard);
                  query.set('address', carts[i].address);
                  query.set('addresslist', carts[i].addresslist);
                  query.set('amount', carts[i].amount);
                  query.set('goodsId', carts[i].cartId);
                  query.set('isgive', carts[i].isgive);
                  query.set('price', carts[i].price);
                  query.set('quantity', carts[i].quantity);
                  query.set('title', carts[i].title);
                  query.set('tradeId', carts[i].tradeId);
                  query.set('user', AV.User.current());
                  query.set('nickname', AV.User.current().attributes.nickName);
                  query.set('status', '1');
                  query.set('givestatus', '1');
                  query.save().then(function (orderlist) {    
                    that.money_extension(orderlist);
                    that.money_mCost(orderlist);
                    that.money_software(orderlist);
                    that.money_mall(orderlist);
                    that.money_channel(orderlist)
                  }) 
                }
              }
            }
          })
        }).catch(error => {
          that.setData({ error: error.message });
          wx.hideToast();
        })
    }
  },
  sales: function () {
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      var goodsid = this.data.carts[i].goodsId;
      var addnumber = Number(this.data.carts[i].quantity);
      var query = new AV.Query('xs_Goods');
      query.get(goodsid).then(function (goods) {
        var oldnumber = Number(goods.attributes.sales);
        var salesnumber = oldnumber + addnumber
        var todo = AV.Object.createWithoutData('xs_Goods', goodsid);
        todo.set('sales', salesnumber);
        todo.save();
      }, function (error) {
      });
    }
  },
  money_extension: function (orderlist){
    var price = orderlist.attributes.amount;
    var amount = price*100;
    console.log(amount)
        var Distribution = AV.Object.extend('xs_distribution');
        var distribution = new Distribution();
        distribution.set('amount', amount);  
        distribution.set('status', '1');    
        distribution.set('action', 'extension'); 
        distribution.set('user', AV.User.current());
        distribution.set('sendee', AV.User.current().attributes.sjid);
        distribution.set('orderlist', orderlist)   
        distribution.save().then(function (distribution) {
          console.log(distribution)
        }), function (error) {
        }   
  },
  money_software: function (orderlist) {
    var price = orderlist.attributes.amount;
    var amount = price * 100;
    console.log(amount)
    var Distribution = AV.Object.extend('xs_distribution');
    var distribution = new Distribution();
    distribution.set('amount', amount);
    distribution.set('status', '1');
    distribution.set('action', 'software');
    distribution.set('user', AV.User.current());
    distribution.set('sendee', "5a2955bf8d6d810061a5cc0a");
    distribution.set('orderlist', orderlist)
    distribution.save().then(function (distribution) {
      console.log(distribution)
    }), function (error) {
    }   
  },
  money_mall: function (orderlist) {
    var price = orderlist.attributes.amount;
    var amount = price * 100;
    console.log(amount)
    var Distribution = AV.Object.extend('xs_distribution');
    var distribution = new Distribution();
    distribution.set('amount', amount);
    distribution.set('status', '1');
    distribution.set('action', 'mall');
    distribution.set('user', AV.User.current());
    distribution.set('sendee', "5a2955bf8d6d810061a5cc0a");
    distribution.set('orderlist', orderlist)
    distribution.save().then(function (distribution) {
      console.log(distribution)
    }), function (error) {
    }   
  },
  money_channel: function (orderlist) {
    var price = orderlist.attributes.amount;
    var amount = price * 100;
    console.log(amount)
    var Distribution = AV.Object.extend('xs_distribution');
    var distribution = new Distribution();
    distribution.set('amount', amount);
    distribution.set('status', '1');
    distribution.set('action', 'channel');
    distribution.set('user', AV.User.current());
    distribution.set('sendee', AV.User.current().attributes.channelid);
    distribution.set('orderlist', orderlist)
    distribution.save().then(function (distribution) {
      console.log(distribution)
    }), function (error) {
    }   
  },
  money_mCost: function (orderlist){
    var price = orderlist.attributes.amount;
    var amount = price * 100;
    console.log(amount)
    var Distribution = AV.Object.extend('xs_distribution');
    var distribution = new Distribution();
    distribution.set('amount', amount);
    distribution.set('status', '1');
    distribution.set('action', 'mCost');
    distribution.set('user', AV.User.current());
    distribution.set('sendee', "596735e9128fe10057203078");
    distribution.set('orderlist', orderlist)
    distribution.save().then(function (distribution) {
      console.log(distribution)
    }), function (error) {
    }  
  },
  onUnload: function () {
    var success = this.data.success
    if (success != "1") {
      wx.showModal({
        title: '您刚才没有完成支付',
      });
    }
  },
  // channel: function () {                           //渠道推广费
  //   var that = this;
  //   var carts = this.data.carts;
  //   var len = carts.length;
  //   var money_Channel = 0;
  //   for (var i = 0; i < carts.length; i++) {
  //     var money = carts[i].amount
  //     var channel = 100;
  //     var money_channel = money * channel        //需要支付的金额
  //     money_Channel += parseInt(money_channel);
  //   }
  //   return money_Channel;
  // },
  // money_mCost:function(){
  //      var price = orderlist.attributes.amount;
  //   var amount = price*100;
  //   console.log(amount)
  //       var Distribution = AV.Object.extend('xs_distribution');
  //       var distribution = new Distribution();
  //       distribution.set('amount', amount);  
  //       distribution.set('status', '1');    
  //       distribution.set('action', 'extension'); 
  //       distribution.set('user', AV.User.current());
  //       distribution.set('sendee', AV.User.current().attributes.sjid);
  //       distribution.set('orderlist', orderlist)   
  //       distribution.save().then(function (distribution) {
  //         console.log(distribution)
  //       }), function (error) {
  //       }   
  // },
  // mCost:function(){
  //   var that =this;
  //   var arr = that.mcost()
  //   let arr1 = arr.sort((pre, next) => pre.phone > next.phone).reduce((pre, v) => {
  //     let lastIndex = pre.length - 1;
  //     if (lastIndex >= 0 && pre[lastIndex].phone === v.phone) {
  //       pre[lastIndex].amount += v.amount;
  //     } else {
  //       pre.push(Object.assign({}, v));
  //     }
  //     return pre;
  //   }, []);
  //   return arr1
  // },
  // mcost: function () {
  //   var that = this;
  //   var mCost_phone = that.mCost_phone();
  //   var mCost_amount = that.mCost_amount();
  //   var carts = that.data.carts;
  //   var len = carts.length;
  //   var mCost =[];
  //   for (var i = 0; i < len; i++){
  //       var mcost = {
  //         phone: mCost_phone[i],
  //         amount: mCost_amount[i],
  //       }
  //   mCost.push(mcost);
  //   }
  //   return mCost;
  // },

  // mCost_phone:function(){
  //   var that = this;
  //   var mCost_phone = [];
  //   var carts =that.data.carts;
  //   var len = carts.length;
  //   for (var i=0; i<len; i++){
  //     mCost_phone.push(carts[i].goodsId)
  //   }
  //   return mCost_phone;
  // },

  // mCost_amount:function(){
  //   var that = this;
  //   var mCost_amount = [];
  //   var carts = that.data.carts;
  //   var len = carts.length;
  //   for (var i = 0; i < len; i++){
  //     mCost_amount.push(carts[i].amount);
  //   };
  //   return mCost_amount;
  // },
  // distribution:function(){
  //   var that = this;
  //   var query = new AV.Query('xs_profit');
  //   query.equalTo('user', AV.User.current());
  //   query.find().then(function(profit){
  //     var money = 索要传递的金额;
  //     var id = profit.id;
  //     var owe = profit.owe;
  //     var count = prifit.count;
  //     if (money>owe){
  //       var amount = money - owe;   // 金额计算方式
  //       var Distribution = AV.Object.extend('xs_distribution');
  //       var distribution = new Distribution();
  //       distribution.set('amount', 金额);   //通过金额计算方式计算
  //       distribution.set('status', '1');    //状态1是产生，2是成功，-1是未成功，3是还债
  //       distribution.set('action', 分配给不同的人);  //内容分别是推广宣传费（extension），渠道推广费（channel），商城管理费(mall)，软件服务费（software），产品进价（mCost）
  //       distribution.set('user', AV.User.current());
  //       distribution.set('sendee', 推送者的id);     //推广宣传费，渠道推广费从user表中查找，商城管理费，软件服务费的id写死，产品进价利用手机号在user表中查找
  //       distribution.save().then(function (distribution) {
  //         console.log(distribution)
  //         AV.Cloud.run('', ).then(function (data) {                    //云函数运行，需要传递金额以及distribution.id
  //           var xs_profit = AV.Object.createWithoutData('xs_profit', id);
  //           xs_profit.set('count', count);
  //           xs_profit.save().then(function (xs_profit) { console.log(1) }),function(error){console.log(error)}
  //         }, function (err) {console.log(err)});
  //         var count = count + amount;    //获利金额计算方式：将xs_profit表中的count取出后加上amount = money - owe计算后取得的值，将这个值重新写入xs_profit表中的count
  //       }), function (error) {
  //         console.log(error);
  //       }
  //     }else{
  //       var owe = owe - money;
  //       var todo = AV.Object.createWithoutData('xs_profit', id);
  //       todo.set('owe',owe);
  //       // 保存到云端
  //       todo.save();
  //     }
  //   })
  // },
})