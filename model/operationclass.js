module.exports = [
  {
    "oNo": 0,
    "oName": "原料采供",
    "oprocess": ['采供下单', '原料供应', '原料入库'],
    "pSuccess": [
      {gname: "uName", p:'原料名称', t:"h3" },
      {gname:"material", p:'原料(包装)', t:"sId",csc:"idsel" },
      { gname: "thumbnail", p: '图片', t: "thumb" },
      { gname: "vUnit", p: '供货商', t: "h3", e: '单位名称' },
      { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
    ],
    "pModel": "rawStock",
    "oSuccess": [
      { indexField: 'cargo', sumField: ['quantity']},
      { indexField: 'material', sumField: ['deliverTotal'] },
      { indexField: 'material', sumField: ['receiptTotal'] }
    ],
    "ouRoles": [1,0,0],
    "oBewrite": "产品条线确认采购计划,综合条线采购原料并入库。",
    "oModel": "rawOperate"
  },
  {
    "oNo": 1,
    "oName": "加工入库",
    "oprocess": ['安排生产', '生产加工', '成品入库'],
    "pSuccess": [
      {gname: "uName", p:'成品名称', t:"h3" },
      {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
      { gname: "thumbnail", p: '图片', t: "thumb" },
      { gname: "vUnit", p: '加工商', t: "h3", e: '单位名称' },
      { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
    ],
    "pModel": "packing",
    "oSuccess": [
      { indexField: 'cargo', sumField: ['quantity']},
      { indexField: 'cargo', sumField: ['deliverTotal'] },
      { indexField: 'cargo', sumField: ['receiptTotal'] }
    ],
    "ouRoles": [1,1,0],
    "oBewrite": "产品条线确认出品计划,产品条线包装并入库。",
    "oModel": "packOperate"
  },
  {
    "oNo": 2,
    "oName": "订单处理",
    "oprocess": ['订单确认', '成品出货', '到货确认'],
    "pSuccess": [
      {gname: "uName", p:'成品名称', t:"h3" },
      {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
      { gname: "thumbnail", p: '图片', t: "thumb" },
      { gname: "vUnit", p: '物流商', t: "h3", e: '单位名称' },
      { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
    ],
    "pModel": "order",
    "oSuccess": [
      { indexField: 'cargo', sumField: ['quantity']},
      { indexField: 'address', sumField: ['deliverTotal'] },
      { indexField: 'address', sumField: ['receiptTotal'] }
    ],
    "ouRoles": [1,1,3],
    "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
    "oModel": "supplies"
  }

]
