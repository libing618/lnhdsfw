// 通用的内容编辑pages
const weImp = require('../../libs/weimport.js');
var app = getApp()
var sPage = {
  data: {
    selectd: -1,                       //详情项选中字段序号
    enMenu: 'none',                  //‘插入、删除、替换’菜单栏关闭
    enIns: true,                  //插入grid菜单组关闭
    pNo: 1,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: {},
    reqData: []
  },
  onLoad: function (options) {        //传入参数为tgId或artId,不得为空
    var that = this;
    let cUnitName = app.globalData.user.emailVerified ? app.uUnit.nick : '体验用户';
    let aaData;
    that.data.uEV = app.globalData.user.emailVerified;            //用户已通过单位和职位审核
    return new Promise((resolve, reject) => {
      if (typeof options.tgId == 'string') {                   //传入参数含审批流程ID，则为编辑审批中的数据
        if (app.procedures[options.tgId].length>0) {
          aaData = app.procedures[options.tgId].dObject;
          that.data.targetId = options.tgId;
          cUnitName = app.procedures[options.tgId].unitName;               //申请单位名称
          resolve({pNo:app.procedures[options.tgId].dProcedure,pId:app.procedures[options.tgId].dObjectId});
        } else { reject() };
      } else {
        if (typeof options.pNo =='number'){
          resolve({pNo:options.pNo, pId:options.artId});
        } else { reject() };
      }
    }).then(ops=>{
      var pClass = require('../../model/procedureclass.js')[ops.pNo];
      that.data.reqData = pClass.pSuccess;
      that.data.pNo = ops.pNo;
      let titleName = pClass.pName;
      switch (typeof ops.pId){
        case 'number':           //传入参数为一位数字的代表类型
          that.data.dObjectId = pClass.pModle + ops.pId;      //根据类型建缓存KEY
          that.data.vData.afamily = ops.pId;       //未提交或新建的类型
          titleName = pClass.afamily[ops.pId]
          break;
        case 'string':                   //传入参数为已发布ID，重新编辑已发布的数据
          that.data.dObjectId = ops.pId;
          break;
        case 'undefined':               //未提交或新建的数据KEY为审批流程pModle的值
          that.data.dObjectId = pClass.pModle;
          break;
      }
      aaData = typeof aaData == 'undefined' ? app.aData[ops.pNo][that.data.dObjectId] : aaData;
      weImp.initData(that.data,aaData);
    }).catch((error)=>{
      wx.showToast({ title: '数据传输有误，请联系客服！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    });
    wx.setNavigationBarTitle({
      title: cUnitName + '的'+titleName,
    })
  }
};
sPage['fSubmit'] = weImp.fSubmit;
sPage.data.reqData.forEach(upSuccess=>{
  let functionName = 'i_'+upSuccess.t;             //每个输入类型定义的字段长度大于2则存在对应处理过程
  if (functionName.length>4) {
    sPage[functionName] = weImp[functionName];
    if (functionName=='i_eDetail'){
      sPage.farrData = weImp.farrData;
      sPage.i_insdata = weImp.i_insdata;
    }
  };

})

Page(sPage)
