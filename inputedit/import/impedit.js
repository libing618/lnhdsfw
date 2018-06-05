const AV = require('../../libs/leancloud-storage.js');
const {i_cutImageThumbnail,i_modalEditAddress,i_mapSelectUnit} = require('../../model/controlModal.js');
const qqmap_wx = require('../../libs/qqmap-wx-jssdk.min.js');   //微信地图
var QQMapWX = new qqmap_wx({ key: '6JIBZ-CWPW4-SLJUB-DPPNI-4TWIZ-Q4FWY' });   //开发密钥（key）
var app = getApp();
const vdSet = function (sname, sVal) {
  let reqset = {};
  reqset['vData.' + sname] = sVal;
  return reqset;
};
const rdSet = function (n, rdg, rdn) {
  let reqdataset = {};
  reqdataset['iFormat[' + n + '].' + rdg] = rdn;
  return reqdataset;
};
const mgrids = ['产品', '图像', '音频', '视频', '位置', '文件', '大标题', '中标题', '小标题', '正文'];
const mid = ['-1', '-2', '-3', '-4', '-5', '-6', 'h2', 'h3', 'h4', 'p'];
function getdate(idate) {
  let rdate = new Date(idate)
  var year = rdate.getFullYear();
  var month = rdate.getMonth() + 1;
  var day = rdate.getDate();
  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
};
module.exports = {
  i_modalEditAddress: i_modalEditAddress,
  i_cutImageThumbnail: i_cutImageThumbnail,
  i_mapSelectUnit: i_mapSelectUnit,

  f_idsel: function (e) {                         //选择ID
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    let sIdValue = this.data.iFormat[n].maData[Number(e.detail.value)].objectId;
    let rvdSet = vdSet(this.data.iFormat[n].gname, sIdValue);
    rvdSet['iFormat[' + n + '].mn'] = Number(e.detail.value);
    let sIdNumber = -1, sIdName = this.data.iFormat[n].gname;
    for (let i=0;i<this.data.iFormat.length;i++){
      if (this.data.iFormat[i].gname==sIdName){
        sIdNumber = i;
        break;
      }
    }
    if (sIdNumber>=0){
      if (this.data.iFormat[n].sId != sIdValue){
        rvdSet['iFormat[' + sIdNumber + '].sId'] = sIdValue;
        rvdSet['iFormat[' + sIdNumber + '].aVl'] = [0, 0, 0];
        rvdSet['vData.' + sIdName] = { code: 0, sName: '点此处进行选择' };
      }
    this.setData(rvdSet);
    }
  },

  f_idate: function (e) {                         //日期选择
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'pa':
        that.setData( vdSet( that.data.iFormat[n].gname, new Date(e.detail.value) ) );
        break;
    }
  },

  f_itime: function (e) {                         //时间选择
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'pa':
        that.setData(vdSet(that.data.iFormat[n].gname, e.detail.value));
        break;
    }
  },

  f_aslist: function (e) {                         //选择行业类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.iFormat[n].gname;
    switch (id) {
      case 'se':                                   //按下载ICON打开选择框
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'su':                                   //按确定ICON确认选择
        that.data.vData[fName].code.push(Number(e.currentTarget.dataset.ca));
        that.data.vData[fName].sName.push(e.currentTarget.dataset.sa);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
      case 'pa':
        let val = e.detail.value;
        if (that.data.iFormat[n].aVl[0] == val[0]) {
          if (that.data.iFormat[n].aVl[1] != val[1]) { val[2] = 0 }
        } else { val[1] = 0; val[2] = 0 }
        that.setData(rdSet(n, 'aVl', val));
        break;
      case 'lj':                                   //按显示类型名称进行删除
        let i = Number(e.currentTarget.dataset.id);
        that.data.vData[fName].code.splice(i, 1);
        that.data.vData[fName].sName.splice(i, 1);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
    }
  },

  f_number: function (e) {
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let vdSet = {};
    vdSet['vData.' + this.data.iFormat[n].gname] = isNaN(Number(e.detail.value)) ? 0 : parseInt(Number(e.detail.value));      //不能输入非数字,转换为整数
    this.setData(vdSet);
  },

  f_digit: function (e) {
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let vdSet = {};
    vdSet['vData.' + this.data.iFormat[n].gname] = isNaN(Number(e.detail.value)) ? '0.00' : parseFloat(Number(e.detail.value).toFixed(2));      //不能输入非数字,转换为浮点数保留两位小数
    this.setData(vdSet);
  },

  f_mCost:function(e){
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let inmcost = Number(e.detail.value);
    let vdSet = {};
    if (isNaN(inmcost)){
      vdSet['vData.'+this.data.iFormat[n].gname] = 0;      //不能输入非数字
    } else {
      vdSet['vData.'+this.data.iFormat[n].gname] = inmcost>30 ? 30 : inmcost ;      //不能超过30%
    }
    this.data.vData[this.data.iFormat[n].gname] = isNaN(inmcost) ? 0 : (inmcost > 30 ? 30 : inmcost)
    vdSet['vData.mCost'] = 87 - (this.data.vData.channel ? this.data.vData.channel : 0) - (this.data.vData.extension ? this.data.vData.extension :0);
    this.setData( vdSet );
  },

  f_canSupply:function(e){
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    let inNumber = Number(e.detail.value);
    let vdSet = {};
    if (isNaN(inNumber)){ inNumber = 0 };      //不能输入非数字
    vdSet['vData.'+this.data.iFormat[n].gname] = inNumber ;
    vdSet.vData.canSupply = inNumber;
    this.setData( vdSet );
  },

  f_objsel: function (e) {                         //对象选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'ac':
        if (!that.data.iFormat[n].inclose) {
          that.setData(vdSet(that.data.iFormat[n].gname, e.currentTarget.dataset.ca))
        }
        that.setData(rdSet(n, 'inclose', true));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.iFormat[n].osv[0] != aval[0]) { aval[1] = 0 };
        that.setData(rdSet(n, 'osv', aval));
        break;
    }
  },

  f_arrsel: function (e) {                         //数组选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'se':
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'ac':
        if (!that.data.iFormat[n].inclose) {
          that.setData(vdSet(that.data.iFormat[n].gname, { code: e.currentTarget.dataset.ca, sName:e.currentTarget.dataset.sa }))
        }
        that.setData(rdSet(n, 'inclose', true));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.iFormat[n].aVl[0] == aval[0]) {
          if (that.data.iFormat[n].aVl[1] != aval[1]) { aval[2] = 0; }
        } else { aval[1] = 0; aval[2] = 0; }
        that.setData(rdSet(n, 'aVl', aval));
        break;
    }
  },

  i_listsel: function (e) {                         //选择类型
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    this.setData(vdSet(this.data.iFormat[n].gname, Number(e.detail.value)))
  },

  i_sedate: function (e) {                         //选择开始和结束日期
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let rSet = {};
    switch (id) {
      case 'ac':
        rSet = vdSet(that.data.iFormat[n].gname, e.currentTarget.dataset.ei ? [that.data.vData[that.data.iFormat[n].gname][0], e.detail.value] : [e.detail.value, that.data.vData[that.data.iFormat[n].gname][1]]);
        break;
      case 'ds':                             //选择开始日期
        rSet['iFormat[' + n + '].endif'] = false;
        break;
      case 'de':                           //选择结束日期
        rSet['iFormat[' + n + '].endif'] = true;
        break;
    }
    that.setData(rSet);
  },

  i_inScan: function (e) {                         //扫描及输入
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.iFormat[n].gname;
    switch (id) {
      case 'sc':
        wx.scanCode({
          success: (res) => {
            that.setData(vdSet(fName, res.result));
          }
        })
        break;
      case 'su':
        that.setData(vdSet(fName, e.detail.value[fName]));
        break;
    }
  },

  i_arrList: function (e) {                         //数组选择类型
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3));      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    let fName = that.data.iFormat[n].gname;
    switch (id) {
      case 'su':                                   //按下载ICON打开输入框
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        break;
      case 'ai':
        that.setData(rdSet(n, 'iValue', e.detail.value));
        break;
      case 'se':
        that.data.vData[fName].push(e.currentTarget.dataset.add);
        that.setData(vdSet(fName, that.data.vData[fName]));
        that.setData(rdSet(n, 'iValue', ''));
        break;
      case 'lj':                                   //按显示类型名称进行删除
        let i = Number(e.currentTarget.dataset.id);
        that.data.vData[fName].splice(i, 1);
        that.setData(vdSet(fName, that.data.vData[fName]))
        break;
      }
  },

  i_pics: function (e) {                         //选择图片组
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 9,                                     // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
      success: function (restem) {                     // 返回选定照片的本地文件路径列表
        that.setData(vdSet(that.data.iFormat[n].gname, restem.tempFilePaths));
      },
      fail: function () { wx.showToast({ title: '选取照片失败！' }) }
    })
  },

  i_pic: function (e) {                         //上传申请人持身份证照片,单位组织机构代码证或个人身份证背面
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],                      //用户拍摄
      success: function (res) {
        new AV.File('file-name', {
          blob: { uri: res.tempFilePaths[0], },
        }).save().then(file => {
          that.setData(vdSet(that.data.iFormat[n].gname, file.url()));
        }).catch(console.error);
      }
    });
  },

  i_chooseAd: function (e) {                         //选择地理位置
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseLocation({
      success: function (res) {
        QQMapWX.reverseGeocoder({                    //解析地理位置
          location: { latitude: res.latitude, longitude: res.longitude },
          success: function ({ result: { ad_info, address } }) {
            let setAd = {};
            setAd['vData.aGeoPoint'] = new AV.GeoPoint({ latitude: res.latitude, longitude: res.longitude });
            setAd['vData.address'] = { code: ad_info.adcode, sName: address };
            that.setData(setAd);
          }
        });
      }
    })
  },

  i_vidio: function (e) {                         //选择视频文件
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        let vdv = vdSet(that.data.iFormat[n].gname, res.tempFilePath);
        that.setData(vdv);
      },
      fail: function () { wx.showToast({ title: '选取视频失败！' }) }
    })
  },

  i_sCargo: function (e) {                         //选择产品服务
    var that = this;
    let n = parseInt(e.currentTarget.id.substring(3))      //数组下标
    var id = e.currentTarget.id.substring(0, 2);
    switch (id) {
      case 'ac':
        that.setData(rdSet(n, 'inclose', !that.data.iFormat[n].inclose));
        that.setData(vdSet(that.data.iFormat[n].gname, ''));
        break;
      case 'pa':
        let aval = e.detail.value;
        if (that.data.iFormat[n].provalue[0] != aval[0]) { aval[1] = 0; }
        that.setData(rdSet(n, 'provalue', aval));
        break;
    }
  },

  i_eDetail: function (e) {                                 //内容可以插入和删除
    var that = this;
    that.setData({
      selectd: parseInt(e.currentTarget.id.substring(3)),      //选择文章内容的数组下标
      enMenu: 'inline-block'
    })
  },

  i_insdata: function (e) {                          //插入数据
    this.farrData(e.currentTarget.id, 0);      //选择的菜单id;
  },

  farrData: function (sIndex, instif) {                          //详情插入或替换数据
    var that = this;
    var artArray = that.data.vData.details;       //详情的内容
    return new Promise((resolve, reject) => {
      switch (sIndex) {
        case '-1':             //选择产品
          resolve('选择商品');
          break;
        case '-2':               //选择相册图片或拍照
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
            success: function (res) { resolve(res.tempFilePaths[0]); },
            fail: function (err) { reject(err) }
          });
          break;
        case '-3':               //录音
          wx.startRecord({
            success: function (res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (cres) { resolve(cres.savedFilePath); },
                fail: function (cerr) { reject('录音文件保存错误！') }
              });
            },
            fail: function (err) { reject(err) }
          });
          break;
        case '-4':               //选择视频或拍摄
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front', 'back'],
            success: function (res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (cres) { resolve(cres.savedFilePath); },
                fail: function (cerr) { reject('视频文件保存错误！') }
              });
            },
            fail: function (err) { reject(err) }
          })
          break;
        case '-5':                    //选择位置
          wx.chooseLocation({
            success: function (res) { resolve({ latitude: res.latitude, longitude: res.longitude }); },
            fail: function (err) { reject(err) }
          })
          break;
        case '-6':                     //选择文件
          resolve('选择文件');
          break;
        default:
          resolve(false);
      }
    }).then((content) => {
      let sI = mid.indexOf(sIndex);
      if (content) {
        artArray.splice(that.data.selectd, instif, { t: sIndex, e: '点击此处输入' + mgrids[sI] + '的说明', c: content });
      } else {
        artArray.splice(that.data.selectd, instif, { t: sIndex, e: mgrids[sI] });
      };
      that.setData({ 'vData.details': artArray, enIns: true });
      if (['-1', '-6'].indexOf(sIndex) >= 0) {
        let showPage = {};;
        switch (sIndex) {
          case '-1':
            if (!that.f_modalSelectPanel) {that.f_modalSelectPanel = require('../../model/controlModal').f_modalSelectPanel}
            showPage.pageData = app.aData.goods;
            showPage.tPage = app.mData.goods;
            showPage.idClicked = '0';
            that.data.sPages.push({ pageName:'modalSelectPanel', pNo:'goods', gname:'details',p:'产品' });
            showPage.sPages = that.data.sPages;
            that.setData(showPage);
            popModal(that);
            resolve(true);
            break;
          case '-6':
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
                that.data.sPages.push({ pageName:'modalSelectFile', pNo:'files', gname:'details',p:'文件' });
                showPage.sPages = that.data.sPages;
                that.setData(showPage);
                popModal(that);
                resolve(true);
              }
            })
            break;
          default: break;
        }
      }
    }).catch(console.error);
  }
}
