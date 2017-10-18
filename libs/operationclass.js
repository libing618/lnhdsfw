module.exports = [
  {
    "oNo": 0,
    "oName": "原料采供",
    "oprocess": ['采购计划', '原料采购', '原料入库'],
    "oSuccess": [
      {gname: "uName", p:'名称', t:"h3" },
      {inclose: true, gname:"protype", p:'产品类别',t:"producttype", apdclist:[11301,11302,11303,11304,11305], apdvalue:[0, 0, 0] },
      { gname: "thumbnail", p: '图片', t: "thumb" },
      { gname: "sUnit", p: '供货商', t: "h3", e: '单位名称' }
    ],
    "ouRoles": [1,0,0],
    "oBewrite": "产品条线确认采购计划,综合条线采购原料并入库。",
    "oModle": "rawOperate"
  },
  {
    "oNo": 1,
    "oName": "订单处理",
    "oprocess": ['订单确认', '制造成品', '成品出货', '店铺确认'],
    "oSuccess": [
      { gname: "prepayId", t: "ords", p: "付款订单号" },
      { gname: "proObjectId", t: "products", p: "产品规格" },
      { gname: "serObjectId", t: "sivers", p: "服务规格" },
      { gname: "addressObjectId", t: "adds", p: "地点" }
    ],
    "ouRoles": [0,1,1,3],
    "oBewrite": "综合条线确认订单,产品条线制造成品并出货,服务条线进行店铺确认。",
    "oModle": "orderOperate"
  }
]
