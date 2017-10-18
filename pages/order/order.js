// 订单操作
const AV = require('../../libs/leancloud-storage.js');
const prosPlan = require('../../model/prosplan.js');
const Orders = require('../../model/orders.js');
const remove = value => {
  stats = this.data.pageData.filter(target => target.id !== value.id)
  return setOrderData(stats)
};
const upsert = value => {
  let existed = false;
  stats = this.data.pageData.map(target => (target.id === value.id ? ((existed = true), value) : target))
  if (!existed) stats = [value, ...stats]
  return setOrderData(stats)
};
const setOrderData = untreatedOrders =>{
  let inArr = [];
  let mpage = untreatedOrders.map(uOrder=>{
    if (inArr.indexOf(uOrder[this.data.req.gname])<0) { inArr.push(uOrder[this.data.req.gname])};
    return uOrder.tradeId;
  });
  new AV.Query(prosPlan).find().then((plans)=>{
    let prosdata={};
    plans.forEach(plan=>{ prosdata[plan.proObjectId] = plan})
    this.setData({
      pageData: untreatedOrders,
      pros: prosdata,
      mPage: mpage
    });
  }).catch(console.error);
  return untreatedOrders;
};
var app = getApp();
Page ({
  data: {
    oState: 0,                       //流程的序号
    mPage: [],                 //页面管理数组
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    pageData: []
  },

  onLoad: function (ops) {        //传入参数为pNo,不得为空06
    var that = this;
    let oClass = require('../../libs/operationclass.js')[1];
    if (weutil.checkRols(app.globalData.user.userRolName,oClass.ouRoles[ops.oState])){  //检查用户操作权限
      that.setData({
        oState: ops.oState,
        req: oClass.oSuccess[ops.oState],
        oArray: inArr     //确定数组分类字段
      });
      wx.setNavigationBarTitle({
        title: app.uUnit.nick+'的'+oClass.oprocess[ops.oState]
      });
      let orderQuery = new AV.Query('orders')
                        .equalTo('oState', ops.oState)      //查询订单表里没确认的记录
                        .ascending('createdAt');
      return Promise.all([orderQuery.find().then(setOrderData),orderQuery.subscribe()]).then((untreatedOrders,subscription) => {
        that.subscription = subscription;
        that.subscription.on('create', upsert)
        that.subscription.on('update', upsert)
        that.subscription.on('enter', upsert)
        that.subscription.on('leave', remove)
        that.subscription.on('delete', remove)
      }).catch(console.error);
    } else {
      wx.showToast({ title: '权限不足，请检查！', duration: 2500 });
      setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);
    };
  },
  onUnload: function(){
    this.subscription.unsubscribe();
    this.subscription.off('create', upsert)
    this.subscription.off('update', upsert)
    this.subscription.off('enter', upsert)
    this.subscription.off('leave', remove)
    this.subscription.off('delete', remove)
  },

  accheck: require('../../util/util.js').accheck,

  fOrder: function(e){
    var that = this;
    wx.scanCode({
      success: function(resCode){
        that.setData({sc:resCode.result});
      }
    })
  },

  onShareAppMessage: function () {    // 用户点击右上角分享
    return {
      title: '侠客岛创业服务平台', // 分享标题
      desc: '扶贫济困，共享良品。', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  }
})
