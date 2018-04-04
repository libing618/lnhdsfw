var app = getApp()
Page({
  data: {
    sysheight:app.sysinfo.windowHeight-60,
    syswidth:app.sysinfo.windowWidth-10,
    messages: []
  },

  makephone: function(){
    wx.makePhoneCall({
        phoneNumber: '13903517701'       //拨打客服电话
    })
  },

  onLoad: function () {
    var that = this;
    that.setData({		    		// 获得当前用户
      user: app.roleData.user,
      messages : app.getM('58e53adbb1acfc0056ba3897'),
    })
  }
})
