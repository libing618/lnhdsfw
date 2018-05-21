const AV = require('../../libs/leancloud-storage.js');
var app = getApp();
function setRole(puRoles){
  let cUserName = {};
  let cManagers = [[app.roleData.user.objectId]];
  cUserName[app.roleData.user.objectId] = app.roleData.user.uName;
  if (puRoles) {          //有本单位审批设置
    let pRolesNum = 0, pRoleUser;
    new AV.Query('_User')
    .notEqualTo('userRolName','channel')
    .equalTo('emailVerified',true)
    .select(['emailVerified','uName','nickName','avatarUrl','userRolName','channelid'])
    .find().then(shopUsers => {
      shopUsers=shopUsers.map(sUser=>{return sUser.toJSON()});
      for (let i = 0; i < puRoles.length; i++) {
        pRoleUser = [];
        shopUsers.forEach((pUser) => {
          if (pUser.userRolName == puRoles[i]) {
            pRoleUser.push(pUser.objectId);
            cUserName[pUser.objectId] = pUser.uName;
          }
        })
        if (pRoleUser.length != 0) {
          pRolesNum = pRolesNum + 1;
          cManagers.push(pRoleUser);
        }
      };
      if (pRolesNum == 0 && app.roleData.user.userRolName != 'admin') {
        shopUsers.forEach((pUser) => {
          if (pUser.userRolName == 'admin') {
            cManagers.push([pUser.objectId]);
            cUserName[pUser.objectId] = pUser.uName;
          }
        })
      }
    }).catch(console.error)
  }
  let managers = [];
  cManagers.forEach((manger) => { manger.forEach((mUser) => { managers.push(mUser) }) });
  return { cManagers,cUserName,managers}
};
module.exports = {

  fSubmit: function (e) {
    var that = this;
    let approvalID = parseInt(that.data.pNo);        //流程序号
    var approvalClass = require('../../model/procedureclass.js')[approvalID];       //流程定义和数据结构
    var subData = e.detail.value;
    let cNumber = ['fg','dg','listsel'];       //数字类型定义
    let cObject = ['assettype','producttype','arrplus','ed'];       //对象类型定义
    if (Array.isArray(that.data.vData.details)) {
      for (let i = 0; i < that.data.vData.details.length; i++) {
        that.data.vData.details[i].e = subData['ade' + i];
        that.data.vData.details[i].c = subData['adc' + i];
      };
    };
    var emptyField = '';                   //检查是否有字段输入为空
    that.data.reqData.forEach(req=>{
      if (req.gname in subData){ that.data.vData[req.gname]=subData[req.gname]; }
      if (typeof that.data.vData[req.gname]=='undefined'){
        emptyField += '《' + req.p + '》';
      } else {
        if ( cNumber.indexOf(req.t)>=0 ) { that.data.vData[req.gname] = Number(that.data.vData[req.gname]); }
        if ( cObject.indexOf(req.t)>=0 && typeof that.data.vData[req.gname]=='string') {that.data.vData[req.gname] = JSON.parse(that.data.vData[req.gname])}
      }
    });
    var sFilePath = new Promise(function (resolve, reject) {         //本地媒体文件归类
      let filePaths = [];
      const mdtn = ['pic', 'thumb', 'vidio', 'file'];
      const mdt = ['-2', '-3', '-4', '-6'];
      that.data.reqData.forEach(nField => {
        switch (nField.t) {
          case 'eDetail':
            for (let a = 0; a < that.data.vData[nField.gname].length; a++) {
              if (mdt.indexOf(that.data.vData[nField.gname][a].t) >= 0) {     //该字段正文的内容为媒体
                filePaths.push({ na: [nField.gname, a], fPath: that.data.vData[nField.gname][a].c, fType: 2, fn: 2 });
              }
            }
            break;
          case 'pics':
            for (let b = 0; b < that.data.vData[nField.gname].length; b++) {     //该字段为图片组
              filePaths.push({ na: [nField.gname, b], fPath: that.data.vData[nField.gname][b], fType: 2, fn: 1 });
            }
            break;
          default:
            if (mdtn.indexOf(nField.t) >= 0) {            //该字段为媒体
              filePaths.push({ na: [nField.gname, -1], fPath: that.data.vData[nField.gname], fType: 2, fn: 0 });
            }
            break;
        }
      });
      wx.getSavedFileList({
        success: function (res) {
          let saveFileList = res.fileList.map(fList => { return fList.filePath });
          let saveFiles = filePaths.map(sfPath => {
            return new Promise((resolve, reject) => {
              if (saveFileList.indexOf(sfPath.fPath) >= 0) {
                sfPath.fType = 1;
                resolve(sfPath);
              } else {
                wx.getFileInfo({
                  filePath: sfPath.fPath,
                  success: function () {
                    sfPath.fType = 0;
                    resolve(sfPath);
                  },
                  fail: () => { resolve(sfPath) }
                })
              }
            });
          });
          Promise.all(saveFiles).then((sFileList) => { resolve(sFileList) });
        },
        fail: function () { resolve([]) }
      });
    });
    switch (e.detail.target.id) {
      case 'fdeldata':                                 //删除内容部分选中的字段
        if (that.data.selectd >= 0) {                         //内容部分容许删除
          that.data.vData.details.splice(that.data.selectd, 1);
          that.setData({ 'vData.details': that.data.vData.details, enMenu: 'none' });
        } else { wx.showToast({ title: '此处禁止删除！' }) }
        break;
      case 'fenins':                   //允许显示插入菜单
        that.setData({ enMenu: 'none', enIns: false })      //‘插入、删除、替换’菜单栏关闭
        break;
      case 'fupdate':                          //替换数据
        that.setData({ enMenu: 'none' })
        that.farrData(that.data.vData.details[that.data.selectd].t, 1);      //选择多媒体项目内容;
        break;
      case 'fStorage':           //编辑内容不提交流程审批,在本机保存
        if (that.data.targetId == '0') {
          sFilePath.then(fileArr => {
            let tFileArr = fileArr.filter(function (tFile) { return tFile.fType == 0 });
            if (tFileArr.length > 0) {
              let sFileArr = tFileArr.map((tFileStr) => {
                return new Promise((resolve, reject) => {
                  wx.saveFile({
                    tempFilePath: tFileStr.fPath,
                    success: function (res2) {
                      switch (tFileStr.fn) {
                        case 0:
                          that.data.vData[tFileStr.na[0]] = res2.savedFilePath;
                          break;
                        case 1:
                          that.data.vData[tFileStr.na[0]][tFileStr.na[1]] = res2.savedFilePath;
                          break;
                        case 2:
                          that.data.vData[tFileStr.na[0]][tFileStr.na[1]].c = res2.savedFilePath;
                          break;
                      }
                      resolve(res2.savedFilePath)
                    }
                  })
                })
              });
              Promise.all(sFileArr).then(() => {
                app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData;
              }).catch(console.error);
            } else { app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData; }
          });
        }
        break;
      case 'fSave':
        if (emptyField) {
          wx.showToast({ title: '请检查下列未输入项目:'+emptyField , icon:'none',duration: 5000 })
        } else {
          sFilePath.then(sFileLists => {
            let sFileArr = sFileLists.filter(sFile => { return sFile.fType < 2 });
            return new Promise((resolve, reject) => {
              if (sFileArr.length > 0) {
                wx.showLoading({ title: '文件提交中' });
                sFileArr.map(sFileStr => () => new AV.File('filename', { blob: { uri: sFileStr.fPath, }, }).save().then(sfile => {
                  if (sFileStr.fType == 1) { wx.removeSavedFile({ filePath: sFileStr.fPath }) };      //删除本机保存的文件
                  switch (sFileStr.fn) {
                    case 0:
                      that.data.vData[sFileStr.na[0]] = sfile.url();
                      break;
                    case 1:
                      that.data.vData[sFileStr.na[0]][sFileStr.na[1]] = sfile.url();
                      break;
                    case 2:
                      that.data.vData[sFileStr.na[0]][sFileStr.na[1]].c = sfile.url();
                      break;
                    default:
                      break;
                  }
                })
                ).reduce(
                  (m, p) => m.then(v => Promise.all([...v, p()])),
                  Promise.resolve([])
                ).then(files => {
                  wx.hideLoading();
                  resolve(files);
                }).catch(console.error)
              } else { resolve('no files save') };
            })
          }).then((sFiles) => {
            if (that.data.targetId == '0') {                    //新建流程的提交
              let approvalRole = setRole(approvalClass.puRoles);
              var acl = new AV.ACL();      // 新建一个 ACL 实例
              if (approvalRole.cManagers.length==1){                  //流程无后续审批人
                let dObject = AV.Object.extend(approvalClass.pModel);
                let sObject = new dObject();
                that.data.vData.shopId = app.roleData.shopId;
                that.data.vData.shopName = app.roleData.shopName;
                acl.setPublicReadAccess(true);
                acl.setWriteAccess(approvalRole.managers[0], true);
                sObject.setACL(acl);
                sObject.set(that.data.vData).save().then((sd)=>{
                  wx.showToast({ title: '审批内容已发布', duration:2000 });
                }).catch((error)=>{
                  wx.showToast({ title: '审批内容发布出现错误'+error.error, icon:'none', duration: 2000 });
                })
              } else {
                let nApproval = AV.Object.extend('sengpi');        //创建审批流程
                var fcApproval = new nApproval();
                fcApproval.set('dProcedure', approvalID);                //流程类型
                fcApproval.set('dResult', 0);                //流程处理结果0为提交
                fcApproval.set("shopName", app.roleData.shopName);                 //申请单位
                fcApproval.set("sponsorName", app.roleData.user.uName);         //申请人
                fcApproval.set("shopId", app.roleData.shopId);        //申请单位的ID
                fcApproval.set('dIdear', [{ un: app.roleData.user.uName, dt: new Date(), di: '提交流程', dIdear: '发起审批流程' }]);       //流程处理意见
                fcApproval.set('cManagers', approvalRole.cManagers);             //处理人数组
                fcApproval.set('cUserName', approvalRole.cUserName);             //处理人姓名JSON
                fcApproval.set('cInstance', 1);             //下一处理节点
                fcApproval.set('cFlowStep', approvalRole.cManagers[1]);              //下一流程审批人
                fcApproval.set('dObject', that.data.vData);            //流程审批内容
                acl.setRoleReadAccess(app.roleData.shopId, true);
                acl.setRoleReadAccess(app.roleData.shopId, true);
                approvalRole.managers.forEach(mUser => {
                  acl.setWriteAccess(mUser, true);
                  acl.setReadAccess(mUser, true);
                })
                fcApproval.setACL(acl);         // 将 ACL 实例赋予fcApproval对象
                fcApproval.save().then((resTarget) => {
                  wx.showToast({ title: '流程已提交,请查询审批结果。', icon:'none',duration: 2000 }) // 保存成功
                }).catch(wx.showToast({ title: '提交保存失败!', icon:'loading',duration: 2000 })) // 保存失败
              }
            } else {
              app.procedures[that.data.targetId].dObject = that.data.vData;
              app.logData.push([Date.now(),that.data.targetId+'修改内容：'+that.data.vData.toString()]);
            }
            }).catch(error => {
              app.logData.push([Date.now(), '编辑提交发生错误:' + error.toString()]);
            });
          setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
        }
        break;
    };
  }
}
