//签约厂家
const AV = require('../../libs/leancloud-storage.js');
const weutil = require('../../libs/util.js');
var app = getApp()
Page({
  data:{
    pNo: 'manufactor',
    pw: app.sysinfo.pw,
    ht:{
      navTabs: ['已签约厂家','未签约厂家'],
      modalBtn: ['解约','签约'],
      fLength: 2,
      pageCk: 0
    },
    modalStatus: false,
    modalFormat: require('../../model/procedureclass').manufactor,
    modalData: {}
  },
  onLoad:function(options){
    var that = this;
    if (app.roleData.user.userRolName=='admin') {
      new AV.Query('manufactor').equalTo('bState',true).find(manufactors=>{
        if (manufactors){
          let mfData = [];
          manufactors.forEach(manufactor=>{
            if (mIdArr.indexOf(manufactor.unitId)<0) {mfData.push(manufactor.toJSON())}
          })
          if (!mfData) { that.setData({mfData:mfData}) }
        };
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },

  showModal: function (target:{id}) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      modalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
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
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        modalStatus: false
      })
    }.bind(this), 200)
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
