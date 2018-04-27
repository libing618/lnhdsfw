// 店铺货架
const AV = require('../../libs/leancloud-storage.js');
const {checkRols,hTabClick} = require('../../libs/util.js');
const { readAllData } = require('../../model/initupdate');
const {f_modalSwitchBox,f_modalFieldBox} = require('../../model/controlModal');
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
    cPage: [app.configData.goodsindex,[]],
    pageData: app.aData.goods,
    sPages: [{
      pageName: 'tabPanelPage'
    }],
    reqData: require('../../model/procedureclass').goods.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  onLoad:function(options){
    var that = this;
    if (checkRols(8,app.roleData.user)) {
      readAllData(true,'goods').then(isupdated=>{
        let mgData = app.mData.goods.filter(goodsId=>{
          return (app.configData.goodsindex.indexOf(goodsId)<0)
        })
        switch (app.roleData.user.userRolName) {
          case expression:

            break;
          default:

        };
        that.setData({
          cPage: [app.configData.goodsindex,mgData],
          pageData: app.aData.goods
        })
      }).catch(console.error);
    };
  },

  hTabClick: hTabClick,

  f_modalSwitchBox: f_modalSwitchBox,

  f_modalFieldBox: f_modalFieldBox;

  f_tabPanelPage:function({currentTarget:{id}}){
    var that = this;
    app.configData.goodsindex = that.data.cPage[0];
    if (id=='fSave'){
      AV.User.become(AV.User.current().getSessionToken()).select(['goodsindex']).then((rLoginUser) => {
        let gIndex = rLoginUser.get('goodsindex');
        if (gIndex.toString()!=app.configData.goodsindex.toString()){
          rLoginUser.set('goodsindex',app.configData.goodsindex).save().then(() => { resolve(roleData) });
        }
      })
    }
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 500);
  }

})
