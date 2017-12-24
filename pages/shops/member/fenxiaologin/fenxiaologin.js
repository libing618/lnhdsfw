const AV = require('../../../../libs/leancloud-storage.js')
var app = getApp()
Page({
  data: {
    user: {},
  },
    agree:false,
    formSubmit: function(e) {
         // user 
		var user = AV.User.current();
        // 店铺名称
		var shopname = e.detail.value.shopname;
		// 手机号码
		var phone = e.detail.value.phone;
    var shop = new AV.Object('shop');
        shop.set('agree', this.agree);
        shop.set('shopname',shopname);
        shop.set('phone',phone);
		shop.set('user', user);
        shop.save().then(function (shop) {
			wx.showToast({
				title: '添加成功',
				icon:'success'
			});
			// navi back
		
		}, function (error) {
			console.log(error);
		});
	},

    

    onLoad: function () {
        this.setagree();
        this.setData({		    		// 获得当前用户
          user: app.globalData.user,
        })
    },
    	setagree: function () {
		var that = this;
		var user = AV.User.current();
		// if user has no address, set the address for default
		var query = new AV.Query('shop');
		query.equalTo('user', user);
		query.count().then(function (count) {
			if (count <= 0) {
				that.agree = true;
			}
		});
	},
})