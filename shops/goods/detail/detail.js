const AV = require('../../../../libs/leancloud-storage.js')
var app = getApp()
Page({
  data: {
    amount: 0,
    goods: {},
    standard:{},
    Standard:{},
    current: 0,
    galleryHeight: getApp().screenWidth,
    goodsid: ''
  },
  onLoad: function (options) {
    var goodsId = options.objectId;
    this.getGoodsById(goodsId);
    var standard = AV.Object.createWithoutData('xzhw', goodsId);
    this.getstandard(standard);
  },
  getGoodsById: function (goodsId) {
    console.log(goodsId)
    if (goodsId) {
      var that = this
      var query = new AV.Query('xs_Goods');
      // 生成商品对象
      query.get(goodsId).then(function (goods) {
        that.setData({
          goods: goods
        });
      }, function (error) {
      });
    }
  },

  getstandard: function (standard) {
    var that = this;
    var query = new AV.Query('xs_goodsstandard');
    // 查询顶级分类，设定查询条件parent为null
    query.equalTo('goods', standard);
    query.descending('updatedAt');
    query.find().then(function (standard) {
      that.setData({
        standard: standard,
      });
    }).catch(function (error) {
    });
    var standard = that.data.standard;
  },
     

  onShow: function () {
    this.id()
    this.sjid()
    this.channelid()
  },
  channelid: function () {
    var channel = AV.User.current().attributes.channelid
    var channelid = app.channelid
    if (channelid) {
      if (channel) {} else {
        this.setData({
          channelid: channelid
        })
        const user = AV.User.current();
        user.set({ channelid });
        user.save();
      }
    }
  },
  sjid: function () {
    var sj = AV.User.current().attributes.sjid
    var sjid = app.sjid
    if (sjid) {
      if (sj) {} else {
        this.setData({
          sjid: sjid
        })
        const user = AV.User.current();
        user.set({ sjid });
        user.save();
      }
    }
  },
  id: function () {
    var that = this
    var id = app.goodsid
    if (id) {
      var query = new AV.Query('xs_Goods');
      // 生成商品对象
      query.get(id).then(function (goods) {
        that.setData({
          goods: goods
        });
        // 成功获得实例
      }, function (error) {
        // 异常处理
      });
    }
  },
  buy: function () {
    this.insertCartbuy(this.data.Standard);
  },
  give: function () {
    this.insertCartgive(this.data.Standard);
  },
  insertCartgive: function (Standard) {
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('xs_cart');
    query.equalTo('user', user);
    query.equalTo('standard', Standard);
    query.equalTo('isgive', "1");
    // if count less then zero
    query.count().then(function (count) {
      if (count <= 0) {
        // if didn't exsit, then create new one
        var cart = AV.Object('xs_cart');
        cart.set('user', user);
        cart.set('quantity', 1);
        cart.set('standard', Standard);
        cart.set('goods', Standard.attributes.goods);
        cart.set('isgive', "1");
        cart.save().then(function (cart) {
          that.showCartToast();
        }, function (error) {
        });
      } else {
        // if exsit, get the cart self
        query.first().then(function (cart) {
          // update quantity
          cart.increment('quantity', 1);
          // atom operation
          // cart.fetchWhenSave(true);
          that.showCartToast();
          return cart.save();
        }, function (error) {
        });
      }
    }, function (error) {

    });
  },
  insertCartbuy: function (Standard) {
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('xs_cart');
    query.equalTo('user', user);
    query.equalTo('standard', Standard);
    query.equalTo('isgive',"0");
    query.count().then(function (count) {
      if (count <= 0) {
        // if didn't exsit, then create new one
        var cart = AV.Object('xs_cart');
        cart.set('user', user);
        cart.set('quantity', 1);
        cart.set('standard', Standard);
        cart.set('goods', Standard.attributes.goods);
        cart.set('isgive', "0");
        cart.save().then(function (cart) {
          that.showCartToast();
        }, function (error) {
        });
      } else {
        // if exsit, get the cart self
        query.first().then(function (cart) {
          // update quantity
          cart.increment('quantity', 1);
          // atom operation
          // cart.fetchWhenSave(true);
          that.showCartToast();
          return cart.save();
        }, function (error) {
        });
      }
    }, function (error) {

    });
  },
  showCartToast: function () {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      //从<image>的data-current取到current，得到String类型的url路径
      current: this.data.goods.get('images')[parseInt(e.currentTarget.dataset.current)],
      urls: this.data.goods.get('images') // 需要预览的图片http链接列表
    })
  },
  
  previewdetail: function(e) {
    wx.previewImage({
      //从<image>的data-current取到current，得到String类型的url路径
      current: this.data.goods.get('detail')[parseInt(e.currentTarget.dataset.current)],
      urls: this.data.goods.get('detail') // 需要预览的图片http链接列表
    })
  },
  callphone: function () {
    wx.makePhoneCall({
      phoneNumber: '13100073932' //仅为示例，并非真实的电话号码
    })
  },
  showCart: function () {
    wx.navigateTo({
      url: '../../cart/cart'
    });
  },
  setHighlight: function (index) {
    var highlight = [];
    for (var i = 0; i < this.data.topCategories; i++) {
      highlight[i] = '-1';
    }
    highlight[index] = 'highlight';
    this.setData({
      highlight: highlight
    });
  },

  giveprice: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var standardId = that.data.standard[index].id;
    var query = new AV.Query('xs_goodsstandard');
    query.get(standardId).then(function (standard) {
      var amount = standard.attributes.price;
      var code = standard.attributes.standard;
      that.setData({
        Standard: standard,
        amount: amount,
        code: code,
      });
    }).catch(function (error) {
    });
    this.setHighlight(index);
  },

  buyprice: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var standardId = that.data.standard[index].id;
    var query = new AV.Query('xs_goodsstandard');
    query.get(standardId).then(function (standard) {
      var amount = standard.attributes.price;
      var code = standard.attributes.standard;
      that.setData({
        Standard: standard,
        amount: amount,
        code: code,
      });
    }).catch(function (error) {
    });
    this.setHighlight(index);
  },

  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      buyanimationData: animation.export(),
      buyshowModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        buyanimationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      buyanimationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        buyanimationData: animation.export(),
        buyshowModalStatus: false
      })
    }.bind(this), 200)
  },

  giveshowModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      giveanimationData: animation.export(),
      giveshowModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        giveanimationData: animation.export()
      })
    }.bind(this), 200)
  },
  givehideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      giveanimationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        giveanimationData: animation.export(),
        giveshowModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function () {
    var sjid = AV.User.current().id;
    var channelid = AV.User.current().attributes.channelid
    // 用户点击右上角分享
    return {
      title: '分享的内容', // 分享标题
      path: '/pages/index/index?sjid=' + sjid + '&goodsid=' + goodsid + '&channelid=' + channelid // 分享路径
    }
  }
});