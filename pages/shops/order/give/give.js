const AV = require('../../../../libs/leancloud-storage.js');
const Order = require('../../../../model/order');
Page({
  data: {
    bind:'0',
    orderid:'0',
    tradeId:'',
    receive:'0', 
    titles:'',
    amount: 0,
    carts: [],
    cart: [],
    orders: [],
    goodsId: {},
    error: null,
    addressObjects: [],
    addressList: [],
    addressIndex: 0,
    give:{},
    goodstitle:''
  },

  onLoad: function (options) {
    var goodstitle = options.titles;
    this.readCarts(options);
    this.setData({
      goodstitle: goodstitle,
    })
  },
  onShow: function () {
    this.loadAddress();
  },
  readCarts: function (options) {
    // from carts
    // amount
    var amount = options.amount;
    var titles = options.titles;
    var cartIds = options.cartIds;
    var cart = JSON.parse(options.cart)
    var cartIdArray = cartIds.split(',');
    this.setData({
      amount: amount,
      goodsId: cartIdArray,
      cart: cart,
      titles:titles
    });
    // restore carts object
    var carts = [];
    for (var i = 0; i < cartIdArray.length; i++) {
      var query = new AV.Query('cart');
      query.include('goods');
      query.get(cartIdArray[i]).then(function (cart) {
      }, function (error) {

      });
    }
    this.setData({
      carts: carts
    });
  },
  confirmOrder: function () {
    //订单开始生成
    var addressIndex = this.data.addressIndex;
    var address = this.data.addressObjects[addressIndex];
    var amount = this.data.amount;
    var cart = this.data.cart
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    })
    AV.Cloud.run('order',
      {
        amount: amount,
        address: "赠送",
        cart: cart,
        isgive: '1',
      }).then((data) => {
        wx.hideToast();
 this.setData({
            orderid: data.id,
            tradeId: data.tradeId,
          });
        data.success = () => {
         
        }
        data.fail = ({ errMsg }) => this.setData({ error: errMsg });
        wx.requestPayment({
          'timeStamp': data.pay.timeStamp,
          'nonceStr': data.pay.nonceStr,
          'package': data.pay.package,
          'signType': data.pay.signType,
          'paySign': data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500,
            });
          },
          'fail': function (res) {
          }
        })
      }).catch(error => {
        this.setData({ error: error.message });
        wx.hideToast();
      })
    //订单生成结束

  },
  loadAddress: function () {
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('Address');
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
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      addressIndex: e.detail.value
    })
    var addressIndex = this.data.addressIndex;
    var address = this.data.addressObjects[addressIndex];
  },
  bindCreateNew: function () {
    var addressList = this.data.addressList;
    if (addressList.length == 0) {
      wx.navigateTo({
        url: '../../address/add/add'
      });
    }
  },
  giveorder:function(){
    var that = this;
    var orderid = that.data.orderid;
    var query = new AV.Query('Order');
    query.equalTo('status', "0");
    query.equalTo('isgive', "1");
    query.equalTo('objectId', orderid);
    query.find().then(function (order) {
      that.setData({
        order: order
      });
    }, function (error) {
    }).then(function () {
      var order = that.data.order;
      var length = order.length
      if (length != '0') {
       that.give()
      }else {

        wx.showModal({
          title: '您还没有进行支付',
          content: '请您先进行支付'
        });

      }
    }) 
  },
  give: function (){
    var that =this;
    var order = that.data.order;
    var tradeId = that.data.tradeId;
    var receive = that.data.receive;
    var orderid = that.data.orderid;
    var user = AV.User.current();
    var goodstitle = that.data.goodstitle;
    var amount = that.data.amount;
    var bind=this.data.bind;
    if(bind!='1'){
    var give = new AV.Object('give');
    give.set('amount', amount);
    give.set('senduser', user);
    give.set('sendnickname', user.attributes.nickName);
    give.set('Order', order[0]);
    give.set('tradeId', tradeId);
    give.set('receive', receive);
    give.set('orderid', orderid);
    give.set('goodstitle', goodstitle);
    give.save().then(function (give) {
      that.setData({
        give:give,
        bind:'1'
      })
    }, function (error) {
    })
    }else{
      wx.showModal({
        title: '您已经送出礼物',
      });
    }
  },
  onShareAppMessage: function (res) {
   
    var give=this.data.give;
    var giveid =give.id;
    var user = AV.User.current();
    var sjid=user.id;
      if (res.from === 'button') {}
      return {
        imageUrl:'/images/give.jpg',
        title: '您有礼物到了，注意接收',
        path: '/pages/give/receive/receive?giveid=59c71d54128fe10035d8dcbc' ,
        success: function (res) {},
        fail: function (res) {}
      }
    
  }
})