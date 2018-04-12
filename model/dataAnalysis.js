const AV = require('leancloud-storage.js');
var app = getApp();
function getMonInterval() {
  var result = [];
  var starts = app.roleData.user.createdAt.split('-');
  var ends = new Date().split('-');
  var staYear = parseInt(starts[0]);
  var staMon = parseInt(starts[1]);
  var endYear = parseInt(ends[0]);
  var endMon = parseInt(ends[1]);
  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon < endMon) {
        staMon++;
        result.push(staYear+'-'+staMon);
      }
      staYear++;
    } else {
      staMon++;
      if (staMon > 12) {
        staMon = 1;
        staYear++;
      }
      result.push(staYear+'-'+staMon);
    }
  }
  return {staYear:staYear,endYear:endYear,monInterval:result};
};
module.exports = {
  countData: (className,cObjName,cObjValue,attributeName,attributeId)=>{
    let {staYear,endYear,monInterval} = getMonInterval();
    var countClass = new AV.Query(className);                                      //进行数据库初始化操作
    let userType = app.roleData.user.userRolName=='promoter' ? 'sjid' : 'channelid';
    if (app.roleData.user.userRolName!=='admin') {urData.equalTo(userType, app.roleData.user.objectId)};                //除权限和文章类数据外只能查指定单位的数据
    if (cObjName) {urData.equalTo(cObjName, cObjValue)};                //除权限和文章类数据外只能查指定单位的数据
    if (attributeName) {urData.equalTo(attributeName, attributeId)};


  }
