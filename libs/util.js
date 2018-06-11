const AV = require('leancloud-storage.js');
const wxappNumber = 2;    //本小程序在开放平台中自定义的序号
const { updateData,integration } = require('../model/initupdate');
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
module.exports = {
openWxLogin: function(roleData) {            //注册登录（本机登录状态）
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
                      AV.Cloud.run('wxLogin' + wxappNumber, { code: wxlogined.code, encryptedData: wxuserinfo.encryptedData, iv: wxuserinfo.iv }).then(wxuid=>{
                        AV.User.loginWithAuthDataAndUnionId(
                          { openid: wxuid.oId,access_token: wxuid.session, expires_in: wxappNumber},
                          'weixin', wxuid.uId,
                          { unionIdPlatform: 'weixin',asMainAccount: true}
                        ).then((statuswx) => {    //用户在云端注册登录
                          if (statuswx.nickName && statuswx['wxapp'+wxappNumber]) {
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
},
readShowFormat: function(req, vData) {
  var unitId = vData.unitId;
  return new Promise((resolve, reject) => {
    let promArr = [];                   //定义一个Promise数组
    let setPromise = new Set();
    var vFormat=req.map(reqField=>{
      switch (reqField.t) {
        case 'mapSelectUnit':
          reqField.e = app.roleData.sUnit.uName;
          break;
        case 'sObject':
          if (reqField.gname == 'goodstype') {
            reqField.slave = require('../libs/goodstype').slave[vData.goodstype];
          } else {
            promArr.push(integration('product', 'cargo', unitId));
          };
          break;
        case 'specsel':                    //规格选择字段
          promArr.push(integration('specs', 'cargo', unitId));
          break;
        case 'sId':
          setPromise.add(reqField.gname);
          break;
      };
      return reqField;
    })
    setPromise.forEach(nPromise=> {promArr.push(updateData(true, nPromise, unitId))})
    return Promise.all(promArr).then(()=>{
      vFormat.forEach((vF,i,vFormat)=> {
        switch (vF.t) {
          case 'sObject':                    //对象选择字段
            if (vF.gname != 'goodstype') {
              vFormat[i].slave = app.aData[vF.gname][vData[vF.gname]];
            };
            break;
          case 'specsel':                    //规格选择字段
            vFormat[i].master = {};
            vData.specs = app.mData.specs[unitId].filter(specsId=>{
              return app.aData.specs[specsId].goods=vData.objectId});
            vData.specs.forEach(specsId => {
              app.aData.specs[specsId].canSupply = parseInt(app.aData.cargo[app.aData.specs[specsId].cargo[0]].canSupply/app.aData.specs[specsId].package);
              vFormat[i].master[specsId] = app.aData.specs[specsId];
              vFormat[i].master[specsId].cargo = app.aData.cargo[app.aData.specs[specsId].cargo[0]];
            });
            if (vData[vF.gname]==0){
              vFormat[i].minPrice = 0;
              vFormat[i].maxPrice = 0;
            } else {

            }
            vFormat[i].droneId = vData.specs;
            break;
          case 'sId':
            vFormat[i].thumbnail = app.aData[vF.gname][vData[vF.gname]].thumbnail;
            vFormat[i].uName = app.aData[vF.gname][vData[vF.gname]].uName;
            vFormat[i].title = app.aData[vF.gname][vData[vF.gname]].title;
            break;
        }
      });
      resolve(vFormat);
    });
  }).catch(console.error);
},

hTabClick: function (e) {                                //点击头部tab
  this.setData({
    "ht.pageCk": Number(e.currentTarget.id)
  });
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
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}

}
