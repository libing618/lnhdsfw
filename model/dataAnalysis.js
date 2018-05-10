const AV = require('../libs/leancloud-storage.js');
const { updateRoleData } = require('initupdate');
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
  let yearMon = staYear + (staMon>9 ? '-' : '-0') + staMon;
  let endYearIndex = (staYear === endYear) ? [yearMon] : [];     //本年月份数组
  var result = [yearMon];     //用户注册到本月的月份数组
  let dayRange = {};     //每月的起止时间数组
  dayRange[yearMon]=[new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon < endMon) {
        staMon++;
        yearMon = staYear + (staMon>9 ? '-' : '-0') + staMon,
        result.push(yearMon);
        dayRange[yearMon] = [new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
      }
      staYear++;
    } else {
      staMon++;
      if (staMon > 12) {
        staMon = 1;
        staYear++;
      }
      yearMon = staYear + (staMon>9 ? '-' : '-0') + staMon
      result.push(yearMon);
      dayRange[yearMon] = [new Date(yearMon + '-01 00:00:00'),new Date(staMon == 12 ? yearMon + '-31 23:59:59:999' : staYear + '-' + (staMon + 1) + '-01 00:00:00')];
    }
  }
  return {yearMon:result,dayRange,endYear:endYearIndex,endYearMon:endYear+(endMon>9 ? '-' : '-0')+endMon};
};
function readSumData(className,sumField,updAt,atName){
  var sumRecords = [];
  let atName = (atName) ? atName : 'updatedAt';
  let readUp = Promise.resolve(new AV.Query(className).select(sumField).greaterThan(atName, updAt).limit(1000).ascending(uatName)).then(results=>{
    if (results) {
      results.forEach(result=>{ sumRecords.push(result.toJSON()) });
      updAt = results[0].updatedAt;
      readUp();
    } else { return sumRecords };
  })
};
module.exports = {
  getMonInterval:getMonInterval,

  readRoleData: function(className){
    updateRoleData(true,className).then(()=>{
      let readDown = Promise.resolve(updateRoleData(false, className)).then(notEnd => {
        if (notEnd) {
          return readDown();
        } else {
          return true;
        }
      });
    });
  },

  allUpdateData: function(className){
    updateData(true,className).then(()=>{
      let readDown = Promise.resolve(updateData(false, className)).then(notEnd => {
        if (notEnd) {
          return readDown();
        } else {
          return true;
        }
      });
    });
  },

  aDataSum: function(className,sumField,idArr){
    return new Promise((resolve, reject) => {
      let sLength = fields.length;
      let fieldSum = new Array(sLength);
      fieldSum.fill(0);         //定义汇总数组长度且填充为0
      idArr = idArr ? idArr : app.mData[className][app.roleData.user.objectId];
        if (idArr) {
          idArr.forEach(mId => {
            for (let i = 0; i < sLength; i++) { mSum[mId].push(0) };
            if (app.aData[className][mId]){
              for (let i = 0; i < sLength; i++) {
                fieldSum[i] += app.aData[className][mId][fields[i]];
              }
            };
          })
        }
        resolve(fieldSum);
      });
    }).catch(console.error);
  },

  sumFamily: function(className,fields,familyCount){                  //暂态数据按月根据afamily汇总
    let sLength = fields.length;
    let sFields = [];
    let fSum = {},newSum;
    for (let i=0;i<=familyCount;i++) {         //定义汇总数组长度且填充为0
      fields.forEach(field=>{ sFields.push(field+i) });
    }
    return new Promise((resolve,reject)=>{
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
      return new Promise((resolve,reject)=>{
        readSumData(className,[...fields,'afamily'],updatedAt).then(sumData=>{
          if (sumData){
            let recordJSON,rDate,rYearMon;
            sumData.forEach(mRecord=>{
              recordJSON = mRecord.toJSON();
              fields.forEach(fName=>{
                fSum[fName+recordJSON.afamily] += recordJSON[fName];
              });
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

  sumData: function(mIntervals,className,sumField){                   //暂态数据按月汇总
    let sfLength = sumField.length;
    let mSum = {},newSum=[];
    let fieldSum = new Array(sfLength);
    fieldSum.fill(0);         //定义汇总数组长度且填充为0
    return new Promise((resolve,reject)=>{
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
            mSum[sumRec.yearMon]=fsArr;
          });
          newSum.push(sumRec[0]);     //最后一个月重新统计
          resolve (new Date(sumRec[0].updatedAt))
        } else { resolve(new Date(0)) }
      })
    }).then(updatedAt=>{
      return new Promise((resolve,reject)=>{
        let addSum = AV.Object.extend(className+'Sum');
        let ymstar = newSum.length>0 ? mIntervals.indexOf(newSum[0].yearMon) : 0;
        let apmInterval = mIntervals.slice(ymstar);         //进行汇总的月份数组
        apmInterval.forEach(nym=> {
          if(!mSum[nym]) {
            mSum[nym] = fieldSum;
            let aSumRecord = new addSum;
            aSumRecord.set('yearMon',nym);
            aSumRecord.set(userId,app.roleData.user.objectId);
            aSumRecord.setACL(app.configData.reqRole);
            newSum.push(aSumRecord);
          };
        });
        readSumData(className,sumField,updatedAt).then(sumData=>{
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
          for (let j=0;j<apmInterval.length;j++){
            for (let i=0;i<sfLength;i++){
              newSum[j].set(sumField[i],mSum[apmInterval[j]][i]);
            };
            newSum[j].setACL(app.configData.reqRole);
          };
          AV.Object.saveAll(newSum).then(()=>{
            for (let i=0;i<sfLength;i++){
              mIntervals.forEach(mon=> { fieldSum[i] += mSum[mon][i] })
            }
            resolve( fieldSum )
          })
        });
      });
    }).catch(console.error)
  },

  countSort: function ( className, cField) {     //进行数据库统计排序
    var classObj = 'count' + className + 'Sort';
    let cSumUp;
    return new Promise((resolve, reject) => {
      new AV.Query(classObj)
        .equalTo(userId, app.roleData.user.objectId)
        .select(cField)
        .first().then(sCount => {
          if (sCount) {
            cSumUp = sCount;
            let sfield = sCount.toJSON();
            cField.forEach(fName => { cSum[fName] = sfield[fName] });
            resolve(new Date(sCount.updatedAt))
          } else {
            cFields.forEach(fName => { cSum[fName] = {} });
            let nSum = AV.Object.extend(classObj);
            cSumUp = new nSum;
            resolve(new Date(0))
          };
        });
    }).then(createdAt => {
      return new Promise((resolve, reject) => {
        readSumData(className, cField, createdAt, 'createdAt').then(sumData => {
          if (sumData) {
            let recordJSON;
            sumData.forEach(mRecord => {
              recordJSON = mRecord.toJSON();
              cField.forEach(fName => {
                cSum[fName][recordJSON[fName]] = cSum[fName][recordJSON[fName]] ? cSum[fName][recordJSON[fName]]+=1 : cSum[fName][recordJSON[fName]]=1;
              });
            });
          };
          cFields.forEach(fName => { cSumUp.set(fName, cSum[fName].sort(sortId)) })
          newSum.setACL(app.configData.reqRole)
          newSum.save().then(() => {
            let fieldSum = [];
            function sortCount(a, b) {
              return a.data - b.data
            }
            for (let i = 0; i < cField.length; i++) {
              let fs = [];
              for (let fsname in cSum[cField[i]]) { fs.push({ name: fsname, data: cSum[cField[i]][fsname]})}
              fieldSum.push( fs.sort(sortCount) )
            }
            resolve(fieldSum)
          })
        })
      })
    }).catch(console.error)
  },

  countData: function(monInterval,className,cObjName,cObjValue){     //进行数据库统计
    var classObj = className + 'Count';
    return new Promise((resolve, reject) => {
      new AV.Query(classObj)
      .equalTo(cObjName, cObjValue)
      .equalTo(userId, app.roleData.user.objectId)
      .find().then(sCount => {
        let initCount = {};
        if (sCount) { sCount.forEach(sField => { sCount[sField.get('yearMon')] = sField.get('count') }) };
        initCount[monInterval.endYearMon] = undefined;
        app.aCount[classObj] = initCount;
        let acpa = [];
        monInterval.yearMon.forEach(yearMon=>{
          if (typeof app.aCount[classObj][yearMon]=='undefined') {
            let countClass = new AV.Query(classObj);
            let userType = app.roleData.user.userRolName == 'promoter' ? 'promoter' : 'channel';
            if (app.roleData.user.userRolName !== 'admin') { countClass.equalTo(userType, app.roleData.user.objectId) };                //除权限和文章类数据外只能查指定单位的数据
            if (cObjName) { countClass.equalTo(cObjName, cObjValue) };                //除权限和文章类数据外只能查指定单位的数据
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
      })
    }).catch(console.error)
  }

}
