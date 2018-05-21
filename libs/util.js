const AV = require('leancloud-storage.js');
const wxappNumber = 2;    //本小程序在开放平台中自定义的序号
const menuKeys=['manage', 'marketing', 'customer'];
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
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
function openWxLogin(roleData) {            //注册登录（本机登录状态）
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: ({authSetting})=> {
        if (authSetting['scope.userInfo']) {
          wx.login({
            success: function (wxlogined) {
              if (wxlogined.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (wxuserinfo) {
                    if (wxuserinfo) {
                      AV.Cloud.run('wxLogin' + wxappNumber, { code: wxlogined.code, encryptedData: wxuserinfo.encryptedData, iv: wxuserinfo.iv }).then(function (wxuid) {
                        let signuser = {};
                        signuser['uid'+ wxappNumber] = wxuid.oId;
                        AV.User.loginWithAuthDataAndUnionId(signuser,'weapp_union', wxuid.uId, {
                          unionIdPlatform: 'weixin', // 指定为 weixin 即可通过 unionid 与其他 weixin 平台的帐号打通
                          asMainAccount: true,
                        }).then((statuswx) => {    //用户在云端注册登录
                          if (statuswx.createdAt != statuswx.updatedAt) {
                            roleData.user = statuswx.toJSON();
                            resolve(roleData);                        //客户已注册在本机初次登录成功
                          } else {                         //客户在本机授权登录则保存信息
                            let newUser = wxuserinfo.userInfo;
                            newUser['wxapp' + wxappNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                            statuswx.set(newUser).save().then((wxuser) => {
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
        } else { reject({ ec: 4, ee: '微信用户未授权！' }) };
      },
      fail: function (err) {
        reject({ ec: 5, ee: err.errMsg }); }     //获取微信用户权限失败
    })
  });
};

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

module.exports = {
  openWxLogin: openWxLogin,
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
          wx.getSetting({
            success:(res)=> {
              if (res.authSetting['scope.userInfo']) {        //用户已经同意小程序使用用户信息
                openWxLogin(roleData).then(rlgData => {
                  resolve(true);
                }).catch((loginErr) => { resolve(false) });  //系统登录失败
              } else { resolve(false) }
            },
            fail: ()=>{resolve(false)}
          })
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

  hTabClick: function (e) {                                //点击头部tab
    this.setData({
      "ht.pageCk": Number(e.currentTarget.id)
    });
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

  indexRecordFamily: function(requery,indexField,aFamilyLength) {             //按索引字段和类型整理已读数据
    return new Promise((resolve, reject) => {
      let aData = {}, indexList = new Array(aFamilyLength), aPlace = -1, iField, aFamily, fieldFamily, mData = {};
      indexList.fill([]);
      requery.forEach(onedata => {
        aData[onedata.id] = onedata;
        iField = onedata.get(indexField);                  //索引字段读数据数
        aFamily = onedata.get('afamily');
        fieldFamily = iField+''+aFamily;
        if (indexList[aFamily].indexOf(iField)<0) {
          indexList[aFamily].push(iField);
          mData[fieldFamily] = {
            uName:onedata.get('uName'),
            indexFieldId:[onedata.id]
          };                   //分类ID数组增加对应ID
        } else {
          mData[fieldFamily].indexFieldId.push(onedata.id);
        };
      });
      let cPage = indexList.map((tId,family)=>{
        return tId.map(fi=>{
          return {indexId:fi,...mData[fi+family],iCount:mData[fi+family].indexFieldId.length}
        })
      })
      resolve({indexList,aData}) ;
    }).catch( error=> {reject(error)} );
  },

  fetchRecord: function(requery,indexField,sumField) {                     //同步云端数据到本机
    return new Promise((resolve, reject) => {
      let aData = {}, mData = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {};
      requery.forEach(onedata => {
        aData[onedata.id] = onedata;
        iField = onedata.get(indexField);                  //索引字段读数据数
        if (indexList.indexOf(iField)<0) {
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
    this.setData({ idClicked: e.currentTarget.id });
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
  },

  i_msgEditSend:function(e){            //消息编辑发送框
    var that = this;
    switch (e.currentTarget.id) {
      case 'sendMsg':
        app.sendM(e.detail.value,that.data.cId).then( (rsm)=>{
          if (rsm){
            that.setData({
              vData: {mtype:-1,mtext:'',wcontent},
              messages: app.conMsg[that.data.cId]
            })
          }
        });
        break;
      case 'fMultimedia':
        that.setData({enMultimedia: !that.data.enMultimedia});
        break;
      case 'iMultimedia':
        var sIndex = parseInt(e.currentTarget.dataset.n);      //选择的菜单id;
        return new Promise( (resolve, reject) =>{
          let showPage = {};
          switch (sIndex){
            case 1:             //选择产品
              if (!that.f_modalSelectPanel) {that.f_modalSelectPanel = require('../../model/controlModal').f_modalSelectPanel}
              showPage.pageData = app.aData.goods;
              showPage.tPage = app.mData.goods;
              showPage.idClicked = '0';
              that.data.sPages.push({ pageName: 'modalSelectPanel', pNo: 'goods', gname:'wcontent',p:'产品' });
              showPage.sPages = that.data.sPages;
              that.setData(showPage);
              popModal(that);
              resolve(true);
              break;
            case 2:               //选择相册图片或拍照
              wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
                success: function (res) { resolve(res.tempFilePaths[0]) },               //返回选定照片的本地文件路径列表
                fail: function(err){ reject(err) }
              });
              break;
            case 3:               //录音
              wx.startRecord({
                success: function (res) { resolve( res.tempFilePath ); },
                fail: function(err){ reject(err) }
              });
              break;
            case 4:               //选择视频或拍摄
              wx.chooseVideo({
                sourceType: ['album','camera'],
                maxDuration: 60,
                camera: ['front','back'],
                success: function(res) { resolve( res.tempFilePath ); },
                fail: function(err){ reject(err) }
              })
              break;
            case 5:                    //选择位置
              wx.chooseLocation({
                success: function(res){ resolve( { latitude: res.latitude, longitude: res.longitude } ); },
                fail: function(err){ reject(err) }
              })
              break;
            case 6:                     //选择文件
              if (!that.f_modalSelectFile) { that.f_modalSelectFile = require('../../model/controlModal').f_modalSelectFile };
              wx.getSavedFileList({
                success: function(res) {
                  let index,filetype,fileData={},cOpenFile=['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];
                  var sFiles=res.fileList.map(({filePath,createTime,size})=>{
                    index = filePath.indexOf(".");                   //得到"."在第几位
                    filetype = filePath.substring(index+1);          //得到后缀
                    if ( cOpenFile.indexOf(filetype)>=0 ){
                      fileData[filePath] = {"fType":filetype,"cTime":formatTime(createTime,false),"fLen":size/1024};
                      return (fileList.filePath);
                    }
                  })
                  showPage.pageData = fileData;
                  showPage.tPage = sFiles;
                  showPage.idClicked = '0';
                  that.data.sPages.push({ pageName: 'modalSelectFile', pNo: 'files', gname:'wcontent',p:'文件' });
                  showPage.sPages = that.data.sPages;
                  that.setData(showPage);
                  popModal(that);
                  resolve(true);
                }
              })
              break;
            default:
              resolve('输入文字');
              break;
          }
        }).then( (wcontent)=>{
          return new Promise( (resolve, reject) => {
            if (sIndex>1 && sIndex<5){
              wx.saveFile({
                tempFilePath : icontent,
                success: function(cres){ resolve(cres.savedFilePath); },
                fail: function(cerr){ reject('媒体文件保存错误！') }
              });
            }else{
              resolve(wcontent);
            };
          });
        }).then( (content) =>{
          that.setData({ mtype: -sIndex ,wcontent: content });
        }).catch((error)=>{console.log(error)});
      break;
    default:
      break;
    }
  }
}
