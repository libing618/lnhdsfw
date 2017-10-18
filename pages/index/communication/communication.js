var app = getApp()
Page({
  data:{
    sysheight:app.globalData.sysinfo.windowHeight-60,
    syswidth:app.globalData.sysinfo.windowWidth-10,
    user: app.globalData.user,
    umessages: []
  },
  onLoad:function(options){
    var that = this;
    that.setData({		    		// 获得当前用户
      umessages: app.fwClient ? app.urM : null
    })
  },

  onShow:function(){
    if (app.fwClient){
      this.setData({umessages:app.getM(app.globalData.user.username+'0')})
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
