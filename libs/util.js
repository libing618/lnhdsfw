const AV = require('leancloud-storage.js');
const wxappNumber = 2;    //本小程序在开放平台中自定义的序号
const menuKeys=['manage', 'marketing', 'customer'];
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
function exitPage(){
  wx.showToast({ title: '权限不足请检查', duration: 2500 });
  setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
};
function openWxLogin(roleData) {            //注册登录（本机登录状态）
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (wxlogined) {
        if (wxlogined.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (wxuserinfo) {
              if (wxuserinfo) {
                AV.Cloud.run('wxLogin'+wxappNumber, { code: wxlogined.code, encryptedData: wxuserinfo.encryptedData, iv: wxuserinfo.iv }).then(function (wxuid) {
                  let signuser = {};
                  signuser['uid'] = wxuid.uId;
                  AV.User.signUpOrlogInWithAuthData(signuser, 'openWx').then((statuswx) => {    //用户在云端注册登录
                    if (statuswx.createdAt != statuswx.updatedAt)          //客户已注册在本机初次登录成功
                    {
                      roleData.user = statuswx.toJSON();
                      resolve(roleData);
                    } else {                         //客户在本机授权登录则保存信息
                      let newUser = wxuserinfo.userInfo;
                      newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                      newUser.sjid = roleData.user.sjid;
                      newUser.channelid = roleData.user.userRolName=='0' ? roleData.user.channelid : statuswx.id;
                      let mReqACL = new AV.ACL();
                      mReqACL.setPublicReadAccess(true);
                      mReqACL.setWriteAccess(statuswx.objectId,true)
                      mReqACL.setRoleWriteAccess(roleData.shopId,true);
                      mReqACL.setRoleReadAccess(roleData.shopId,true);
                      statuswx.set(newUser);
                      statuswx.setACL(mReqACL);
                      statuswx.save().then((wxuser) => {
                        roleData.user = wxuser.toJSON();
                        resolve(roleData);                //客户在本机刚注册，无菜单权限
                      }).catch(err => { reject({ ec: 0, ee: err }) });
                    }
                  }).catch((cerror) => { reject({ ec: 2, ee: cerror }) });    //客户端登录失败
                }).catch((error) => { reject({ ec: 1, ee: error }) });       //云端登录失败
              }
            }
          })
        } else { reject({ ec: 3, ee: '微信用户登录返回code失败！' }) };
      },
      fail: function (err) { reject({ ec: 4, ee: err.errMsg }); }     //微信用户登录失败
    })
  });
};

function fetchMenu(roleData) {
  return new Promise((resolve, reject) => {
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
    });
  }).catch(console.error);
};

module.exports = {
  openWxLogin: openWxLogin,
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

  loginAndMenu: function (lcUser,roleData) {
    return new Promise((resolve, reject) => {
      if (lcUser) {roleData.user=lcUser.toJSON()};
      if (roleData.user.objectId != '0') {             //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
        if (roleData.user.emailVerified) {
          fetchMenu(roleData).then(rfmData => { resolve(rfmData) });
        } else { resolve(roleData) };
      } else {
        wx.getSetting({
          success:(res)=> {
            if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
              openWxLogin(roleData).then(rlgData => {
                if (rlgData.user.emailVerified) {
                  fetchMenu(rlgData).then(rfmData => { resolve(rfmData) });
                } else { resolve(rlgData) }
              }).catch((loginErr) => { reject('系统登录失败:' + loginErr.toString()) });
            } else { resolve(roleData) }
          },
          fail: (resFail) => { resolve(roleData) }
        })
      }
    }).catch(console.error);
  },

  checkRols: function(ouRole,user){
    if (user.userRolName=='admin' && user.emailVerified){
      return true;
    } else {
      let roleLine = parseInt(substring(user.userRolName,1,1));
      if (roleLine==ouRole && user.emailVerified) {
        return true;
      } else {
        exitPage();
        return false
      }
    }
  },

  initConfig: function(configData) {
    return new Promise((resolve, reject) => {
      new AV.Query('shopConfig').find().then(dConfig => {
        let cData;
        dConfig.forEach(conData => {
          cData = conData.toJSON();
          configData[cData.cName] = { cfield: cData.cfield, fConfig: cData.fConfig, updatedAt: cData.updatedAt }
        });
        return new AV.Query('_User').select(['goodsIndex','channelid']).get(configData.sjid);
      }).then(sjData => {
        if (sjData.get('goodsIndex')) { configData.goodsIndex = sjData.get('goodsIndex') };
        configData.channelid = sjData.get('channelid');
        resolve(configData)
      })
    }).catch(console.error)
  },

  fetchRecord: function(requery,indexField,sumField) {                     //同步云端数据到本机
    return new Promise((resolve, reject) => {
      let aData = {}, mData = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {};
      arp.forEach(onedata => {
        aData[onedata.id] = onedata;
        iField = onedata.get(indexField);                  //索引字段读数据数
        if (indexList.indexOf(iField<0)) {
          indexList.push(iField);
          mData[iField] = [onedata.id];                   //分类ID数组增加对应ID
          iSum[iField] = onedata.get(sumField);
        } else {
          iSum[iField] += onedata.get(sumField);
          mData[iField].push(onedata.id);
        };
        mChecked[onedata.id] = true;
      });
      resolve({indexList:indexList,pageData:aData,quantity:iSum,mCheck:mChecked}) ;
    }).catch( error=> {reject(error)} );
  },

  binddata: (subscription, initialStats, onChange) => {
    let stats = [...initialStats]
    const remove = value => {
      stats = stats.filter(target => {return target.id !== value.id})
      return onChange(stats)
    }
    const upsert = value => {
      let existed = false;
      stats = stats.map(target => (target.id === value.id ? ((existed = true), value) : target))
      if (!existed) stats = [value, ...stats]
      return onChange(stats)
    }
    subscription.on('create', upsert)
    subscription.on('update', upsert)
    subscription.on('enter', upsert)
    subscription.on('leave', remove)
    subscription.on('delete', remove)
    return () => {
    subscription.off('create', upsert)
    subscription.off('update', upsert)
    subscription.off('enter', upsert)
    subscription.off('leave', remove)
    subscription.off('delete', remove)
    }
  },

  indexClick: function(e){                           //选择打开的索引数组本身id
    this.setData({ iClicked: e.currentTarget.id });
  },

  mClick: function (e) {                      //点击mClick
    let pSet = {};
    pSet['mChecked['+e.currentTarget.id+']'] = !this.data.mClicked[e.currentTarget.id];
    this.setData(pSet)
  },

  formatTime: function(date,isDay) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (isDay){
      return [year, month, day].map(formatNumber).join('/')
    } else {
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds();
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
  }
}
