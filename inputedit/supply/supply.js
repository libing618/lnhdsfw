// 供货操作
const AV = require('../../libs/leancloud-storage.js');
const supplies = require('../../model/supplies.js');
const oClass = require('../../model/operationclass.js')[2];
const { checkRols,indexClick,binddata } = require('../../util/util.js');

var app = getApp();
Page ({
  data: {
    oState: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: [],
    iClicked: '0',
    reqData:[{gname:"nowPacking", p: '出品包装号',t: "inScan",n:0}]
  },
  subscription: {},
  indexField:'',      //定义索引字段
  sumField:'',          //定义汇总字段

  fetchData: function(oState) {
    var that = this;
    let supplieQuery = new AV.Query(supplies);
    supplieQuery.select(['tradeId','quantity','proName','cargo','cargoName','address','paidAt'])
    supplieQuery.ascending('paidAt');           //按付款时间升序排列
    switch (oState){
      case 0:
        supplieQuery.edoesNotExist('confirmer');      //查询确认人为空的记录
        break;
      case 1:
        supplieQuery.notEqualTo('quantity','deliverTotal');      //查询发货量不等于订单的记录
        break;
      case 2:
        supplieQuery.notEqualTo('quantity','receiptTotal');      //查询到货不等于订单的记录
        supplieQuery.greaterThan('serFamily',1);
        break;
    }
    supplieQuery.equalTo('unitId',app.roleData.uUnit.objectId);                //只能查本单位数据
    supplieQuery.limit(1000);                      //取最大数量
    const setReqData = this.setReqData.bind(this);
    return Promise.all([supplieQuery.find().then(setReqData), supplieQuery.subscribe()]).then( ([reqData,subscription])=> {
      this.subscription = subscription;
      if (this.unbind) this.unbind();
      this.unbind = binddata(subscription, arp, setReqData);
    }).catch(console.error)
  },

  setReqData: function(readData){
    let pageData = {}, mPage = {}, indexList = [], aPlace = -1, iField, iSum = {}, mChecked = {},qCount = {};
    readData.forEach(onedata => {
      pageData[onedata.id] = onedata;
      iField = onedata.get(this.indexField);                  //索引字段读数据数组
      if (indexList.indexOf(iField)<0) {
        indexList.push(iField);
        mPage[iField] = [onedata.id];                   //分类ID数组增加对应ID
        iSum[iField] = onedata.get(this.sumField);
        qCount[iField] = onedata.get('quantity');
      } else {
        iSum[iField] += onedata.get(this.sumField);
        qCount[iField] += onedata.get('quantity');
        mPage[iField].push(onedata.id);
      };
      mChecked[onedata.id] = this.data.oState==0 ? true : false;
    });
    this.setData({indexList,pageData,mPage,iSum,mChecked}) ;
  },

  onLoad: function (ops) {        //传入参数为oState,不得为空
    var that = this;
    if (checkRols(oClass.ouRoles[ops.oState])){  //检查用户操作权限
      that.indexField = oClass.oSuccess[ops.oState].indexField;
      that.sumField = oClass.oSuccess[ops.oState].sumField;
      integration('cargo',app.roleData.uUnit.objectId).then(isupdated=>{
        that.setData({cargo:app.aData.cargo[app.roleData.uUnit.objectId]});
        that.fetchData.bind(that) ;
        wx.setNavigationBarTitle({
          title: app.roleData.uUnit.nick + '的' + oClass.oprocess[ops.oState]
        });
      }).catch( ()=>{
        wx.showToast({ title: '无库存数据！', duration: 2500 });
        setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
      });
    };
  },

  onUnload: function(){
    this.subscription.unsubscribe();
    this.unbind();
  },

  i_inScan: require('../import/impedit.js').i_inScan,

  fSupplies: function(e){
    var that = this;
    let cargoId = e.currentTarget.id;
    let confimate = that.data.quantity[cargoId];
    let subIds = Object.keys(e.detail.value);
    let subSuppli = subIds.map(subKey=>{return that.data.pageData[subKey.substring(7)]})
    let setSingle = [];               //定义成品对象的库存数据
//    return AV.Object.createWithouData('cargo',cargoId)
    that.cargoPlans[cargoId].set({
      'cargoStock':that.cargoPlans[cargoId].cargoStock-confimate,
      'payment':that.cargoPlans[cargoId].payment-confimate,
      'delivering': that.cargoPlans[cargoId].delivering + confimate })
    .save().then(savecargo=>{
      let sd = {};
      sd.cargoCount[cargoId] = that.cargoPlans[cargoId].cargoStock;
      that.setData(sd);
      return AV.Object.saveAll(subSuppli)
    }).then(saveSuppli=>{

    })
  },

  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/index/manage/manage' // 分享路径
    }
  }
})
