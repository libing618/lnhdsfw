//审批流程列表
const AV = require('../../../libs/leancloud-storage.js');
var app = getApp();
Page({
  data:{
    pClassName: [],
    wWidth: app.globalData.sysinfo.windowWidth,
    fLength: 3,
    pageCk: 0,
    atotal: [[],[],[]],
    pageData: {},
    ats: [[],[],[]],
    tabs:['待我审','已处理','已结束'],
    achecked: app.mData.proceduresCk
  },

  onLoad:function(options){
    let pClass = require('../../../model/procedureclass.js');
    pClass.forEach( procedure=> { this.data.pClassName.push(procedure.pName)} )
    var pLength = pClass.length;
    var ats = new Array(3);
    for (let i=0;i<3;i++) {
      for (let j=0;j<pLength;j++){ ats[i][j] = [] };
      for (let j=0;j<pLength;j++){
        app.mData.procedures[j].forEach( mpoId=>{
          ats[app.procdures[mpoId].apState][j].push(mpoId);
        })
      };
      for (let j=0;j<pLength;j++){
        this.data.atotal[i][j] = ats[i][j].length;
      }
    };
    this.setData({
      pClassName: this.data.pClassName,
      atotal: this.data.atotal,
      ats: ats,
      achecked: app.mData.proceduresCk,
      pageData: app.procdures
    });
  },

  onReady: function(){
    wx.setNavigationBarTitle({
      title: app.uUnit.uName+'的审批流程' ,
    })
  },

  accheck: function(e){                           //选择审批流程类型的数组下标
    app.mData.proceduresCk = parseInt(e.currentTarget.id.substring(3));
    this.setData({ achecked: app.mData.proceduresCk });
  },

  tabClick: function (e) {                                //点击tab
    this.setData({ pageCk: Number(e.currentTarget.id) });               //点击序号切换
  },

  updatepending: function(isDown){                          //更新数据 ，0上拉刷新，1下拉刷新
    var that=this;
    var pLength = that.data.pClassName.length;
    // var pendings = [
    //   'select * from sengpi where cFlowStep in ("' + app.globalData.user.objectId + '") and dResult<3 and updatedAt<date(?) limit 100 order by +updatedAt',
    //   'select * from sengpi where cFlowStep="' + app.globalData.user.objectId + '" and dResult<3 and updatedAt>date(?) limit 100 order by -updatedAt'
    // ];
    // AV.Query.doCloudQuery(pendings[isDown], [app.mData.proceduresAt[isDown]]).then((datas) => {
    var readProcedure = new AV.Query('sengpi');                                      //进行数据库初始化操作
    readProcedure.containsAll('cManagers',app.globalData.user.objectId)
    if (isDown) {
      readProcedure.greaterThan('updatedAt', app.mData.proceduresAt[1]);          //查询本地最新时间后修改的记录
      readProcedure.ascending('updatedAt');           //按更新时间升序排列
      readProcedure.limit(1000);                      //取最大数量新闻
    } else {
      readProcedure.lessThan('updatedAt', app.mData.proceduresAt[0]);          //查询最后更新时间前修改的记录
      readProcedure.descending('updatedAt');           //按更新时间降序排列
    };
    readProcedure.find().then((results) => {
      let lena = results.length ;
      if (lena>0){
        let aprove = {},uSetData = {}, aPlace = -1;
        if (isDown) {                     //下拉刷新
          app.mData.proceduresAt[1] = results[lena-1].updatedAt;                          //更新本地最新时间
          app.mData.proceduresAt[0] = results[0].updatedAt;                 //更新本地最后更新时间
        } else {
          app.mData.proceduresAt[0] = results[lena - 1].updatedAt;          //更新本地最后更新时间
        };
        results.forEach( (region) =>{
          aprove=region.toJSON();                      //dProcedure为审批流程的序号
          if (isDown) {                               //ats为各类审批流程的ID数组
            aPlace = app.mData.procedures[aprove.dProcedure].indexOf(aprove.objectId)
            if (aPlace >= 0) { app.mData.procedures[aprove.dProcedure].splice(aPlace, 1) }           //删除本地的重复记录列表
            app.mData.procedures[aprove.dProcedure].unshift(aprove.objectId);                   //按流程类别加到管理数组中
          } else {
            app.mData.procedures[aprove.dProcedure].push(aprove.objectId);                   //按流程类别加到管理数组中
          };
          if (aprove.cInstace==aprove.cManagers.length ){   //最后一个节点
            aprove.apState = 2;                 //将流程状态标注为‘已结束’
          } else {
            if (aprove.cFlowStep.indexOf(app.globalData.user.objectId)>=0) {
              aprove.apState = 0;                 //将流程状态标注为‘待我审’
            } else {aprove.apState =1}                 //将流程状态标注为‘已处理’
          }
          app.procedures[aprove.objectId] = aprove;            //pageData是ID为KEY的JSON格式的审批流程数据
          uSetData['pageData.'+aProcedure.objectId] = aprove;                  //增加页面中的新收到数据
        });
        var ats = new Array(3);
        for (let i=0;i<3;i++) {
          for (let j=0;j<pLength;j++){ ats[i][j] = [] };
          for (let j=0;j<pLength;j++){
            app.mData.procedures[j].forEach( mpoId=>{
              ats[app.procdures[mpoId].apState][j].push(mpoId);
            })
          };
          for (let j=0;j<pLength;j++){
            this.data.atotal[i][j] = ats[i][j].length;
          }
        };
        uSetData.ats = ats;
        uSetData.atotal = that.data.atotal
        that.setData( uSetData );
      }
     }).catch( console.error );
  },

  onShow: function() {
    this.updateData(true);
  },
  onPullDownRefresh: function () {
    this.updateData(true);
  },

  onReachBottom: function () {
    this.updateData(false);
  },

  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})
