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

  countData: (monInterval,className,cObjName,cObjValue,attributeName,attributeId)=>{
    var countClass = new AV.Query(className);                                      //进行数据库初始化操作
    var aCountClass = app.aCount[className] || {};
    let userType = app.roleData.user.userRolName=='promoter' ? 'promoter' : 'channel';
    if (app.roleData.user.userRolName !== 'admin') { countClass.equalTo(userType, app.roleData.user.objectId)};                //除权限和文章类数据外只能查指定单位的数据
 //   if (cObjName) { countClass.equalTo(cObjName, cObjValue)};                //除权限和文章类数据外只能查指定单位的数据
    if (attributeName) { countClass.equalTo(attributeName, attributeId)};
    let countMon = (classCount,[year,Mon])=>{
      return new Promise((resolve, reject) => {
        let yearMon = year+'-'+Mon;
        if (typeof aCountClass[yearMon]=='undefined'){
          classCount.greaterThan('updatedAt', new Date(yearMon+'-01 00:00:00'));
          classCount.lessThan('updatedAt', new Date(Mon == 12 ? yearMon + '-31 23-59-59' : year + '-' + (Mon + 1) + '-01 00:00:00'));
          classCount.count().then(monCount=>{
            aCountClass[yearMon] = monCount.count;
            resolve(yearMon)
          })
        } else {
          resolve(yearMon)
        };
      })
    }
    let numEnd = monInterval.length - 1;
    let endYearMon = monInterval[numEnd][0] + '-' + monInterval[numEnd][1]
    return new Promise((resolve, reject) => {
      countClass.greaterThan('updatedAt', new Date(endYearMon + '-01 00:00:00'));
      countClass.lessThan('updatedAt', new Date(monInterval[numEnd][1] == 12 ? endYearMon + '-31 23-59-59' : monInterval[numEnd][0] + '-' + (monInterval[numEnd][1] + 1) + '-01 00:00:00'));
      countClass.count().then(endCount =>{
        aCountClass[endYearMon] = endCount.count;
        monInterval.map(ym => { countMon(countClass,ym) }).reduce(
          (m,p) => {m.then(v=>{ Promise.all([...v,p()]) }),
          Promise.resolve([])
        }).then(()=>{
          let endYearIndex = monInterval.filter(ym=>{ return ym.indexOf(monInterval[numEnd][0])>=0 })
          app.aCount[className] = aCountClass;
          resolve({ countAll: sumArr(aCountClass), countYear: sumArr(aCountClass, endYearIndex), countMon: aCountClass[endYearMon] });
        }).catch(err => { reject(err) })
      })
    }).catch(console.error)
  }
}
