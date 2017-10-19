const AV = require('./leancloud-storage.js');
var app = getApp();
const nt = ['-1','-2','-6'];
const mdt = ['-2', '-3', '-4', '-6']
const mdtn = ['pic','thumb','vidio','file']
const vdSet=function(sname,sVal){
  let reqset = {};
  reqset['vData.'+sname] = sVal;
  return reqset;
};
const rdSet=function(n,rdg,rdn){
  let reqdataset = {};
  reqdataset['reqData[' + n + '].'+rdg] = rdn;
  return reqdataset;
};
const mgrids = ['产品', '图像', '音频', '视频', '位置', '文件', '大标题', '中标题', '小标题', '正文'];
const mid = ['-1', '-2', '-3', '-4', '-5', '-6', 'h2', 'h3', 'h4', 'p'];
function getdate(date){
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return year+'-'+( month<10 ? '0'+month : month)+'-'+( day<10 ? '0'+day : day)
}
function sFilePath(reqData,vData){
  let filePaths = [];
  reqData.forEach(nField => {
    switch (nField.t) {
      case 'eDetail' :
        for (let a = 0; a < vData[nField.gname].length; a++) {
          if (mdt.indexOf(vData[nField.gname][a].t) >= 0 && vData[nField.gname][a].c.substring(0, 4) != 'http') {     //该字段为媒体且不是网络文件
            sFileArr.push({ na: [nField.gname, a], fPath: vData[nField.gname][a].c });
          }
        }
        break;
      case 'pics' :
        for (let b = 0; b < vData[nField.gname].c.length; b++) {
          if (vData[nField.gname][b].c.substring(0, 4) != 'http') {
            sFileArr.push({ na: [nField.gname, a], fPath: vData[nField.gname][a].c });
          }
        }
        break;
      default :
        if (mdtn.indexOf(nField.t) >= 0 && vData[nField.gname].substring(0, 4) != 'http') {     //该字段为媒体且不是网络文件
          sFileArr.push({ na: [nField.gname, -1], fPath: vData[nField.gname] });
        }
        break;
    }
  })
  return filePaths;
}
module.exports = {
  initData: function(that,reqFormat,aaData){
    let vifData = typeof aaData == 'undefined';
    let vData = vifData ? {} : aaData;
    var lName='0';
    for (let i=0;i<reqFormat.length;i++){
      switch (reqFormat[i].t){
        case 'chooseAd' :
          if (vifData) { lName=reqFormat[i].gname };          //地理位置字段
          break;
        case 'eDetail' :
          if (vifData) {                      //详情字段
            vData[reqFormat[i].gname]=[                     //内容部分定义：t为类型,e为文字或说明,c为媒体文件地址或内容
              { t: "h2", e: "大标题"},
              { t: "p" ,e: "正文简介"},
              { t: "h3", e: "中标题" },
              { t: "p", e: "正文" },
              { t: "h4", e: "1、小标题" },
              { t: "p", e: "图片文章混排说明" },
              { t: "-2", c: '/images/2.png', e: "图片内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", e: "2、小标题" },
              { t: "p", e: "音频文章混排" },
              { t: "-3", c: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46", e: "录音内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", p: "3、小标题" },
              { t: "p", p: "视频文章混排" },
              { t: "-4", c: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400", e: "视频内容说明" },
              { t: "p", e: "正文" },
              { t: "p", e: "章节结尾" },
              { t: "p", e: "文章结尾" }
            ]
          };
          break;
        case 'sproduct' :                    //产品选择字段
          reqFormat[i].mD = app.mData.prdct3;
          reqFormat[i].ad = app.aData[3];
          break;
        case 'producttype' :
          if (! vifData) { reqFormat[i].apdclist = app.uUnit.indType; }
          break;
        case 'sedate' :
          reqFormat[i].sDate = getdate(new Date());
          vData[reqFormat[i].gname] = [getdate(new Date()), getdate(new Date() + 86400000)]
          break;
      }
    };
    if (lName!='0'){
      return new Promise((resolve,reject)=>{
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userLocation']) {                   //用户已经同意小程序使用用户地理位置
              resolve(true)
            } else {
              wx.authorize({scope: 'scope.userLocation',
                success() { resolve(true) },
                fail() {
                  wx.showToast({ title: '请授权使用位置信息，否则本模块无法使用！', duration: 2500, icon: 'loading' });
                  setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
                  reject(); }
              })
            };
          }
        })
      }).then((vifAuth)=>{
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            vData[lName]  = new AV.GeoPoint(res.latitude,res.longitude);
            that.setData({ reqData: reqFormat, vData: vData });
          }
        })
      }).catch(console.error)
    } else {
      that.setData({ reqData: reqFormat, vData: vData });
    }
  },

  tabClick: function (e) {                                //点击tab
    app.mData[pCk+this.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData[pCk+this.data.pNo]                //点击序号切换
    });
  },

  i_industrytype: function (e) {                         //选择行业类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0,2);
    switch (id) {
      case 'se' :                                   //按放大镜ICON打开选择框
        that.setData( rdSet(n, 'inclose', ! that.data.reqData[n].inclose) );
        break;
      case 'su' :                                   //按确定ICON确认选择
        let apdv = that.data.reqData[n].apdvalue;
        that.data.vData[that.data.reqData[n].gname].push(that.data.reqData[n].apdclist[apdv[0]].st[apdv[1]].ct[apdv[2]]);
        that.setData( vdSet(that.data.reqData[n].gname,that.data.vData[that.data.reqData[n].gname]) )
        break;
      case 'pa' :
        let val = e.detail.value;
        if (that.data.reqData[n].apdvalue[0] == val[0]) {
          if (that.data.reqData[n].apdvalue[1] != val[1]) { val[2] = 0 }
        } else { val[1] = 0; val[2] = 0 }
        that.setData( rdSet(n, 'apdvalue', val) );
        break;
      case 'lj' :                                   //按显示类型名称进行删除
        let i = Number(e.currentTarget.dataset.id);
        that.data.vData[that.data.reqData[n].gname].splice(i,1);
        that.setData( vdSet(that.data.reqData[n].gname,that.data.vData[that.data.reqData[n].gname]) )
        break;
    }
  },

  i_assettype: function(e) {                         //选择固定资产类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0,2);
    switch (id) {
      case 'ac' :
        that.setData( rdSet(n, 'inclose', ! that.data.reqData[n].inclose) );
        that.setData( vdSet(that.data.reqData[n].gname,'') );
        break;
      case 'pa' :
        let aval = e.detail.value;
        if (that.data.reqData[n].ascvalue[0] == aval[0]) {
          if (that.data.reqData[n].ascvalue[1] != aval[1]){ aval[2] = 0 ; }
        } else { aval[1] = 0 ; aval[2] = 0 ; }
        that.setData(rdSet(n, 'ascvalue',aval));
        break;
    }
  },

  i_producttype: function(e) {                         //选择产品类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0,2);
    switch (id) {
      case 'ac' :
        that.setData( rdSet(n, 'inclose', ! that.data.reqData[n].inclose) );
        that.setData( vdSet(that.data.reqData[n].gname,'') )
        break;
      case 'pa' :
        let aval = e.detail.value;
        if (that.data.reqData[n].pdva[0] == aval[0]) {
          if (that.data.reqData[n].pdva[1] != aval[1]){ aval[2] = 0 ; }
        } else { aval[1] = 0 ; aval[2] = 0 ; }
        that.setData(rdSet(n, 'pdva',aval));
        break;
    }
  },

  i_sedate: function(e) {                         //选择开始和结束日期
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0,2);
    let rSet = {};
    switch (id) {
      case 'ac' :
        rSet = vdSet(that.data.reqData[n].gname, e.currentTarget.dataset.ei ? [that.data.vData[that.data.reqData[n].gname][0],e.detail.value]
                                                      : [e.detail.value, that.data.vData[that.data.reqData[n].gname][1]] );
        rSet['reqData['+n+'].inclose'] = true;
        break;
      case 'ds' :                             //选择开始日期
        rSet['reqData['+n+'].inclose'] = false;
        rSet['reqData['+n+'].endif'] = false;
        break;
      case 'de' :                           //选择结束日期
        rSet['reqData['+n+'].inclose'] = false;
        rSet['reqData['+n+'].endif'] = true;
        break;
    }
    that.setData( rSet );
  },

  i_thumb: function(e) {                         //编辑缩略图
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 1,                                     // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
      success: function (restem) {                     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData( vdSet(that.data.reqData[n].gname,restem.tempFilePaths[0]) );
        wx.navigateTo({ url: '/util/ceimage/ceimage?reqName='+that.data.reqData[n].gname })
      },
      fail: function () { wx.showToast({ title: '选取照片失败！' }) }
    })
  },

  i_pics: function(e) {                         //选择图片组
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 9,                                     // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
      success: function (restem) {                     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tfPaths = restem.tempFilePaths.map( tfPath=>{ return {c:tfPath}})
        that.setData( vdSet(that.data.reqData[n].gname,tfPaths) );
      },
      fail: function () { wx.showToast({ title: '选取照片失败！' }) }
    })
  },

 	i_pic: function(e) {                         //上传申请人持身份证照片,单位组织机构代码证或个人身份证背面
 		var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
 		wx.chooseImage({
 		  count: 1,
 		  sizeType: ['original', 'compressed'],
 		  sourceType: ['camera'],                      //用户拍摄
 		  success: function(res) {
 				new AV.File('file-name', {	blob: {	uri: res.tempFilePaths[0], },
 				}).save().then(	file => {
 					that.setData(vdSet(that.data.reqData[n].gname,file.url()));
 				}).catch(console.error);
 			}
 		});
   },

  i_chooseAd: function(e) {                         //选择地理位置
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseLocation({
      success: function (res) {
        that.setData({ 'vData.aGeoPoint':new AV.GeoPoint({ latitude: res.latitude, longitude: res.longitude}) });
        if (that.data.vData[that.data.reqData[n+1].gname]=='') { that.setData(vdSet(that.data.reqData[n+1].gname,res.address)) }
      }
    })
  },

  i_vidio: function (e) {                         //选择视频文件
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData(vdSet(that.data.reqData[n].gname, res.tempFilePaths[0]));
      },
      fail: function () { wx.showToast({ title: '选取视频失败！' }) }
    })
  },

  i_sproduct: function (e) {                         //选择产品服务
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'ac':
        that.setData(rdSet(n, 'inclose', !that.data.reqData[n].inclose));
        that.setData( vdSet(that.data.reqData[n].gname,'') );
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.reqData[n].provalue[0] != aval[0]) {
          aval[1] = 0; }
        that.setData(rdSet(n, 'provalue', aval));
        break;
    }
  },

  i_eDetail: function(e){                                 //内容可以插入和删除
    var that = this;
    that.setData({ selectd: parseInt(e.currentTarget.id.substring(3)),      //选择文章内容的数组下标
                  enMenu: 'inline-block' })
  },

  i_insdata: function (e) {                          //插入数据
    this.farrData(e.currentTarget.id, 0);      //选择的菜单id;
  },

  farrData: function (sIndex, instif) {                          //详情插入或替换数据
    var that = this;
    var artArray = that.data.vData.details;       //详情的内容
    return new Promise( (resolve, reject) =>{
      switch (sIndex){
        case '-1':             //选择产品
          resolve('选择商品');
          break;
        case '-2':               //选择相册图片或拍照
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
            success: function (res) { resolve(res.tempFilePaths[0]); },
            fail: function(err){ reject(err) }
          });
          break;
        case '-3':               //录音
          wx.startRecord({
            success: function (res) {
              wx.saveFile({
                tempFilePath : res.tempFilePath,
                success: function(cres){ resolve(cres.savedFilePath); },
                fail: function(cerr) { reject('录音文件保存错误！') }
              });
            },
            fail: function(err){ reject(err) }
          });
          break;
        case '-4':               //选择视频或拍摄
          wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) {
              wx.saveFile({
                tempFilePath : res.tempFilePath,
                success: function(cres){ resolve(cres.savedFilePath); },
                fail: function(cerr){ reject('视频文件保存错误！') }
              });
            },
            fail: function(err){ reject(err) }
          })
          break;
        case '-5':                    //选择位置
          wx.chooseLocation({
            success: function(res){ resolve( { latitude: res.latitude, longitude: res.longitude } ); },
            fail: function(err){ reject(err) }
          })
          break;
        case '-6':                     //选择文件
          resolve('选择文件');
          break;
        default:
          resolve(false);
      }
    }).then( (content) =>{
      let sI = mid.indexOf(sIndex);
      if (content){
        artArray.splice( that.data.selectd,instif,{t: sIndex, e: '点击此处输入'+mgrids[sI]+'的说明', c: content} );
      }else {
        artArray.splice( that.data.selectd,instif,{t: sIndex, e: mgrids[sI]} );
      };
      that.setData({'vData.details': artArray, enIns: true});
      if (nt.indexOf(sIndex)>=0){
        let nts;
        switch (sIndex){
          case '-1':
            nts = '/util/productsct/productsct';
            break;
          case '-2':
            nts = '/util/ceimage/ceimage';
            break;
          case '-6':
            nts = '/util/filesct/filesct';
            break;
          default: break;
        }
        wx.navigateTo({ url: nts+'?reqName="details"' })
      }
    }).catch(console.error);
  },

  fSubmit: function (e) {
    var that = this;
    let approvalID = parseInt(that.data.pNo);        //流程序号
    var approvalClass = require('./procedureclass.js')[approvalID];       //流程定义和数据结构
    var subData = e.detail.value;
    if (that.data.vData.details.length>0){
      for (let i = 0; i < that.data.vData.details.length; i++) {
        that.data.vData.details[i].e = subData['ade' + i];
        that.data.vData.details[i].c = subData['adc' + i];
      };
    };
    var emptyField = '';
    var evField = {};                   //检查处理每个请求字段
    for (let i=0;i<approvalClass.pSuccess.length;i++){
      if (approvalClass.pSuccess[i].gname in subData ) {
        if (subData[approvalClass.pSuccess[i].gname]) {
          that.data.vData[approvalClass.pSuccess[i].gname] = subData[approvalClass.pSuccess[i].gname];
        } else { emptyField += '《'+approvalClass.pSuccess[i].p+'》'; }
      }
    };
    switch (e.detail.target.id) {
      case 'fdeldata':                                 //删除内容部分选中的字段
        if (that.data.selectd >= 0) {                         //内容部分容许删除
          that.data.vData.details.splice(that.data.selectd, 1);
          that.setData({ 'vData.details':that.data.vData.details, enMenu: 'none' });
        } else { wx.showToast({ title: '此处禁止删除！' }) }
        break;
      case 'fenins':                   //允许显示插入菜单
        that.setData({ enMenu: 'none', enIns: false })      //‘插入、删除、替换’菜单栏关闭
        break;
      case 'fupdate':                          //替换数据
        that.setData({ enMenu: 'none' })
        that.farrData(that.data.vData.details[that.data.selectd].t, 1);      //选择多媒体项目内容;
        break;
      case 'fStorage':
        if (that.data.targetId=='0') {           //编辑内容不提交流程审批,在本机保存
          let tFileArr = sFilePath(that.data.reqData,that.data.vData);
          if (tFileArr.length > 0) {
            let sFileArr = tFileArr.map( tFileStr => {
              return new Promise((resolve, reject) => {
                wx.getFileInfo({
                  filePath: tFileStr.fPath,
                  success:function(res1) {
                    if (res1.size==0) {
                      wx.saveFile({
                        tempFilePath: tFileStr.fPath,
                        success: function(res2) {
                          if (tFileStr.na[1] == -1) {
                            that.data.vData[tFileStr.na[0]] = res2.savedFilePath;
                          } else { that.data.vData[tFileStr.na[0]][tFileStr.na[1]].c = res2.savedFilePath; }
                          resolve(res2.savedFilePath)
                        }
                      })
                    } else { resolve(res1.filePath)}
                  }
                })
              })
            });
            Promise.all(sFileArr).then( ()=>{
              app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData;
            }).catch(console.error);
          } else { app.aData[that.data.pNo][that.data.dObjectId] = that.data.vData;}
        }
        break;
      case 'fSave' :
        if (emptyField) {
          wx.showToast({ title: emptyField+'等项目未输入，请检查。',duration: 7000 })
        } else {
          let sFileArr = sFilePath(that.data.reqData, that.data.vData);
          return new Promise((resolve, reject) => {
            if (sFileArr.length>0){
              sFileArr.map(sFileStr => () => new AV.File('filename', {blob: {uri: sFileStr.fPath,},}).save().then(sfile =>{
                wx.removeSavedFile({ filePath: sFileStr.fPath })      //删除本机保存的文件
                if (sFileStr.na[1]==-1) { that.data.vData[sFileStr.na[0]]= sfile.url();
                } else { that.data.vData[sFileStr.na[0]][sFileStr.na[1]].c= sfile.url(); }
              })
              ).reduce(
                (m, p) => m.then(v => AV.Promise.all([...v, p()])),
                AV.Promise.resolve([])
              ).then(files => { resolve(files) } ).catch(console.error)
            } else { resole([]) };
          }).then( (sFiles) => {
            if (that.data.targetId=='0'){
              let nApproval = AV.Object.extend('sengpi');        //创建审批流程
              var fcApproval = new nApproval();
              fcApproval.set('dProcedure', approvalID);                //流程类型
              fcApproval.set('dResult', 0);                //流程处理结果0为提交
              fcApproval.set("unitName", app.uUnit.uName);                 //申请单位
              fcApproval.set("sponsorName", app.globalData.user.uName);         //申请人
              fcApproval.set("unitId", app.uUnit.objectId);        //申请单位的ID
              fcApproval.set('dIdear', [{un:app.globalData.user.uName,dt:new Date(),di:'提交流程',dIdear:'发起审批流程'}]);       //流程处理意见
              let managers = [[app.globalData.user.objectId]];
              let cUserName = {};
              cUserName[app.globalData.user.objectId] = app.globalData.user.uName;
              let puRoles = approvalClass.puRoles;
              let suRoles = approvalClass.suRoles;
              if (app.uUnit.unitType>1 && puRoles) {          //单位类型为企业且有本单位审批设置
                let pRolesNum = 0, pRoleUser;
                for (let i=0;i<puRoles.length;i++){
                  pRoleUser = [];
                  app.uUnit.unitUsers.forEach((pUser) => {
                    if (pUser.userRolName == puRoles[i]){
                      pRoleUser.push(pUser.objectId);
                      cUserName[pUser.objectId] = pUser.uName;
                    }
                  })
                  if (pRoleUser.length!=0) {
                    pRolesNum=pRolesNum+1;
                    managers.push(pRoleUser);
                  }
                };
                if (pRolesNum==0 && app.globalData.user.userRolName!='admin') {
                  app.uUnit.unitUsers.forEach((pUser) => {
                    if (pUser.userRolName == 'admin') {
                      managers.push([pUser.objectId]);
                      cUserName[pUser.objectId] = pUser.uName;
                    }
                  })
                }
              }
              if (suRoles) {                 //上级单位类型有审批设置
                let sRolesNum = 0, sRoleUser;
                if (!app.sUnit.unitType){     //单位类型为企业
                  for (let i = 0; i < suRoles.length; i++){
                    sRoleUser = [];
                    app.sUnit.unitUsers.forEach((sUser) => {
                      if (sUser.userRolName == suRoles[i]) {
                        sRoleUser.push(sUser.objectId);
                        cUserName[sUser.objectId] = sUser.uName;
                      }
                    });
                    if (sRoleUser.length != 0) {
                      sRolesNum=sRolesNum+1;
                      managers.push(sRoleUser);
                    }
                  }
                }
                if (sRolesNum==0) {
                  app.sUnit.unitUsers.forEach((sUser) => {
                    if (sUser.userRolName == 'admin') {
                      managers.push([sUser.objectId]);
                      cUserName[sUser.objectId] = sUser.uName;
                    }
                  })
                }
              }
              fcApproval.set('cManagers', managers);             //处理人数组
              fcApproval.set('cUserName', cUserName);             //处理人姓名JSON
              fcApproval.set('cInstance',1);             //下一处理节点
              fcApproval.set('cFlowStep', managers[1]);              //下一流程审批人
              fcApproval.set('dObject', that.data.vData);            //流程审批内容
              var acl = new AV.ACL();      // 新建一个 ACL 实例
              acl.setRoleReadAccess(app.uUnit.objectId,true);
              acl.setRoleReadAccess(app.sUnit.objectId, true);
              managers.forEach((manger) => { manger.forEach((mUser) => {acl.setWriteAccess(mUser, true);}) })
              fcApproval.setACL(acl);         // 将 ACL 实例赋予fcApproval对象
              fcApproval.save().then((resTarget) => {
                app.aData[resTarget.objectId] = fcApproval.toJSON();
                wx.showToast({title: '流程已提交,请查询审批结果。',duration:2000}) // 保存成功
              })
            } else {
              app.aData[that.data.targetId].dObject = that.data.vData;
            }
            wx.navigateBack({delta:1});
          }).catch( console.error );
        }
      break;
    };
  }

}
