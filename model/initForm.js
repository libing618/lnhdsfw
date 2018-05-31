const AV = require('../libs/leancloud-storage.js');
const { updateData,appDataExist } = require('initupdate');
const { openWxLogin } = require('../libs/util');
const menuKeys = ['manage', 'marketing', 'customer'];
var app = getApp();
function fetchUser(roleData) {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({        //检查客户信息
      withCredentials: false,
      success: function ({ userInfo }) {
        if (userInfo) {
          let updateInfo = false;
          for (var iKey in userInfo) {
            if (userInfo[iKey] != roleData.user[iKey]) {             //客户信息有变化
              updateInfo = true;
              roleData.user[iKey] = userInfo[iKey];
            }
          };
          if (updateInfo) {
            AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
              rLoginUser.set(userInfo).save().then(() => { resolve(roleData) });
            })
          } else {
           resolve(roleData);
          };
        }
      },
      fail: () => { resolve(roleData) }
    });
  }).catch(console.error);
};
function checkRole(ouRole,user){
  let crd = false;
  switch (ouRole) {
    case 9:                    //注册用户
      if (user.objectId!=='0'){crd = true}
      break;
    case 8:                    //合伙人（含员工、渠道和推广人）
      if (user.mobilePhoneVerified){crd = true}
      break;
    case 7:                    //渠道（含员工和渠道合伙人）
      if (user.emailVerified){crd = true}
      break;
    case 6:                    //渠道合伙人
      if (user.userRolName!=='promoter' && user.emailVerified){crd = true}
      break;
    case 5:                    //负责人
      if (user.userRolName=='admin' && user.emailVerified){crd = true}
        break;
    default:                    //各条线员工
      let roleLine = parseInt(substring(user.userRolName,1,1));
      if (user.emailVerified){
        if (roleLine==ouRole || user.userRolName=='admin') {crd = true}
      }
      break;
  }
  return crd
};
function exitPage(){
  wx.showToast({ title: '权限不足请检查', duration: 2500 });
  setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
};

module.exports = {
checkRole: checkRole,
setTiringRoom: function(goTiringRoom){
  if (goTiringRoom && typeof goTiringRoom == 'boolean') {
    wx.setTabBarItem({
      index: 1,
      text: "营销",
      iconPath: "images/icon_forum.png",
      selectedIconPath: "images/icon_forum_HL.png"
    });
    wx.setTabBarItem({
      index: 2,
      text: "客服",
      iconPath: "images/customer.png",
      selectedIconPath: "images/customer-1.png"
    });
    wx.setTabBarItem({
      index: 3,
      text: "管理",
      iconPath: "images/icon_manage.png",
      selectedIconPath: "images/icon_my_HL.png"
    });
  } else {
    wx.setTabBarItem({
      index: 1,
      text: "分类",
      iconPath: "images/index.png",
      selectedIconPath: "images/index-1.png"
    });
    wx.setTabBarItem({
      index: 2,
      text: "购物车",
      iconPath: "images/icon_cart.png",
      selectedIconPath: "images/icon_cart_HL.png"
    });
    wx.setTabBarItem({
      index: 3,
      text: "我的",
      iconPath: "images/icon_my.png",
      selectedIconPath: "images/icon_my_HL.png"
    });
  }
},

shareMessage: function () {
  return {
    title: '扶贫济困，共享良品。',
    desc: '乐农汇',
    path: '/pages/home/home?sjid='+app.roleData.user.objectId
  }
},

initConfig: function(configData) {
  return new Promise((resolve, reject) => {
    new AV.Query('shopConfig').find().then(dConfig => {
      let cData;
      dConfig.forEach(conData => {
        cData = conData.toJSON();
        configData[cData.cName] = { objectId:cData.objectId,cfield: cData.cfield, fConfig: cData.fConfig, updatedAt: cData.updatedAt }
      });
      return new AV.Query('_User').select(['goodsIndex','channelid']).get(configData.sjid);
    }).then(sjData => {
      if (sjData.get('goodsIndex')) { configData.goodsIndex = sjData.get('goodsIndex') };
      configData.channelid = sjData.get('channelid');
      resolve(configData)
    })
  }).catch(console.error)
},

loginAndMenu: function (lcUser,roleData) {
  return new Promise((resolve, reject) => {
    if (lcUser) {roleData.user=lcUser.toJSON()};
    AV.Cloud.run('getIP',).then(aIP=>{
      roleData.ipAddress=aIP.remoteAddress
      resolve(true);
    }).catch(()=>{ resolve(false) })
  }).then((getIp)=>{
    return new Promise((resolve, reject) => {
      if (roleData.user.objectId == '0') {
        openWxLogin(roleData).then(rlgData => {
          resolve(true);
        }).catch((loginErr) => { resolve(false) });  //系统登录失败
      } else {       //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
        resolve(true)
      }
    })
  }).then(logined=>{
    return new Promise((resolve, reject) => {
      if (logined){
        if(roleData.user.emailVerified) {
          new AV.Query('userInit')
          .notEqualTo('updatedAt', new Date(roleData.wmenu.updatedAt))
          .select(menuKeys)
          .equalTo('initName', roleData.user.userRolName)
          .find().then(fetchMenu => {
            if (fetchMenu.length > 0) {                          //菜单在云端有变化
              roleData.wmenu = fetchMenu[0].toJSON();
              menuKeys.forEach(mname => {
                roleData.wmenu[mname] = roleData.wmenu[mname].filter(rn => { return rn != 0 });
              });
            };
            fetchUser(roleData).then(rfmData => { resolve(rfmData) });
          });
        } else {fetchUser(roleData).then(rfmData => { resolve(rfmData) })};
      } else { resolve(roleData) };
    })
  }).catch(console.error);
},

checkRols: function(ouRole,user){
  let crd = checkRole(ouRole,user);
  if(!crd) {exitPage();};
  return crd
},

initLogStg: (pName)=>{
  let initlog = {};
  initlog.startTime = new Date();
  initlog.broweObject = pName;          //登录页名称
  initlog.promoter = app.configData.sjid;
  initlog.channel = app.configData.channelid;
  initlog.stayTime = app.configData.scene;          //登录的场景值
  return new Promise((resolve, reject) => {
    if ( app.roleData.user.objectId=='0'){    //未注册用户
      if (app.configData.browser) {
        initlog.userId = app.configData.browser
        initlog.pModel = 'browerUser';
        resolve(false)
      } else {
        initlog.pModel = 'newBrower';
        if (app.roleData.ipAddress){
          resolve(true);
        } else {
          AV.Cloud.run('getIP',).then(aIP=>{
            app.roleData.ipAddress=aIP.remoteAddress;
            resolve(true);
          })
        };
      };
    } else {                               //已注册用户
      initlog.userId=app.roleData.user.objectId;
      let mReqACL = new AV.ACL();
      mReqACL.setReadAccess(app.roleData.user.objectId,true);
      mReqACL.setReadAccess(app.configData.sjid,true);
      mReqACL.setReadAccess(app.configData.channelid,true);
      mReqACL.setWriteAccess(app.roleData.user.objectId,true);
      mReqACL.setRoleReadAccess(app.roleData.shopId,true);
      app.configData.reqRole = mReqACL;
      initlog.pModel = 'signupUser';
      resolve(false)
    }
  }).then(nBrower=>{
    if (nBrower){
      app.configData.browser = app.sysinfo.brand + app.sysinfo.model + app.roleData.ipAddress;
      initlog.userId = app.configData.browser
    }
    wx.setStorage({ key: 'configData', data: app.configData });
    wx.setStorage({ key: 'browseLog',data: [initlog] });
  });
},

unitData: function(cName, unitId) {
  let uData = {};
  if (app.mData[cName][unitId]) { app.mData[cName][unitId].forEach(cuId => { uData[cuId] = app.aData[cName][cuId] }) };
  return uData;
},

readAllData: function (isDown, pNo) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号
  return new Promise((resolve, reject) => {
    let inFamily = pNo =='articles';            //是否有分类数组
    var umdata=[] ,updAt;
    var reqCloud = 'select * from '+pNo+' where'+(pNo=='goods' ? ' inSale=true and ' : ' ');                                      //进行数据库初始化操作
    if (typeof app.mData.pAt[pNo] == 'undefined') {
      app.mData.pAt[pNo] = [new Date(0).toISOString(), new Date(0).toISOString()];
      updAt = [new Date(0).toISOString(), new Date(0).toISOString()];
    } else {
      updAt = app.mData.pAt[pNo]
    }
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
          updAt[1] = cqRes.results[lena - 1].updatedAt.toISOString();                          //更新本地最新时间
          updAt[0] = cqRes.results[0].updatedAt.toISOString(); //若本地记录时间为空，则更新本地最后更新时间
        } else {
          updAt[0] = cqRes.results[lena - 1].updatedAt.toISOString();          //更新本地最后更新时间
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
      if (!app.netState) { wx.showToast({ title: '请检查网络！' }) }
    });
  }).catch(console.error);
},

updateRoleData: function(isDown, pNo) {    //更新页面显示数据,isDown下拉刷新,pNo类定义
  return new Promise((resolve, reject) => {
    var umdata=[] ,updAt;
    var urData = new AV.Query(procedureclass[pNo].pModel);                                      //进行数据库初始化操作
    let userType = app.roleData.user.userRolName=='promoter' ? 'promoter' : 'channel';
    if (app.roleData.user.userRolName!=='admin') {urData.equalTo(userType, app.roleData.user.objectId)};                //除权限和文章类数据外只能查指定单位的数据
      updAt = appDataExist(pNo, app.roleData.user.objectId) ? app.mData.pAt[pNo][app.roleData.user.objectId] : [0, 0];
      if (typeof app.mData[pNo][app.roleData.user.objectId] == 'undefined') {       //添加以单位ID为Key的JSON初值
        let umobj={};
        if (typeof app.mData[pNo] != 'undefined') { umobj=app.mData[pNo] };
        umobj[app.roleData.user.objectId] = [];
        app.mData[pNo] = umobj;
      } else {
        umdata = app.mData[pNo][app.roleData.user.objectId] || [];
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
      app.mData[pNo][app.roleData.user.objectId] = umdata;
      app.mData.pAt[pNo][app.roleData.user.objectId] = updAt;
      resolve(lena > 0);               //数据更新状态
    }).catch(error => {
      if (!that.netState) { wx.showToast({ title: '请检查网络！' }) }
    });
  }).catch(console.error);
}

}
