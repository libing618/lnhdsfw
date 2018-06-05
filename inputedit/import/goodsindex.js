// 店铺货架
const AV = require('../../libs/leancloud-storage.js');
const {hTabClick} = require('../../libs/util.js');
const { checkRols,readAllData } =  require('../../model/initForm');
const {f_modalSwitchBox,f_modalFieldView} = require('../../model/controlModal');
var app = getApp()
Page({
  data:{
    pNo: 'goods',
    pw: app.sysinfo.pw,
    ht:{
      navTabs: ['推荐排名','尚未推荐'],
      modalBtn: ['移出','推荐'],
      fLength: 2,
      pageCk: 0
    },
    pInfo: app.roleData.user.userRolName=='promoter' ? '推广分红:' : '渠道分红:',
    infoName: app.roleData.user.userRolName=='promoter' ? 'promoter' : 'channel',
    cPage: [app.configData.goodsIndex,[]],
    pageData: app.aData.goods,
    sPages: [{
      pageName: 'tabPanelChange'
    }],
    iFormat: app.fData.goods.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      readAllData(true,'goods').then(isupdated=>{
        let mgData = app.mData.goods.filter(goodsId=>{
          return (app.configData.goodsIndex.indexOf(goodsId)<0)
        })
        that.setData({
          cPage: [app.configData.goodsIndex,mgData],
          pageData: app.aData.goods
        })
      }).catch(console.error);
    };
  },

  hTabClick: hTabClick,

  f_modalSwitchBox: f_modalSwitchBox,

  f_modalFieldView: f_modalFieldView,

  f_tabPanelChange:function({currentTarget:{id}}){
    var that = this;
    app.configData.goodsindex = that.data.cPage[0];
    if (id=='fSave'){
      AV.User.become(AV.User.current().getSessionToken()).select(['goodsIndex']).then((rLoginUser) => {
        let gIndex = rLoginUser.get('goodsIndex');
        if (gIndex.toString()!=app.configData.goodsindex.toString()){
          rLoginUser.set('goodsIndex',app.configData.goodsindex).save().then(() => { resolve(roleData) });
        }
      })
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }

})
