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
  },
  reloadData: function (carts) {
    // auto login
    var that = this;
    var carts = that.data.carts;
    console.log(carts)
    this.setData({
      carts: carts
    })
    that.sum()
  },
  addaddress: function () {
    console.log('0')
    var address = this.data.address;
    var addresslist = this.data.addresslist
    console.log(addresslist)
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      var isgive = carts[i].isgive
      if (isgive != "1") {
        console.log('1')
        carts[i].address = address
        carts[i].addresslist = addresslist
      }
      if (isgive != "0") {
        console.log('2')
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
      console.log(address[addressIndex])
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
    console.log(objectId)
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
    console.log(objectId)
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
      AV.Cloud.run('xs_order',
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
                  var query = new AV.Object('orderlist');
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
                    console.log(orderlist)
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
                // for (var i = 0; i < carts.length; i++) {
                //   var query = new AV.Object('xs_orderlist');
                //   query.set('cart', carts[i]);
                //   query.set('standard', carts[i].standard);
                //   query.set('address', carts[i].address);
                //   query.set('addresslist', carts[i].addresslist);
                //   query.set('amount', carts[i].amount);
                //   query.set('goodsId', carts[i].cartId);
                //   query.set('isgive', carts[i].isgive);
                //   query.set('price', carts[i].price);
                //   query.set('quantity', carts[i].quantity);
                //   query.set('title', carts[i].title);
                //   query.set('tradeId', carts[i].tradeId);
                //   query.set('user', AV.User.current());
                //   query.set('nickname', AV.User.current().attributes.nickName);
                //   query.set('status', '1');
                //   query.set('givestatus', '1');
                //   query.save().then(function (orderlist) {
                //     console.log(orderlist)
                //   })
                // }
              }
            }
          })
        }).catch(error => {
          that.setData({ error: error.message });
          wx.hideToast();
        })
    }
  },
  onUnload: function () {
    console.log(2)
    var success = this.data.success
    if (success != "1") {
      wx.showModal({
        title: '您刚才没有完成支付',
      });
    }
  }
})