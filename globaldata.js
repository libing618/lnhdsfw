module.exports={
  roleData:{
    user: {                                     //用户的原始定义
      "userRolName": "0",
      "unit": "0",
      "city": "Taiyuan",
      "uName": "",
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
      "sjid": "59f08fbb67f356004449a4a4",
      "channelid": "59f08fbb67f356004449a4a4",
      "objectId": "0"
    },
    wmenu: {
      manage:[],                         //用户未注册时的基础菜单
      marketing:[],
      customer:[],
      updatedAt: 0
    },
    uUnit:{updatedAt: 0},                           //用户单位信息（若有）
    sUnit:{updatedAt: 0}                           //上级单位信息（若有）
  },
  configData:{
    articles: { cfield: 'afamily', fConfig: [0, 1, 3] },
    goods: { updatedAt: new Date(0).toISOString() },
    sjid: '59f08fbb67f356004449a4a4',
    channelid: "59f08fbb67f356004449a4a4",
    tiringRoom: false
  },
  mData: {
    proceduresAt:[                                //缓存中流程更新时间
      new Date(0),                          //最早更新时间
      new Date(0)                          //目前记录时间
    ],
    articles: [[], [], [], [], []],              //已发布文章分类缓存数组
    pCk1: 1,            //已发布文章分类阅读选中序号
    pCk8: 1,            //已发布团购众筹分类阅读选中序号
    asset: [],              //已发布固定资产缓存数组
    product: [],              //已发布产品分类缓存数组
    service: [],              //已发布服务分类缓存数组
    cargo: [],              //已发布成品分类缓存数组
    goods: [],              //已发布商品分类缓存数组
    specs: [],              //已发布规格分类缓存数组
    promotion: [[],[], []],              //已发布团购众筹分类缓存数组
    prodesign: [],              //已发布生产计划缓存数组
    order: [],
    orderlist: [],
    procedures: {},              //流程分类缓存数组
    proceduresCk: -1,
    pAt:{}
  },
  aData:{"articles":{},"asset":{},"product":{},"service":{},"cargo":{},"goods":{},"specs":{},"promotion":{},"manufactor":{},"artshop":{},"proUnit":{},order:{},orderlist:{}}
}
