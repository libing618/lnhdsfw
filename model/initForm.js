const AV = require('../libs/leancloud-storage.js');
const { updateData } = require('initupdate');
var app = getApp()
module.exports = {
integration: function(pName, unitId) {           //整合选择数组
  return new Promise((resolve, reject) => {
    let selves = {};
    switch (pName) {
      case 'cargo':         //通过产品选择成品
        return Promise.all([updateData(true, 3, unitId), updateData(true, 5, unitId)]).then(([p3, p5]) => {
          app.mData.product[unitId].forEach(proId => {
            if (typeof app.aData.product[unitId][proId] !='undefined') { selves = app.aData.product[unitId][proId] };
            selves.cargo = app.mData.cargo[unitId].filter(cargoId => { return app.aData.cargo[unitId][cargoId].product == proId });
            app.aData.product[unitId][proId] = selves;
          })
          resolve(p3 || p5);
        }).catch(console.error);
        break;
      case 'specs':
        return Promise.all([updateData(true, 7, unitId), updateData(true, 6, unitId)]).then(([p7, p6]) => {           //通过规格选择成品
          app.mData.goods[unitId].forEach(goodsId => {
            if (typeof app.aData.goods[unitId][goodsId] != 'undefined') { selves = app.aData.goods[unitId][goodsId] };
            selves.specs = app.mData.specs[unitId].filter(specsId => { return app.aData.specs[unitId][specId].goods == goodsId });
            app.aData.goods[unitId][goodsId] = selves;
          })
          resolve(p7 || p6);
        }).catch(console.error);
        break;
    }
  }).catch(console.error);
},

readShowFormat: function(req, vData) {
  var unitId = vData.unitId ? vData.unitId : app.roleData.uUnit.objectId;
  return new Promise((resolve, reject) => {
    let setPromise = new Set();
    var reqData=req.map(reqField=>{
      switch (reqField.t) {
        case 'MS':
          reqField.e = app.roleData.sUnit.uName;
          break;
        case 'sObject':
          if (reqField.gname == 'goodstype') {
            reqField.slave = require('../libs/goodstype').slave[vData.goodstype];
          } else {setPromise.add(reqField.gname) };
          break;
        case 'specsel':                    //规格选择字段
          setPromise.add('specs');
          setPromise.add('cargo');
          break;
        case 'sId':
          setPromise.add(reqField.gname);
          break;
      };
      return reqField;
    })
    let promArr = [];                   //定义一个Promise数组
    setPromise.forEach(nPromise=> {promArr.push(updateData(true, nPromise, unitId))})
    return Promise.all(promArr).then(()=>{
      for (let i = 0; i < reqData.length; i++) {
        switch (reqData[i].t) {
          case 'sObject':                    //对象选择字段
            if (reqData[i].gname != 'goodstype') { reqData[i].slave = app.aData[reqData[i].gname][unitId][vData[reqData[i].gname]]; };
            break;
          case 'specsel':                    //规格选择字段
            reqData[i].master = {};
            reqData[i].slave = {};
            vData.specs.forEach(specsId => {
              reqData[i].master[specsId] = app.aData.specs[unitId][specsId];
              reqData[i].slave[specsId] = app.aData.cargo[unitId][app.aData.specs[unitId][specsId].cargo];
            });
            break;
          case 'sId':
            reqData[i].thumbnail = app.aData[reqData[i].gname][unitId][vData[reqData[i].gname]].thumbnail;
            reqData[i].uName = app.aData[reqData[i].gname][unitId][vData[reqData[i].gname]].uName;
            reqData[i].title = app.aData[reqData[i].gname][unitId][vData[reqData[i].gname]].title;
            break;
        }
      }
      resolve(reqData);
    });
  }).catch(console.error);
},

initData: function(req, vData) {      //对数据录入或编辑的格式数组和数据对象进行初始化操作
  let vDataKeys = Object.keys(vData);            //数据对象是否为空
  let vifData = (vDataKeys.length == 0);
  var funcArr = [];
  let unitId = vData.unitId ? vData.unitId : app.roleData.uUnit.objectId;  //数据中没有单位代码则用使用人的单位代码
  return new Promise((resolve, reject) => {
    let promArr = [];               //定义一个Promise数组
    let setPromise = new Set();
    var reqData=req.map(reqField=>{
      switch (reqField.t) {
        case 'MS':
          reqField.e = vifData ? '点击选择服务单位' : app.roleData.sUnit.uName;
          break;
        case 'sObject':
          reqField.osv = [0, 0];
          if (reqField.gname == 'goodstype') {
            reqField.objarr = require('../libs/goodstype').droneId;
            reqField.master = require('../libs/goodstype').master;
            reqField.slave = require('../libs/goodstype').slave;
          } else {setPromise.add(reqField.gname) };
          break;
        case 'specsel':                    //规格选择字段
          setPromise.add('cargo');
          break;
        case 'sId':
          setPromise.add(reqField.gname);
          break;
        case 'arrplus':
          setPromise.add('product');
          break;
        case 'producttype':
          reqField.indlist = app.roleData.uUnit.indType.code;
          break;
      };
      if (vifData) {
        switch (reqField.t) {
          case 'chooseAd':
            const cLocation=()=> {
              return new Promise((resolve, reject) => {
                wx.getSetting({
                  success(res) {
                    if (res.authSetting['scope.userLocation']) {                   //用户已经同意小程序使用用户地理位置
                      resolve(true)
                    } else {
                      wx.authorize({
                        scope: 'scope.userLocation',
                        success() { resolve(true) },
                        fail() {
                          wx.showToast({ title: '请授权使用位置', duration: 2500, icon: 'loading' });
                          setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
                          reject();
                        }
                      })
                    };
                  }
                })
              }).then((vifAuth) => {
                return new Promise((resolve, reject) => {
                  wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                      vData[reqField.gname] = new AV.GeoPoint({ latitude: res.latitude, longitude: res.longitude })
                      resolve(true)
                    },
                    fail() { reject() }
                  })
                })
              }).catch(console.error)
            };
            promArr.push(cLocation());          //地理位置字段
            break;
          case 'eDetail':                      //详情字段
            vData[reqField.gname] = [                     //内容部分定义：t为类型,e为文字或说明,c为媒体文件地址或内容
              { t: "h2", e: "大标题" },
              { t: "p", e: "正文简介" },
              { t: "h3", e: "中标题" },
              { t: "p", e: "正文" },
              { t: "h4", e: "1、小标题" },
              { t: "p", e: "图片文章混排说明" },
              { t: "-2", c: 'http://ac-trce3aqb.clouddn.com/eb90b6ebd3ef72609afc.png', e: "图片内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", e: "2、小标题" },
              { t: "p", e: "音频文章混排" },
              { t: "-3", c: "https://i.y.qq.com/v8/playsong.html?songid=108407446&source=yqq", e: "录音内容说明" },
              { t: "p", e: "正文" },
              { t: "h4", p: "3、小标题" },
              { t: "p", p: "视频文章混排" },
              { t: "-4", c: "https://v.qq.com/x/page/f05269wf11h.html?ptag=2_5.9.0.13560_copy", e: "视频内容说明" },
              { t: "p", e: "正文" },
              { t: "p", e: "章节结尾" },
              { t: "p", e: "文章结尾" }
            ];
            break;
          case 'assettype':
            vData[reqField.gname] = { code: 0, sName: '点此处进行选择' };
            break;
          case 'producttype':
            vData[reqField.gname] = { code: 0, sName: '点此处进行选择' };
            break;
          case 'industrytype':
            vData[reqField.gname] = { code: [], sName: [] };
            break;
          case 'arrplus':
            vData[reqField.gname] = { code: 0, sName: '点此处进行选择' };
            break;
          case 'ed':
            vData[reqField.gname] = { code: 0, sName: '点此处进入编辑' };
            break;
          case 'listsel':
            vData[reqField.gname] = 0;
            break;
          case 'arrList':
            vData[reqField.gname] = [];
            break;
          case 'sedate':
            vData[reqField.gname] = [getdate(Date.now()), getdate(Date.now() + 864000000)];
            break;
          case 'fg' :
            vData[reqField.gname] = 0;
            break;
        }
      };
      return reqField;
    })
    setPromise.forEach(nPromise=> {promArr.push(updateData(true, nPromise, unitId))})
    return Promise.all(promArr).then(() => {
      for (let i = 0; i < reqData.length; i++) {
        switch (reqData[i].t) {
          case 'sObject':                    //对象选择字段
            if (reqData[i].gname != 'goodstype') {
              reqData[i].master = app.aData.product[unitId];
              reqData[i].slave = app.aData.cargo[unitId];
              reqData[i].objarr = app.mData.product[unitId].map(proId => {
                return { masterId: proId, slaveId: app.aData.product[unitId][proId].cargo }
              })
            };
            break;
          case 'specsel':                    //规格选择字段
            reqData[i].ensel = (vData.specstype == 0);
            reqData[i].master = {};
            reqData[i].slave = {};
            vData.specs.forEach(specsId => {
              reqData[i].master[specsId] = app.aData.specs[unitId][specsId];
              reqData[i].slave[specsId] = app.aData.cargo[unitId][app.aData.specs[unitId][specsId].cargo];
            });
            break;
          case 'sId':
            reqData[i].maData = app.mData[reqData[i].gname][unitId].map(mId=>{
              return {
                objectId: mId, sName: app.aData[reqData[i].gname][unitId][mId].uName + ':' + app.aData[reqData[i].gname][unitId][mId].title }
            });
            reqData[i].mn = vifData ? 0 : app.mData[reqData[i].gname][unitId].indexOf(vData[reqData[i].gname]);
            break;
          case 'arrplus':
            reqData[i].sId = vData.sId ? vData.sId : app.mData.product[unitId][0];
            reqData[i].objects = app.aData.product[unitId];
            break;
        }
        if (reqData[i].csc) {
          funcArr.push('f_' + reqData[i].csc);
          if (['aslist', 'arrsel'].indexOf(reqData[i].csc) >= 0) {
            reqData[i].aVl = [0, 0, 0];
            reqData[i].inclose = vifData ? true : false;
          };
        } else {
          if (reqData[i].t.length > 2) { funcArr.push('i_' + reqData[i].t) };             //每个输入类型定义的字段长度大于2则存在对应处理过程
        };
      };
      resolve({ reqData, vData, funcArr });
    });
  }).catch(console.error);
}
}
