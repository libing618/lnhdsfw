const AV = require('../libs/leancloud-storage.js');
var app = getApp();
function sumArr(arrData,arrIndex){
  let dSum = 0;
  arrIndex.forEach(ad=>{ dSum+=arrData[ad] })
  return dSum
}
module.exports = {
  getMonInterval: ()=>{
    var result = [];
    var starts = app.roleData.user.createdAt.split('-');
    var staYear = parseInt(starts[0]);
    var staMon = parseInt(starts[1]);
    var endYear = new Date().getFullYear();
    var endMon = new Date().getMonth()+1;
    while (staYear <= endYear) {
      if (staYear === endYear) {
        while (staMon < endMon) {
          staMon++;
          result.push([staYear,staMon]);
        }
        staYear++;
      } else {
        staMon++;
        if (staMon > 12) {
          staMon = 1;
          staYear++;
        }
        result.push([staYear,staMon]);
      }
    }
    return result;
  },

  sumData: function(className,fields){
    if (dataUpdated){
      let sLength = fields.length;
      let fieldSum = new Array(sLength);
      let mSum = {};
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      if (app.mData[className][app.roleData.user.objectId]){
        app.mData[className][app.roleData.user.objectId].forEach(mId=>{
          mSum[mId] = [];
          for (let i = 0; i < sLength; i++) {mSum[mId].push(0)};
          app.aData[className][app.roleData.user.objectId][mId].cargo.forEach(aId=>{
            for (let i=0;i<sLength;i++){
              fieldSum[i] += app.aData.cargo[aId][fields[i]];
              mSum[mId][i] = mSum[mId][i]+app.aData.cargo[aId][fields[i]];
            }
          })
        })
      }
      this.setData({
        pandect:fieldSum,
        mSum: mSum
      })
    }
  },

  countData: (staYear,endYear,monInterval,className,cObjName,cObjValue,attributeName,attributeId)=>{
    var countClass = new AV.Query(className);                                      //进行数据库初始化操作
    let userType = app.roleData.user.userRolName=='promoter' ? 'sjid' : 'channelid';
    if (app.roleData.user.userRolName!=='admin') {urData.equalTo(userType, app.roleData.user.objectId)};                //除权限和文章类数据外只能查指定单位的数据
    if (cObjName) {urData.equalTo(cObjName, cObjValue)};                //除权限和文章类数据外只能查指定单位的数据
    if (attributeName) {urData.equalTo(attributeName, attributeId)};
    let countMon = (year,Mon)=>{
      let yearMon = year+'-'+Mon;
      if (!app.aCount[className][yearMon]){
        countClass.greaterThan('updatedAt', new Date(yearMon+'-01 00:00:00'));
        countClass.lessThan('updatedAt', new Date(Mon == 12 ? yearMon + '-31 23-59-59' : year + '-' + (Mon + 1) + '-01 00:00:00'));
        countClass.count().then(monCount=>app.aCount[className][yearMon]=monCount)
      }
    }
    monInterval.map(ym=>{ countMon(ym) }).reduce(
      (m,p) => {m.then(v=>{ Promise.all([...v,p()]) }),
      Promise.resolve([])
    }).then(()=>{
      let endYearIndex = monInterval.filter(ym=>{ return ym.indexOf(endYear)>=0 })
      return { countAll: sumArr(app.aCount[className]), countYear: sumArr(app.aCount[className], endYearIndex), countMon: app.aCount[className][endYear + '-' + endMon] }
    }).catch(err=>{ return err })

  }
}
