const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('procedureclass.js');
const initTime = new Date(0).toISOString();
var app = getApp();
function isAllData(cName){
  return ['articles','artshop'].indexOf(cName)>=0;
};
function appDataExist(dKey0, dKey1) {              //检查app.aData是否存在二三级的键值
  if (typeof app.mData.pAt[dKey0] == 'undefined') {
    app.mData.pAt[dKey0] = [initTime,initTime];
    return false
  }
  if (dKey1 in app.mData.pAt[dKey0]) {
    return true;
  } else {
    let dExist = app.mData.pAt[dKey0];
    dExist[dKey1] = [initTime,initTime];
    app.mData.pAt[dKey0] = dExist;
    return false;
  };
};
module.exports = {
  appDataExist: appDataExist,

  readAllData: function (isDown, pNo) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号
    return new Promise((resolve, reject) => {
      let inFamily = typeof procedureclass[pNo].afamily != 'undefined';            //是否有分类数组
      var umdata=[] ,updAt;
      var reqCloud = 'select * from '+pNo+' where'+(pNo=='goods' ? ' inSale=true and ' : ' ');                                      //进行数据库初始化操作
      updAt = appDataExist(pNo) ? app.mData.pAt[pNo] : [initTime, initTime];
      reqCloud += app.configData[pNo].cfield + ' in (';
      let fConfig = app.configData[pNo].fConfig;
      let dataIsInt = typeof fConfig[0] == 'number';
      let fcLength = fConfig.length-1;
      for(let i=0;i<=fcLength;i++){
        reqCloud += dataIsInt ? ( fConfig[i] + (i == fcLength ? ') ' : ',') ) : ( '"'+fConfig[i] + (i == fcLength ? '") ' : '",') )
      };
      umdata = app.mData[pNo] || [];
      if (isDown) {
        reqCloud+='and updatedAt>date("'+updAt[1]+'") ';          //查询本地最新时间后修改的记录
        reqCloud+='limit 1000 ';                      //取最大数量
        reqCloud+='order by +updatedAt';           //按更新时间升序排列
      } else {
        reqCloud += 'and updatedAt<date("' +updAt[0]+'") ';          //查询最后更新时间前修改的记录
        reqCloud+='order by -updatedAt';           //按更新时间降序排列
      };
      new AV.Query.doCloudQuery(reqCloud).then(cqRes => {
        var lena = cqRes.results.length;
        if (lena > 0) {
          let aPlace = -1, aProcedure={};
          if (isDown) {
            updAt[1] = cqRes.results[lena - 1].updatedAt;                          //更新本地最新时间
            updAt[0] = cqRes.results[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
          } else {
            updAt[0] = cqRes.results[lena - 1].updatedAt;          //更新本地最后更新时间
          };
          for (let i = 0; i < lena; i++) {//arp.forEach(aProc => {
            aProcedure = cqRes.results[i].toJSON();
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
            app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
          };
        };
        app.mData[pNo] = umdata;
        app.mData.pAt[pNo] = updAt;
        resolve(lena > 0);               //数据更新状态
      }).catch(error => {
        if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
      });
    }).catch(console.error);
  },

  updateData: function (isDown, pNo, uId) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号, uId单位Id
    return new Promise((resolve, reject) => {
      let isAll = isAllData(pNo);            //是否读所有数据
      let inFamily = typeof procedureclass[pNo].afamily != 'undefined';            //是否有分类数组
      var umdata=[] ,updAt;
      var readProcedure = new AV.Query(pNo);                                      //进行数据库初始化操作
      if (isAll) {
        updAt = appDataExist(pNo) ? app.mData.pAt[pNo] : [0, 0];
        umdata = app.mData[pNo] || [];
      } else {
        var unitId = uId ? uId : app.roleData.uUnit.objectId;
        readProcedure.equalTo('unitId', unitId);                //除权限和文章类数据外只能查指定单位的数据
        updAt = appDataExist(pNo, unitId) ? app.mData.pAt[pNo][unitId] : [0, 0];
        if (typeof app.mData[pNo][unitId] == 'undefined') {       //添加以单位ID为Key的JSON初值
          let umobj={};
          if (typeof app.mData[pNo] != 'undefined') { umobj=app.mData[pNo] };
          umobj[unitId] = [];
          app.mData[pNo] = umobj;
        } else {
          umdata = app.mData[pNo][unitId] || [];
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
            app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
          };
        };
        if (isAll) {
          app.mData[pNo] = umdata;
          app.mData.pAt[pNo] = updAt;
        } else {
          app.mData[pNo][unitId] = umdata;
          app.mData.pAt[pNo][unitId] = updAt;
        };
        resolve(lena > 0);               //数据更新状态
      }).catch(error => {
        if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
      });
    }).catch(console.error);
  },

  updateRoleData: function (isDown, pNo) {    //更新页面显示数据,isDown下拉刷新,pNo类定义
    return new Promise((resolve, reject) => {
      var umdata=[] ,updAt;
      var urData = new AV.Query(procedureclass[pNo].pModel);                                      //进行数据库初始化操作
        urData.equalTo(app.globalData.user.userRolName, app.globalData.user.objectId);                //除权限和文章类数据外只能查指定单位的数据
        updAt = appDataExist(pNo, app.globalData.user.objectId) ? app.mData.pAt[pNo][app.globalData.user.objectId] : [0, 0];
        if (typeof app.mData[pNo][app.globalData.user.objectId] == 'undefined') {       //添加以单位ID为Key的JSON初值
          let umobj={};
          if (typeof app.mData[pNo] != 'undefined') { umobj=app.mData[pNo] };
          umobj[app.globalData.user.objectId] = [];
          app.mData[pNo] = umobj;
        } else {
          umdata = app.mData[pNo][app.globalData.user.objectId] || [];
        }
      if (isDown) {
        urData.greaterThan('updatedAt', new Date(updAt[1]));          //查询本地最新时间后修改的记录
        urData.ascending('updatedAt');           //按更新时间升序排列
        urData.limit(1000);                      //取最大数量
      } else {
        urData.lessThan('updatedAt', new Date(updAt[0]));          //查询最后更新时间前修改的记录
        urData.descending('updatedAt');           //按更新时间降序排列
      };
      urData.find().then(results => {
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
            app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据对象记录到本机
          };
        };
        app.mData[pNo][app.globalData.user.objectId] = umdata;
        app.mData.pAt[pNo][app.globalData.user.objectId] = updAt;
        resolve(lena > 0);               //数据更新状态
      }).catch(error => {
        if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
      });
    }).catch(console.error);
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
