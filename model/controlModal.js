
const AV = require('../libs/leancloud-storage.js');

var app = getApp()
module.exports = {

  showProcedureModal: function ({ currentTarget:{id} }) {
    var that = this;
    var animation = wx.createAnimation({    // 显示遮罩层
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
      modalId: id,
      modalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(that), 200)
  },

  hideSwitchModal: function ({ currentTarget:{id} }) {
    var that = this;
    if (id=='fSwitch'){                  //确认切换到下一数组
      let arrNext = (that.data.ht.pageCk + 1)==that.data.ht.fLength ? 0 : (that.data.ht.pageCk + 1);
      that.data.cPage[arrNext].push(that.data.modalId);
      let oldNo = that.data.cPage[that.data.ht.pageCk].indexOf(that.data.modalId);
      that.data.cPage[that.data.ht.pageCk].splice(oldNo,1);
    };
    var animation = wx.createAnimation({    // 隐藏遮罩层
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        cPage: that.data.cPage,
        modalStatus: false
      })
    }.bind(that), 200)
  }

}
