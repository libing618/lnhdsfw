//共享信息管理
const AV = require('../../libs/leancloud-storage.js');
const { initData } = require('../../model/initForm');
const wImpEdit = require('../import/impedit');
var app = getApp()
Page({
  data: {
    pNo: 0,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: {},                 //编辑值的对象
    unEdit: false,           //新建信息页面,可以提交和保存
    reqData: []
  },

  onLoad: function (options) {
    var that = this;
    if (app.roleData.uUnit.name == app.globalData.user.objectId) {       //单位名等于用户ID则为创始人
      let reqDatas = require('../../model/procedureclass.js')[0].pSuccess;
      let aList = require('../../model/procedureclass.js')[0].afamily;
      reqDatas.unshift({ gname: "afamily", p: '单位类型', t: "listsel", aList: aList })
      wx.setNavigationBarTitle({ title: app.roleData.uUnit.uName + '的信息', })
      new AV.Query('sengpi')
        .equalTo('unitId', app.roleData.uUnit.objectId)
        .equalTo('dProcedure', 0)
        .select(['dObject', 'cInstance', 'dObjectId', 'cManagers'])
        .descending('createdAt')
        .first().then((rdata) => {
          if (rdata) {
            var spdata = rdata.toJSON();
            that.data.vData = spdata.dObject;
            that.data.unEdit = spdata.cInstance > 0 && spdata.cInstance < spdata.cManagers.length;        //流程起点或已结束才能提交
          };
          that.data.dObjectId = app.globalData.user.unit;
          initData(reqDatas, that.data.vData).then(({ reqData, vData, funcArr }) => {
            funcArr.forEach(functionName => { that[functionName] = wImpEdit[functionName] });
            that.data.reqData = reqData;
            that.data.vData = vData;
            that.setData(that.data);
          });
        }).catch(console.error)
    } else {
      wx.showToast({ title: '您不是单位创始人，请在《我的信息》页创建单位！', icon: 'none', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    }
  },

  fSubmit: wImpEdit.fSubmit

})
