const AV = require('../libs/leancloud-storage.js');
var app = getApp();
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
function exitPage(){
  wx.showToast({ title: '权限不足请检查', duration: 2500 });
  setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
};
module.exports = {
  openWxLogin: function() {            //注册登录
    return new Promise((resolve, reject) => {
      wx.login({
        success: function(wxlogined) {
          if ( wxlogined.code ) {
            wx.getUserInfo({ withCredentials: true,
            success: function(wxuserinfo) {
              if (wxuserinfo) {
                AV.Cloud.run( 'wxLogin0',{ code:wxlogined.code, encryptedData:wxuserinfo.encryptedData, iv:wxuserinfo.iv } ).then( function(wxuid){
                  let signuser = {};
                  signuser['uid'] = wxuid.uId;
                  AV.User.signUpOrlogInWithAuthData(signuser,'openWx').then((statuswx)=>{    //用户在云端注册登录
                    if (statuswx.country){
                      app.globalData.user = statuswx.toJSON();
                      resolve(1);                        //客户已注册在本机初次登录成功
                    } else {                         //客户在本机授权登录则保存信息
                      let newUser = wxuserinfo.userInfo;
                      newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                      statuswx.set(newUser).save().then( (wxuser)=>{
                        app.globalData.user = wxuser.toJSON();
                        resolve(0);                //客户在本机刚注册，无菜单权限
                      }).catch(err => { reject({ ec:0, ee:err}) });
                    }
                  }).catch((cerror)=> { reject( { ec: 2, ee: cerror }) });    //客户端登录失败
                }).catch((error)=>{ reject( {ec:1,ee:error} ) });       //云端登录失败
              }
            } })
          } else { reject( {ec:3,ee:'微信用户登录返回code失败！'} )};
        },
        fail: function(err) { reject( {ec:4,ee:err.errMsg} ); }     //微信用户登录失败
      })
    });
  },

  fetchMenu: function(){
    return new Promise((resolve, reject) => {
      if (app.globalData.user.mobilePhoneVerified) {
        return new AV.Query('userInit')
          .notEqualTo('updatedAt',new Date(app.roleData.wmenu.updatedAt))
          .select(['manage', 'plan', 'production', 'customer'])
          .equalTo('objectId',app.globalData.user.userRol.objectId).find().then( fetchMenu =>{
          if (fetchMenu.length>0) {                          //菜单在云端有变化
            app.roleData.wmenu = fetchMenu[0].toJSON();
            ['manage', 'marketing', 'customer'].forEach(mname => {
              app.roleData.wmenu[mname] = app.roleData.wmenu[mname].filter(rn=>{return rn!=0});
            });
            app.roleData.iMenu = require('../libs/allmenu.js').iMenu(app.roleData.wmenu);
            app.roleData.iMenu.manage[0].mIcon = app.globalData.user.avatarUrl;     //把微信头像地址存入第一个菜单icon
            wx.setStorage({ key: 'roleData', data: app.roleData });
          };
          return wx.getUserInfo({        //检查客户信息
            withCredentials: false,
            success: function ({ userInfo }) {
              if (userInfo) {
                let updateInfo = false;
                for (var iKey in userInfo){
                  if (userInfo[iKey] != app.globalData.user[iKey]) {             //客户信息有变化
                    updateInfo = true;
                    app.globalData.user[iKey] = userInfo[iKey];
                    app.roleData.iMenu.manage[0].mIcon=app.globalData.user.avatarUrl;
                  }
                };
                if (updateInfo){
                  AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
                    rLoginUser.set(userInfo).save();
                  })
                }
              }
            }
          });
        })
      } else {
        app.roleData.iMenu = require('../libs/allmenu.js').iMenu(app.roleData.wmenu);
      };
    }).then(()=>{
      if (app.globalData.user.unit != '0') {
        return new AV.Query('_Role')
        .notEqualTo('updatedAt', new Date(app.roleData.uUnit.updatedAt))
        .equalTo('objectId',app.globalData.user.unit).first().then( uRole =>{
          if (uRole) {                          //本单位信息在云端有变化
            app.roleData.uUnit = uRole.toJSON();
          }
          if (app.roleData.uUnit.sUnit != '0'){
            return new AV.Query('_Role')
            .notEqualTo('updatedAt', new Date(app.roleData.sUnit.updatedAt))
            .equalTo('objectId',app.roleData.uUnit.sUnit).first().then( sRole => {
              if (sRole) {
                app.roleData.sUnit = sRole.toJSON();
                wx.setStorage({ key: 'roleData', data: app.roleData });
              };
            }).catch(console.error)
          }
          wx.setStorage({ key: 'roleData', data: app.roleData });
        }).catch(console.error)
      };
      app.imLogin(app.globalData.user.username);
    }).catch(error=> {return error} );
  },

  userInfoHandler: function (e) {
    var that = this;
    openWxLogin(that.data.userAuthorize).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo.toString()]);                      //用户授权时间记入日志
    }).catch( console.error );
  },

  checkRols: function(ouRole){
    if (app.globalData.user.userRolName=='admin' && app.globalData.user.emailVerified){
      return true;
    } else {
      let roleLine = parseInt(substring(app.globalData.user.userRolName,1,1));
      if (roleLine==ouRole && app.globalData.user.emailVerified) {
        return true;
      } else {
        exitPage();
        return false
      }
    }
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

  tabClick: function (e) {                                //点击tab
    app.mData['pCk'+this.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData['pCk'+this.data.pNo]               //点击序号切换
    });
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
