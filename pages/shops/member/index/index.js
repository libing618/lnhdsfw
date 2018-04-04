const AV = require('../../../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    user: {},
    globalData:{}
  },
  onLoad:function(){
  this.setData({		    		// 获得当前用户
    user: app.roleData.user,
  })
  },
	navigateToAddress: function () {
		wx.navigateTo({
			url: '../../address/list/list'
		});
	},
  finish: function () {
    wx.navigateTo({
      url: '../../member/finish/finish'
    });
  },
  delivergoods: function () {
    wx.navigateTo({
      url: '../../member/delivergoods/delivergoods'
    });
  },
phonelogin: function () {
		wx.navigateTo({
			url: '../../member/login/login'
		});
	},
readorder: function () {
  wx.navigateTo({
    url: '../../member/readorder/readorder',
  });
},
fenxiaologin:function(){
	wx.navigateTo({
	  url: '../../member/fenxiaologin/fenxiaologin',
        });
},
  give: function () {
    wx.navigateTo({
      url: '../../member/give/give',
    });
  },
  money:function(){
    wx.navigateTo({
      url: '../../member/money/money',
    })
  },
  kefu: function () {
    wx.makePhoneCall({
      phoneNumber: '13100073932' //仅为示例，并非真实的电话号码
    })
  },
})
