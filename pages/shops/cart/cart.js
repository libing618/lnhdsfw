const AV = require('../../../libs/leancloud-storage.js')

var app = getApp()
Page({
  data: {
    carts: [],
    goodsList: [],
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    selectedAllStatus: false,
    total: ''
  },

  bindMinus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].get('quantity');
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].set('quantity', num);
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    // update database
    carts[index].save();
    this.sum();
  },
  bindPlus: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].get('quantity');
    // 自增
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 购物车数据
    var carts = this.data.carts;
    carts[index].set('quantity', num);
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });
    // update database
    carts[index].save();
    this.sum();
  },
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = this.data.carts;
    var num = e.detail.value;
    carts[index].set('quantity', num);
    // 将数值与状态写回
    this.setData({
      carts: carts
    });
    cart[index].save();
  },
  bindCheckbox: function (e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].get('selected');
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].set('selected', !selected);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });
    // update database
    carts[index].save();
    this.sum();
  },
  bindSelectAll: function () {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].set('selected', selectedAllStatus);
      // update selected status to db
      carts[i].save();
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
    this.sum();

  },
  bindCheckout: function () {
    var amount = this.data.total;
    if (amount != 0) {
      var cartIds = this.calcIds();
      var isgives = this.isgives();
      var titles = this.titles();
      var prices = this.prices();
      var standards = this.standards();
      var quantitys = this.quantitys();
      var selected = 1
      var cartObjects = [];
      var len = cartIds.length
      for (var i = 0; i < len; i++) {
        var random = parseInt(Math.random() * 900000 + 100000);
        var time = new Date().getTime();
        var tradeId = random + "" + time + isgives[i]
        var cart = {
          cartId: cartIds[i],
          standard: standards[i],
          title: titles[i],
          price: prices[i],
          quantity: quantitys[i],
          isgive: isgives[i],
          tradeId: tradeId,
          selected: selected,
          amount: prices[i] * quantitys[i]
        }
        cartObjects.push(cart);
      }
      wx.navigateTo({
        url: '../../../../order/checkout/checkout?cartIds=' + cartIds + '&amount=' + this.data.total + '&cart=' + JSON.stringify(cartObjects) + '&titles=' + titles
      });
    } else {
      wx.showModal({
        title: '您还没有选择商品',
        content: '请您选择商品'
      });
    }
  },




  deleteOne: function (e) {
    var that = this;
    // 购物车单个删除
    var objectId = e.currentTarget.dataset.objectId;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
          // 从网络上将它删除
          var cart = AV.Object.createWithoutData('xs_cart', objectId);
          cart.destroy().then(function () {
            // 成功
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
            that.reloadData();
          }, function (error) {
            // 异常处理
          });
        }
      }
    })
  },
  deleteAll: function () {
    var that = this;
    var cartIds = this.calcIds();
    if (cartIds.length <= 0) {
      wx.showToast({
        title: '请勾选商品'
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
          var cartObjects = [];
          for (var i = 0; i < cartIds.length; i++) {
            var objectId = cartIds[i];
            cartObjects.push(AV.Object.createWithoutData('xs_cart', objectId));
          }
          AV.Object.destroyAll(cartObjects).then(function () {
            // 成功
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
            that.reloadData();
          }, function (error) {
            // 异常处理
          });
        }
      }
    })
  },
  calcIds: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var cartIds = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        cartIds.push(this.data.carts[i].get('standard').id);
      }
    }
    if (cartIds.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return cartIds;
    //return goodsIds

  },

  titles: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var titles = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        titles.push(this.data.carts[i].get('standard').attributes.title);
      }
    }
    if (titles.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return titles;
    //return goodsIds

  },

  isgives: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var isgives = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        isgives.push(this.data.carts[i].attributes.isgive);
      }
    }
    if (isgives.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return isgives;
    //return goodsIds

  },

  prices: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var prices = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        prices.push(this.data.carts[i].get('standard').attributes.price);
      }
    }
    if (prices.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return prices;
    //return goodsIds

  },

  quantitys: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var quantitys = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        quantitys.push(this.data.carts[i].attributes.quantity);
      }
    }
    if (quantitys.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return quantitys;
    //return goodsIds

  },

  standards: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var standards = [];
    // var goodsIds = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].get('selected')) {
        // 移动到Buy对象里去
        // cartIds += ',';
        //	cartIds.push(this.data.carts[i].get('objectId'));
        standards.push(this.data.carts[i].get('standard').attributes.standard);
      }
    }
    if (standards.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
    }
    return standards;
    //return goodsIds

  },

  reloadData: function () {
    // auto login
    var that = this;
    var user = AV.User.current();
    var query = new AV.Query('xs_cart');
    var minusStatuses = [];
    query.equalTo('user', user);
    query.include('standard');
    query.find().then(function (carts) {
      // set goods data
      var goodsList = [];
      for (var i = 0; i < carts.length; i++) {
        var goods = carts[i].get('standard');
        goodsList[i] = goods;
        minusStatuses[i] = carts[i].get('quantity') <= 1 ? 'disabled' : 'normal';
      }
      that.setData({
        carts: carts,
        goodsList: goodsList,
        minusStatuses: minusStatuses
      });
      that.sum();
    });

  },
  onShow: function () {
    this.reloadData();
  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].get('selected')) {
        total += carts[i].get('quantity') * carts[i].get('standard').get('price');
      }
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total
    });
  },
  showGoods: function (e) {
    // 点击购物车某件商品跳转到商品详情
    var objectId = e.currentTarget.dataset.objectId;
    console.log(objectId)
    var query = new AV.Query('xs_goodsstandard');
    query.get(objectId).then(function (xs_goodsstandard) {
      console.log(xs_goodsstandard)
      var id = xs_goodsstandard.attributes.goods.id
      wx.navigateTo({
        url: "../goods/detail/detail?objectId=" + id
      });
    }, function (error) {
    });
  },
})