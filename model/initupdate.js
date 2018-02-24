const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('procedureclass.js');
var app = getApp();
function isAllData(pNo){
  switch (pNo){
    case 1 :
      return true;
      break;
    case 6 :
      return true;
      break;
    default :
      return false;
      break;
  }
}
module.exports = {
  appDataExist: function(dKey0,dKey1,dKey2){              //检查app.aData是否存在二三级的键值
    let dExist = true;
    if (typeof app.aData[dKey0] == 'undefined' ){ return false }
    if (dKey1 in app.aData[dKey0]){
      if (typeof dKey2 == 'string'){
        if (!(dKey2 in app.aData[dKey0][dKey1])){
          dExist = false;
        }
      }
    } else { dExist = false };
    return dExist;
  },

  isAllData: isAllData,

  updateData: function (isDown, pNo, uId) {    //更新页面显示数据,isDown下拉刷新
    return new Promise((resolve, reject) => {
      if (typeof pNo == 'string') {
        procedureclass.forEach(pClass => { if (pClass.pModel == pNo) { pNo = pClass.pNo } });
      }
      var cName = procedureclass[pNo].pModel;
      let isAll = isAllData(pNo);            //是否读所有数据
      let inFamily = typeof procedureclass[pNo].afamily != 'undefined';            //是否有分类数组
      var umdata = [];
      let updAt = app.mData.pAt[cName];
      var readProcedure = new AV.Query(cName);                                      //进行数据库初始化操作
      if (isAll) {
        updAt = (typeof app.mData.pAt[cName] == 'undefined') ? [0, 0] : app.mData.pAt[cName];
        umdata = app.mData[cName];
      } else {
        var unitId = uId ? uId : app.roleData.uUnit.objectId;
        readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
        updAt = (typeof app.mData.pAt[cName][unitId] == 'undefined') ? [0, 0] : app.mData.pAt[cName][unitId];
        if (typeof app.mData[cName][unitId] == 'undefined') {       //添加以单位ID为Key的JSON初值
          let uaobj = {},upobj={},umobj={};
          if (typeof app.mData[cName] != 'undefined') { umobj=app.mData[cName] };
          umobj[unitId] = [];
          app.mData[cName] = umobj;
          if (typeof app.aData[cName] != 'undefined') { uaobj=app.aData[cName] };
          uaobj[unitId] = {};
          app.aData[cName] = uaobj;
          if (typeof app.mData.pAt[cName] != 'undefined') { upobj=app.mData.pAt[cName] };
          upobj[unitId] = [0, 0];
          app.mData.pAt[cName] = upobj;
        } else {
          umdata = app.mData[cName][unitId];
        }
      };
      if (isDown) {
        readProcedure.greaterThan('updatedAt', new Date(updAt[1]));          //查询本地最新时间后修改的记录
        readProcedure.ascending('updatedAt');           //按更新时间升序排列
        readProcedure.limit(1000);                      //取最大数量
      } else {
        readProcedure.lessThan('updatedAt', new Date(updAt[0]));          //查询最后更新时间前修改的记录
        readProcedure.descending('updatedAt');           //按更新时间降序排列
      };
      readProcedure.find().then(results => {
        var lena = results.length;
        if (lena > 0) {
          let aPlace = -1, aProcedure={};
          if (isDown) {
            updAt[1] = results[lena - 1].updatedAt;                          //更新本地最新时间
            updAt[0] = results[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
          } else {
            updAt[0] = results[lena - 1].updatedAt;          //更新本地最后更新时间
          };
          for (let i = 0; i < lena; i++) {//arp.forEach(aProc => {
            aProcedure = results[i].toJSON();
            if (inFamily) {                         //存在afamily类别
              if (typeof umdata[aProcedure.afamily] == 'undefined') { umdata[aProcedure.afamily] = [] };
              if (isDown) {
                aPlace = umdata[aProcedure.afamily].indexOf(aProcedure.objectId);
                if (aPlace >= 0) { umdata[aProcedure.afamily].splice(aPlace, 1) }           //删除本地的重复记录列表
                umdata[aProcedure.afamily].unshift(aProcedure.objectId);
              } else {
                umdata[aProcedure.afamily].push(aProcedure.objectId);
              }
            } else {
              if (isDown) {
                aPlace = umdata.indexOf(aProcedure.objectId);
                if (aPlace >= 0) { umdata.splice(aPlace, 1) }           //删除本地的重复记录列表
                umdata.unshift(aProcedure.objectId);
              } else {
                umdata.push(aProcedure.objectId);                   //分类ID数组增加对应ID
              }
            };
            if (isAll) {
              app.aData[cName][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
            } else {
              app.aData[cName][unitId][aProcedure.objectId] = aProcedure;
            }
          };
        };
        if (isAll) {
          app.mData[cName] = umdata;
          app.mData.pAt[cName] = updAt;
        } else {
          app.mData[cName][unitId] = umdata;
          app.mData.pAt[cName][unitId] = updAt;
        };
        resolve(lena > 0);               //数据更新状态
      }).catch(error => {
        wx.onNetworkStatusChange(res => {
          if (!res.isConnected) { wx.showToast({ title: '请检查网络！' }) }
        });
      });
    }).catch(console.error);
  },

  className: function(pNo) {              //返回数据表名
    return procedureclass[pNo].pModel
  },

  classInFamily: function(pNo) {              //判断数据表是否有分类控制
    return (typeof procedureclass[pNo].afamily != 'undefined');
  },

  familySel: function(pNo){              //数据表有分类控制的返回分类长度和选择记录
    let psData = {};
    if (typeof procedureclass[pNo].afamily != 'undefined') {
      psData.fLength = procedureclass[pNo].afamily.length;
      psData.pageCk = app.mData['pCk'+pNo];
      psData.tabs = procedureclass[pNo].afamily;
    };
    return psData;
  }

}
