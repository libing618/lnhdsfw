const AV = require('../libs/leancloud-storage.js');
const wxappNumber = 2;    //本小程序在开放平台中自定义的序号
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
function exitPage(){
  wx.showToast({ title: '权限不足请检查', duration: 2500 });
  setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
};
function openWxLogin(app) {            //注册登录（本机登录状态）
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (wxlogined) {
        if (wxlogined.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (wxuserinfo) {
              if (wxuserinfo) {
                AV.Cloud.run('wxLogin0', { code: wxlogined.code, encryptedData: wxuserinfo.encryptedData, iv: wxuserinfo.iv }).then(function (wxuid) {
                  let signuser = {};
                  signuser['uid'] = wxuid.uId;
                  AV.User.signUpOrlogInWithAuthData(signuser, 'openWx').then((statuswx) => {    //用户在云端注册登录
                    if (statuswx.country) {
                      app.globalData.user = statuswx.toJSON();
                      resolve(1);                        //客户已注册在本机初次登录成功
                    } else {                         //客户在本机授权登录则保存信息
                      let newUser = wxuserinfo.userInfo;
                      newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                      statuswx.set(newUser).save().then((wxuser) => {
                        app.globalData.user = wxuser.toJSON();
                        resolve(0);                //客户在本机刚注册，无菜单权限
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

function fetchMenu(app) {
  return new Promise((resolve, reject) => {
    if (app.globalData.user.mobilePhoneVerified) {
      return new AV.Query('userInit')
        .notEqualTo('updatedAt', new Date(app.roleData.wmenu.updatedAt))
        .select(['manage', 'marketing', 'customer'])
        .equalTo('objectId', app.globalData.user.userRol.objectId).find().then(fetchMenu => {
          if (fetchMenu.length > 0) {                          //菜单在云端有变化
            app.roleData.wmenu = fetchMenu[0].toJSON();
            ['manage', 'marketing', 'customer'].forEach(mname => {
              app.roleData.wmenu[mname] = app.roleData.wmenu[mname].filter(rn => { return rn != 0 });
            });
            resolve(true);
          } else {
            resolve(false);
          };
        })
    } else {
      resolve(false);
    };
  }).then(updateMenu => {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({        //检查客户信息
        withCredentials: false,
        success: function ({ userInfo }) {
          if (userInfo) {
            let updateInfo = false;
            for (var iKey in userInfo) {
              if (userInfo[iKey] != app.globalData.user[iKey]) {             //客户信息有变化
                updateInfo = true;
                app.globalData.user[iKey] = userInfo[iKey];
              }
            };
            if (updateInfo) {
              AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
                rLoginUser.set(userInfo).save().then(() => { resolve(true) });
              })
            } else {
              resolve(updateMenu);
            };
          }
        }
      });
    });
  }).then(uMenu => {
    if (app.globalData.user.unit != '0') {
      return new AV.Query('_Role')
        .notEqualTo('updatedAt', new Date(app.roleData.uUnit.updatedAt))
        .equalTo('objectId', app.globalData.user.unit).first().then(uRole => {
          if (uRole) {                          //本单位信息在云端有变化
            app.roleData.uUnit = uRole.toJSON();
          };
          if (app.roleData.uUnit.sUnit != '0') {
            return new AV.Query('_Role')
              .notEqualTo('updatedAt', new Date(app.roleData.sUnit.updatedAt))
              .equalTo('objectId', app.roleData.uUnit.sUnit).first().then(sRole => {
                if (sRole) {
                  app.roleData.sUnit = sRole.toJSON();
                };
              }).catch(console.error)
          }
        }).catch(console.error)
    };
    app.imLogin(app.globalData.user.username);
  }).catch(error => { return error });
};
function setTiringRoom(goTiringRoom){
  if (goTiringRoom) {
    wx.setTabBarItem({
      index: 1,
      text: "营销",
      iconPath: "images/icon_my.png",
      selectedIconPath: "images/icon_my_HL.png"
    });
    wx.setTabBarItem({
      index: 2,
      text: "客服",
      iconPath: "images/icon_component.png",
      selectedIconPath: "images/icon_component_HL.png"
    });
    wx.setTabBarItem({
      index: 3,
      text: "管理",
      iconPath: "images/icon_my.png",
      selectedIconPath: "images/icon_my_HL.png"
    });
  } else {
    wx.setTabBarItem({
      index: 1,
      text: "分类",
      iconPath: "images/icon_forum.png",
      selectedIconPath: "images/icon_forum_HL.png"
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
};
module.exports = {
  setTiringRoom:setTiringRoom,
  loginAndMenu: function(app) {
    return new Promise((resolve, reject) => {     //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
      if (app.globalData.user.objectId != '0') {
        fetchMenu(app).then(() => { resolve(true) });
      } else {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
              openWxLogin(app).then(() => {
                fetchMenu(app).then(() => { resolve(true) });
              }).catch((loginErr) => { reject('系统登录失败:' + loginErr.toString()) });
            } else {
              resolve(false)
            }
          }
        })
      }
    }).catch(lcuErr => {
      app.logData.push([Date.now(), lcuErr]);
    })
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

  initConfig: function(app) {
    return new Promise((resolve, reject) => {
      let initTime = new Date(0).toISOString();
      let proConfig = wx.getStorageSync('configData') || { articles: { cfield: 'afamily', fConfig: [0, 1, 3] }, goods: { updatedAt: initTime } };
      if (app.netState) {
        new AV.Query('shopConfig').find().then(dConfig => {
          let cData;
          dConfig.forEach(conData => {
            cData = conData.toJSON();
            app.configData[cData.cName] = { cfield: cData.cfield, fConfig: cData.fConfig, updatedAt: cData.updatedAt }
          });
          if (app.configData.goods.updatedAt != proConfig.goods.updatedAt) { app.mData.pAt.goods = [initTime, initTime] };   //店铺签约厂家有变化则重新读商品数据
          return new AV.Query('_User').select('goodsIndex').get(app.sjid);
        }).then(sjData => {
          if (sjData.get('goodsIndex')) { app.configData.goodsIndex = sjData.get('goodsIndex') };
          resolve(true)
        }).catch(console.error)
      } else {
        app.configData.goodsIndex = proConfig.goodsIndex;
        resolve(true)
      };
    })
  },

  readAllData: function (isDown, pNo,app) {    //更新页面显示数据,isDown下拉刷新,pNo类定义序号
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
