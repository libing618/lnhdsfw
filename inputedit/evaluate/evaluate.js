// pages/customer/evaluate/evaluate.js客户评价及统计
const weutil = require('../../../util/util.js');
var app = getApp();
Page({
  data:{
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },
  onLoad:function(options){          //参数oState为0客户评价1评价统计
    var that = this;
    if (weutil.checkRols(app.globalData.user.userRolName,3)){  //检查用户操作权限
      that.setData({
        req: oClass.oSuccess[options.oState],
        oArray: weutil.arrClose(options.oState ? 'evaluate' : 'ordObjectId',app.mData.oped1),     //确定数组分类字段
        pageData: app.oData[1],
        mPage: app.mData.oped1
      });
      wx.setNavigationBarTitle({
        title: app.uUnit.nick+'的'+ options.oState ? '评价统计' : '客户评价'
      })
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
