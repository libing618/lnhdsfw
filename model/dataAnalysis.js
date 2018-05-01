const AV = require('../libs/leancloud-storage.js');
var app = getApp();
function sumArr(arrData,arrIndex){
  let dSum = 0;
  arrIndex.forEach(ad=>{
    dSum = dSum +arrData[ ad[2] ]
  })
  return dSum
};
function getMonInterval(){
  var starts = app.roleData.user.createdAt.split('-');
  var staYear = parseInt(starts[0]);
  var staMon = parseInt(starts[1]);
  var endYear = new Date().getFullYear();
  var endMon = new Date().getMonth()+1;
  let yearMom = staYear + (staMon>9 ? '-' : '-0') + staMon;
  let endYearIndex = (staYear === endYear) ? [yearMom] : [];     //本年月份数组
  var result = [yearMom];     //用户注册到本月的月份数组
  let dayRange = {};     //每月的起止时间数组
  dayRange[yearMom]=[new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon < endMon) {
        staMon++;
        yearMom = staYear + (staMon>9 ? '-' : '-0') + staMon,
        result.push(yearMom);
        dayRange[yearMom] = [new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
      }
      staYear++;
    } else {
      staMon++;
      if (staMon > 12) {
        staMon = 1;
        staYear++;
      }
      yearMom = staYear + (staMon>9 ? '-' : '-0') + staMon
      result.push(yearMom);
      dayRange[yearMom] = [new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
    }
  }
  return {yearMom:result,dayRange,endYear:endYearIndex,endYearMon:endYear+(endMon>9 ? '-' : '-0')+endMon};
};
function readRoleData(className,sumField,updAt){
  var sumRecords = [];
  let readUp = Promise.resolve(new AV.Query(className).select(sumField).greaterThan('updatedAt',updAt).limit(1000).ascending('updatedAt')).then(results=>{
    if (results) {
      results.forEach(result=>{ sumRecords.push(result.toJSON()) });
      updAt = results[0].updatedAt;
      readUp();
    } else ( return sumRecords )
  })
}
module.exports = {
  getMonInterval:getMonInterval,

  sumFamily: function(className,fields,familyCount){
    let sLength = fields.length;
    let sFields = [];
    let fSum = {},newSum;
    for (let i=0;i<=familyCount;i++) {         //定义汇总数组长度且填充为0
      fields.forEach(field=>{ sFields.push(field+i) });
    }
    return new Promise(resolve,reject)=>{
      new AV.Query(className+'Family')
      .equalTo(userId,app.roleData.user.objectId)
      .first().then(sFamily=>{
        if(sFamily){
          let sfield = sFamily.toJSON();
          sFields.forEach(fName=>{ fSum[fName]=sfield[fName] });
          newSum = sFamily;
          resolve (new Date(sFamily.updatedAt))
        } else {
          sFields.forEach(fName=>{ fSum[fName]= 0 });
          let nSum = AV.Object.extend(className+'Family');
          newSum = new nSum;
          resolve(new Date(0))
        };
      });
    }).then(updatedAt=>{
      return new Promise(resolve,reject)=>{
        readRoleData(className,[...fields,'afamily'],updatedAt).then(sumData=>{
          if (sumData){
            let recordJSON,rDate,rYearMon;
            sumData.forEach(mRecord=>{
              recordJSON = mRecord.toJSON();
              fields.forEach(fName=>{ fSum[fName+recordJSON.afamily] += recordJSON[fName];
            });
          };
          sFields.forEach(fName=>{ newSum.set(fName,fSum[fName]) })
          newSum.setACL(app.configData.reqRole)
          newSum.save().then(()=>{
            let fieldSum = [];
            for (let i=0;i<sLength;i++){
              fieldSum.push( fields.map(fname=> { return fSum[fname+i] }) )
            }
            resolve( fieldSum )
          })
        })
      });
    }).catch(console.error)
  },

  sumData: function(mIntervals,className,sumField){
    let sfLength = sumField.length;
    let mSum = {},newSum=[];
    let fieldSum = new Array(sfLength);
    fieldSum.fill(0);         //定义汇总数组长度且填充为0
    return new Promise(resolve,reject)=>{
      new AV.Query(className+'Sum')
      .descending('updatedAt')
      .equalTo(userId,app.roleData.user.objectId)
      .find().then(sumRec=>{
        if(sumRec){
          let sfield;
          sumRec.forEach(sf=>{
            sfield = sf.toJSON();
            let fsArr = [];
            sumField.forEach(fName=>{fsArr.push(sfield[fName])})
            mSum[sumRec.yearMom]=fsArr;
          });
          newSum.push(sumRec[0]);     //最后一个月重新统计
          resolve (new Date(sumRec[0].updatedAt))
        } else { resolve(new Date(0)) }
      })
    }).then(updatedAt=>{
    return new Promise(resolve,reject)=>{
      let addSum = AV.Object.extend(className+'Sum');
      let ymstar = newSum.length>0 ? mIntervals.indexOf(newSum[0].yearMom) : 0;
      let apmInterval = mIntervals.slice(ymstar);         //进行汇总的月份数组
      apmInterval.forEach(nym=> {
        if(!mSum[nym]) {
          mSum[nym] = fieldSum;
          let aSumRecord = new addSum;
          aSumRecord.set('yearMom',nym);
          aSumRecord.set(userId,app.roleData.user.objectId);
          aSumRecord.setACL(app.configData.reqRole);
          newSum.push(aSumRecord);
        };
      });
      readRoleData(className,sumField,updatedAt).then(sumData=>{
        if (sumData){
          let recordJSON,rDate,rYearMon;
          sumData.forEach(mRecord=>{
            recordJSON = mRecord.toJSON();
            rYearMon = recordJSON.updatedAt.splice(0,7);
            for (let i=0;i<sfLength;i++){
              mSum[rYearMon][i] += recordJSON[sumField[i]];
            }
          });
        };
        for (let j=0;j<apmInterval.length,j++){
          for (let i=0;i<sfLength;i++){
            newSum[j].set(sumField[i],mSum[apmInterval[j]][i]);
          };
          newSum[j].setACL(app.configData.)
        };
        AV.Object.saveAll(newSum).then(()=>{
          for (let i=0;i<sfLength;i++){
            mIntervals.forEach(mon=> { fieldSum[i] += mSum[mon][i] })
          }
          resolve( fieldSum )
        })
      })
    }).catch(console.error)
  },

  countData: (monInterval,className,cObjName,cObjValue)=>{     //进行数据库统计
    var classObj = className+cObjValue;
    return new Promise((resolve, reject) => {
      let initCount = app.aCount[classObj] || {};
      initCount[monInterval.endYearMon] = undefined;
      app.aCount[classObj] = initCount
      let acpa = [];
      monInterval.yearMon.forEach(yearMon=>{
        if (typeof app.aCount[classObj][yearMon]=='undefined') {
          let countClass = new AV.Query(classObj);
          let userType = app.roleData.user.userRolName == 'promoter' ? 'promoter' : 'channel';
          if (app.roleData.user.userRolName !== 'admin') { countClass.equalTo(userType, app.roleData.user.objectId) };                //除权限和文章类数据外只能查指定单位的数据
          if (cObjName) { countClass.equalTo(cObjName, cObjValue) };                //除权限和文章类数据外只能查指定单位的数据
          if (attributeName) { countClass.equalTo(attributeName, attributeId) };
          countClass.greaterThan('updatedAt',monInterval.dayRange[yearMon][0]);
          countClass.lessThan('updatedAt',monInterval.dayRange[yearMon][1]);
          acpa.push([countClass,yearMon])
        }
      })
      acpa.map(ym => () => ym[0].count().then(monCount => {
        app.aCount[classObj][ym[1]] = monCount
      })
      ).reduce(
        (m, p) => m.then(v => Promise.all([...v, p()])),
        Promise.resolve([])
      ).then(aCounts => {
        let countAll = sumArr(app.aCount[classObj], monInterval.yearMon);
        resolve({ countAll: countAll, countYear: sumArr(app.aCount[classObj], monInterval.endYearIndex), countMon: app.aCount[classObj][monInterval.endYearMon] });
      })
    }).catch(console.error)
  }
}
