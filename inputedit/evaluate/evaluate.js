//客户评价及统计
const weutil = require('../../libs/util.js');
var app = getApp();
Page({
  data:{
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },
  onLoad:function(options){          //参数oState为0客户评价1评价统计
    var that = this;
    if (weutil.checkRols(3,app.roleData.user)){  //检查用户操作权限
      that.setData({
        req: oClass.oSuccess[options.oState],
        pageData: app.aData.evaluates,
        mPage: app.mData.evaluates
      });
    }
  }
})
