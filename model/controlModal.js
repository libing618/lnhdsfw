const AV = require('../libs/leancloud-storage.js');
var app = getApp();
function popModal(that){
  if (typeof that.animation=='undefined'){
    that.animation = wx.createAnimation({      //遮罩层
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
  }
  that.animation.height(app.sysinfo.pw.cwHeight).translateY(app.sysinfo.pw.cwHeight).step();
  that.setData({ animationData: that.animation.export() });
  setTimeout(function () {
    that.animation.translateY(0).step()
    that.setData({
      animationData: that.animation.export(),
      showModalBox: true
    });
  }.bind(that), 200)
};
function downModal(that,hidePage){
  that.animation.translateY(-app.sysinfo.pw.cwHeight).step();
  that.setData({ animationData: that.animation.export() });
  setTimeout(function () {
    that.animation.translateY(0).step();
    hidePage.animationData = that.animation.export();
    hidePage.showModalBox = false;
    that.setData(hidePage);
  }, 200)
}
module.exports = {

  f_modalSwitchBox: function ({ currentTarget:{id,dataset} }) {
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fSwitch':                  //确认切换到下一数组并返回
        let arrNext = (that.data.ht.pageCk + 1) == that.data.ht.fLength ? 0 : (that.data.ht.pageCk + 1);
        that.data.cPage[arrNext].push(that.data.modalId);
        let oldNo = that.data.cPage[that.data.ht.pageCk].indexOf(that.data.modalId);
        that.data.cPage[that.data.ht.pageCk].splice(oldNo, 1);
        hidePage.cPage = that.data.cPage;
        that.data.sPages.pop();
        hidePage.sPages = that.data.sPages;
        downModal(that,hidePage)
        break;
      case 'fBack':                  //返回
        that.data.sPages.pop();
        hidePage.sPages = that.data.sPages;
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
        let newPage = {
          that.data.showModalBox,
          that.data.animationData,
          targetId: id,
          that.data.reqData
        };
        newPage.smtName = that.data.ht.modalBtn[that.data.ht.pageCk];
        newPage.pageName = 'modalSwitchBox';
        that.setData({
          sPages: that.data.sPages.push(newPage)
        });
        popModal(that)
        break;
    }
  },

  f_modalFieldBox: function ({ currentTarget:{id,dataset} }) {
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        that.data.sPages.pop();
        hidePage.sPages = that.data.sPages;
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
      that.data.pageData[]
        let showPage = {};
        showPage['pageData.'+id] = app.aData[dataset.pNo][id];
        showPage.sPages: that.data.sPages.push({showModalBox,animationData,pageName:'modalFieldBox',targetId:id,pageData,reqData: require('procedureclass.js')[dataset.pNo].pSuccess});
        that.setData(showPage);
        popModal(that)
        break;
    }
    downModal(that,hidePage)
  },

  i_modalAddressBox: function ({ currentTarget:{id,dataset},detail:{value} }) {      //地址编辑
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fSave':                  //确认返回数据
        hidePage.vData[that.data.reqData[n].gname] =  { code: that.data.saddv, sName: value.address1 };
        that.data.sPages.pop();
        hidePage.sPages = that.data.sPages;
        downModal(that,hidePage)
        break;
      case 'fBack':                  //返回
        that.data.sPages.pop();
        hidePage.sPages = that.data.sPages;
        downModal(that,hidePage)
        break;
      case 'faddclass':                  //选择行政区划
        showPage.saddv = 0;
        if (that.data.adcvalue[0] == value[0]){
          if (that.data.adcvalue[1] == value[1]) {
            showPage.saddv = that.data.adclist[value[0]].st[value[1]].ct[value[2]].c;
            showPage.address1 = that.data.adclist[val[0]].n + that.data.adclist[val[0]].st[val[1]].n + that.data.adclist[val[0]].st[val[1]].ct[val[2]].n;
          } else { value[2]=0 }
        } else { value[1]=0 }
        showPage.adcvalue = value;
        that.setData(showPage);
        break;
      case 'raddgroup':                  //读村镇区划数据
        if (that.data.saddv != 0) {
          return new AV.Query('ssq4')
          .equalTo('tncode', that.data.saddv)
          .first()
          .then(result => {
            let adgroup = result.toJSON() ;
            that.setData({ adglist: adgroup.tn });
          }).catch( console.error );
        };
        break;
      case 'saddgroup':                  //选择村镇
        showPage.adgvalue = value;
        if (that.data.adgvalue[0] == value[0]) {
          showPage.address1 = that.data.address1 + that.data.adglist[value[0]].n + that.data.adglist[value[0]].cm[value[1]].n;
        }
        that.setData(showPage);
        break;
      case 'modalAddressBox':                  //打开弹出页
        let newPage = {
          showModalBox,
          animationData,
          vData,
          reqData,
          adclist: require('addresclass.js'),   //读取行政区划分类数据
          adglist: [],
          saddv: 0,
          adcvalue: [3, 9, 15],
          adgvalue: [0, 0]
        };
        newPage.n = parseInt(dataset.n)      //数组下标;
        newPage.pageName = 'modalAddressBox';
        that.setData({sPages: that.data.sPages.push(newPage)});
        popModal(that);
        break;
    }
  }

}
