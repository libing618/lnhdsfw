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
  },
  {
    "pNo": 3,
    "pName": "计划调度",
    "pSuccess": [
      {gname: "proObjectId", t: "products", p: "产品规格" },
      {gname:"dOutput", p:'计划产量', t:"dg" },
      {gname:"dOutput", p:'可供应量', t:"dg" },
      {gname:"dOutput", p:'当前库存量', t:"dg" },
      {gname:"dOutput", p:'预订未收款', t:"dg" },
      {gname:"dOutput", p:'收单未发货', t:"dg" },
      {gname:"dOutput", p:'运送过程中', t:"dg" },
      {gname:"dOutput", p:'退货数量', t:"dg" },
      {gname:"dOutput", p:'成功交易量', t:"dg" }
    ],
    "ouRoles": [1],
    "pBewrite": "产品条线提出产品规格设置或修改申请，由营销条线负责人进行审批。",
    "puRoles": [
      "11",
      "10"
    ],
    "sFinallyRole": "11",
    "pModle": "prodesign"
  }
]
