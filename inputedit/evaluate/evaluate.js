//客户评价及统计
const AV = require('leancloud-storage.js');
const {checkRols,hTabClick} = require('../../libs/util.js');
const { updateData } = require('../../model/initupdate');
var app = getApp();
Page({
  data:{
    ht:{
      navTabs: ['好评','差评'],
      fLength: 2,
      pageCk: 0
    },
    pw: app.sysinfo.pw,
    pNo: 'evaluates',
    cPage: [[],[]],
    pageData: {},
    sPages: [{
      pageName: 'tabPanelPage'
    }],
    reqData: require('../../model/procedureclass').evaluates.pSuccess,
    showModalBox: false,
    animationData: {}
  },
  evlsq: new AV.Query('evaluates'),
  notEnd: true,
  onReady:function(){
    var that = this;
    if (checkRols(5,app.roleData.user)) {
      that.evlsq.ascending('createdAt');
      that.evlsq.limit(1000);
      that.updatePage();
    };
  },
  updatePage: function(){
    var that = this;
    if (that.notEnd){
      that.evlsq.find().then(evls=>{
        if (evls){
          indexRecordFamily(evls,'specs',2).then(({indexList,aData,mData})=>{
            that.setData({
              cPage: indexList,
              pageData: aData,
              mPage: mData
            })
          })
          that.evlsq.skip(1000);
        } else { that.notEnd = false }
      })
    }
  },

  hTabClick: hTabClick,

  makePhone: function({currentTarget:{id}}){
    wx.makePhoneCall({phoneNumber:id})
  },

  onReachBottom:function(){
    this.updatePage();
  }
})
