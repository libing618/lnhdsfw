const AV = require('../libs/leancloud-storage.js');
var app = getApp()

  function f_modalSwitchModal({ currentTarget: { id } }) {
    var that = this;
    if (id == 'fSwitch') {                  //确认切换到下一数组
      let arrNext = (that.data.ht.pageCk + 1) == that.data.ht.fLength ? 0 : (that.data.ht.pageCk + 1);
      that.data.cPage[arrNext].push(that.data.modalId);
      let oldNo = that.data.cPage[that.data.ht.pageCk].indexOf(that.data.modalId);
      that.data.cPage[that.data.ht.pageCk].splice(oldNo, 1);
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
        pageName: 'tabPanelToModal'
      })
    }.bind(that), 200)
  };
function controlModal(showPage,hidePage){
  var that = this;
  var animation = wx.createAnimation({      //遮罩层
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  that.animation = animation;
  animation.translateY(300).step();
  showPage.animationData = animation.export();
  that.setData(showPage)
  setTimeout(function () {
    animation.translateY(0).step()
    hidePage.animationData = animation.export();
    that.setData(hidePage)
  }.bind(that), 200)
}
module.exports = {

  f_modalSwitchBox: function ({ currentTarget:{id,dataset} }) {
    var that = this;
    let showPage = {},hidePage = {};
    switch (id) {
      case 'fSwitch':                  //确认切换到下一数组并返回
        let arrNext = (that.data.ht.pageCk + 1) == that.data.ht.fLength ? 0 : (that.data.ht.pageCk + 1);
        that.data.cPage[arrNext].push(that.data.modalId);
        let oldNo = that.data.cPage[that.data.ht.pageCk].indexOf(that.data.modalId);
        that.data.cPage[that.data.ht.pageCk].splice(oldNo, 1);
        hidePage.pageName = 'tabPanelToModal';
        hidePage.cPage = that.data.cPage;
        break;
      case 'fBack':                  //确认切换到下一数组并返回
        hidePage.pageName = 'tabPanelToModal';
        break;
      default:                  //打开弹出页
        showPage.idClicked = id;
        showPage.pageName = dataset.pname;
        break;
    }
    controlModal(showPage,hidePage);
  },

  f_modalAddressBox: function ({ currentTarget:{id,dataset},detail:{value} }) {
    var that = this;
    let showPage = {},hidePage = {};
    switch (id) {
      case 'fSave':                  //确认返回数据
        hidePage.pageName = 'editFieldToModal';
        hidePage.vData[gname] =  { code: that.data.saddv, sName: value.address1 + value.address2 };
        controlModal(showPage,hidePage)
        break;
      case 'fBack':                  //确认切换到下一数组并返回
        hidePage.pageName = 'editFieldToModal';
        controlModal(showPage,hidePage)
        break;
      default:                  //打开弹出页
        showPage.n = id;
        showPage.pageName = dataset.pname;
        break;
    }
  }

}
