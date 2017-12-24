const AV = require('../../../../libs/leancloud-storage.js');

Page({
  data: {
    amount: 0,
    carts: [],
    cart: [],
    orders: [],
    goodsId: {},
    error: null,
    addressObjects: [],
    addressList: [],
    addressIndex: 0,
    Id:'',
    address: '',
    addresslist: ''
  },
  onShow: function () {
    this.loadAddress();
  },
  onLoad: function (options){
    var Id =options.id
    this.setData({
      Id :Id
    })

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
    var query = new AV.Query('Address');
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
  ok:function(){
    var Id =this.data.Id;
    var address =this.data.address;
    var addresslist = this.data.addresslist;
    console.log(address)
    var query = AV.Object.createWithoutData('orderlist', Id);
    query.set('address', address );
    query.set('addresslist', addresslist);
    query.set('givestatus', '3');
    query.save().then(function (orderlist){
      setTimeout(function () {
        wx.navigateBack();
      }, 500);
    })
  }
})