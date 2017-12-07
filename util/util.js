const AV = require('../libs/leancloud-storage.js');
const procedureclass = require('../model/procedureclass.js');
var app = getApp();
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
};
module.exports = {
  checkRols: function(userRolName,ouRole){
    if (userRolName=='admin'){
      return true;
    } else {
      let roleLine = parseInt(substring(userRolName,1,1));
      if (roleLine==ouRole) {
        return true;
      } else { return false }
    }
  },

  updateData: function(isDown,pNo) {    //更新页面显示数据,isDown下拉刷新
    var that = this;
    var pClass = procedureclass[pNo];
    var readProcedure = new AV.Query(pClass.pModle);                                      //进行数据库初始化操作
    var upName = 'pAt'+pNo;
    if (isDown) {
      readProcedure.greaterThan('updatedAt', app.mData[upName][1]);          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量新闻
    } else {
      readProcedure.lessThan('updatedAt', app.mData[upName][0]);          //查询最后更新时间前修改的记录
      readProcedure.descending('updatedAt');           //按更新时间降序排列
    };
    let inFamily = pClass.afamily.constructor == 'Array';
    let aaName = 'prdct'+pNo
    readProcedure.find().then((arp) => {
      var lena = arp.length;
      if (lena > 0) {
        let aProcedure = {}, aPlace = -1, uSetData = {};
        if (isDown) {
          app.mData[upName][1] = arp[lena-1].updatedAt;                          //更新本地最新时间
          app.mData[upName][0] = arp[0].updatedAt; //若本地记录时间为空，则更新本地最后更新时间
        }else{
          app.mData[upName][0] = arp[lena-1].updatedAt;          //更新本地最后更新时间
        };
        for (var j = 0; j < lena; j++) {                   //文章分类ID数组增加对应文章ID
          aProcedure = arp[j].toJSON();                         //afamily文章类别0新闻1品牌2扶持政策3宣传4帮助
          if (isDown){
            if (inFamily) {
              aPlace = app.mData[aaName][aProcedure.afamily].indexOf(aProcedure.objectId);
              if (aPlace>=0) {app.mData[aaName][aProcedure.afamily].splice(aPlace,1)}           //删除本地的重复记录列表
              app.mData[aaName][aProcedure.afamily].unshift(aProcedure.objectId);
            } else {
              aPlace = app.mData[aaName].indexOf(aProcedure.objectId);
              if (aPlace>=0) {app.mData[aaName].splice(aPlace,1)}           //删除本地的重复记录列表
              app.mData[aaName].unshift(aProcedure.objectId);
            }
          }else{
            if (inFamily) {
              app.mData[aaName][aProcedure.afamily].push(aProcedure.objectId);
            } else {
              app.mData[aaName].push(aProcedure.objectId);
            }
          };
          app.aData[pNo][aProcedure.objectId] = aProcedure;                        //将数据记录到本机
          uSetData['pageData.'+aProcedure.objectId] = aProcedure;                  //增加页面中的新收到数据
        };
        uSetData.mPage = app.mData[aaName];
        that.setData( uSetData );
      }
    }).catch( console.error );
  },

  pName: function(pNo){
    let familyLength = procedureclass[pNo].afamily.length;
    let psData = {};
    if (familyLength>0) {
      psData.fLength = familyLength;
      psData.pageCk = app.mData['pCk'+pNo];
      psData.tabs = procedureclass[pNo].afamily;
    };
    return psData;
  },

  accheck: function(e){                           //选择类型的数组下标
    this.setData({ achecked: parseInt(e.currentTarget.id.substring(3)) });
  },
  tabClick: function (e) {                                //点击tab
    app.mData['pCk'+that.data.pNo] = Number(e.currentTarget.id)
    this.setData({
      pageCk: app.mData['pCk'+that.data.pNo]               //点击序号切换
    });
  },
  arrClick: function (e) {                      //点击arrClick
    let aNumber = Number(e.currentTarget.id)
    let pSet = {};
    pSet['mPage['+aNumber+'].'+'arrClicked'] = !this.data.mPage[aNumber].arrClicked;
    this.setData(pSet)
  },
  formatTime: function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}
