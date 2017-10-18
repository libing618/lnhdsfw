module.exports={
  globalData:{
    user: {                                     //用户的原始定义
      "userRolName": "0",
      "unit": "0",
      "city": "Taiyuan",
      "uName": "0",
      "emailVerified": false,
      "nickName": "游客",
      "language": "zh_CN",
      "gender": 1,
      "province": "Shanxi",
      "avatarUrl": "../../images/index.png",
      "country": "CN",
      "userAuthorize": -1,
      "authData": {},
      "mobilePhoneVerified": false,
      "objectId": "0"},
    sysinfo: null
  },
  tabBar: [
    {pName: 'shops',cName: '商城'},
    {pName: 'index',cName: '管理'},
    {pName: 'production',cName: '生产'},
    {pName: 'marketing',cName: '营销'},
    {pName: 'customer',cName: '客服'}
  ],
  mData: {
    pAt1 :[                                //缓存中已发布文章更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt2 :[                                //缓存中已发布固定资产更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt3 :[                                //缓存中已发布产品服务更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    pAt4 :[                                //缓存中已发布团购众筹更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    proceduresAt:[                                //缓存中流程更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    prdct1: [[], [], [], [], [] ],              //已发布文章分类缓存数组
    pCk1: 1,            //已发布文章分类阅读选中序号
    pCk3: 1,            //已发布产品服务分类阅读选中序号
    pCk4: 1,            //已发布产品服务分类阅读选中序号
    prdct2: [],              //已发布固定资产缓存数组
    prdct3: [[], []],              //已发布产品服务分类缓存数组
    prdct4: [[], []],              //已发布团购众筹分类缓存数组
    prdct5: [],              //已发布固定资产缓存数组
    procedures: [],              //流程分类缓存数组
    proceduresCk: -1,
    oAt0:new Date(0),                                //缓存中已销售产品数据更新时间
    oAt1:new Date(0),                                //缓存中客户评价数据更新时间
    oCk0: 0,            //原料操作分类阅读选中序号
    oped0: [],              //已销售产品缓存数组
    oped1: [],              //已发布客户评价缓存数组
  }
}
