//gname为字段名称，p为显示的没字名，t为编辑类型，css为存储和显示类型
//csc对应关系：aslist行业数组选择，存储{code：代码数组，sName:代码对应值的数组}
//csc对应关系：arrsel数组选择，存储{code：选择值，sName:选择对应的值}
//csc对应关系：objsel对象选择，存储gname对应数据表选择的ID值，显示slave对应uName:选择记录的名称，title:选择记录的简介，thumbnail:选择记录的缩略图}
//csc对应关系：specsel对象选择，存储gname对应数据表选择的ID值，显示slave对应要素及carga要素
//csc对应关系：idsel数组选择，存储gname对应数据表选择的ID值，显示选择对应的app.aData[gname].uName
//csc对应关系：t:"dg"为数据型,csc的digit代表2位小数点浮点数，number则为整数型
module.exports = {
"manufactor":{
  "pName": "厂商信息",
  "pSuccess": [
    {gname:"afamily", p:'厂商类型', inclose:false,t:"listsel", aList:['产品制造人','物流服务人','电商服务站','生产厂家','电子商务企业']},
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", csc:"aslist" },
    {gname:"nick", p:'厂商简称',t:"h3" },
    {gname: "title", p:'厂商简介', t:"h3"},
    {gname: "desc", p: '厂商描述', t: "p"},
    {gname: "thumbnail", p: '图片简介', t: "thumb" },
    {gname: "aGeoPoint", p: '地理位置', t: "chooseAd" },
    { gname: "address", p: '地址', t: "modalEditAddress"}
  ],
  "pBewrite": "单位负责人提出岗位和单位设置或修改申请，提交单位或个人身份证明文件的照片，由电子商务服务公司进行审批。"
},
"articles":{
  "pName": "厂商文章",
  "afamily": ['公告公示','品牌建设','扶持优惠','产品宣传','常见问题'],
  "pSuccess": [
    {gname:"title",t:"h2", p:"标题" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"desc", t:"p", p:"摘要" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "编写各类文章，经单位领导审批后发布。个人编写的此类文章由所属服务机构审批。"
},
"asset":{
  "pName": "厂商生产设备溯源",
  "pSuccess": [
    {inclose:true, gname:"assetType", p:'固定资产类别',t:"assettype", csc:"arrsel"},
    {gname:"title", p:'固定资产简介',t:"h3" },
    {gname:"desc", p:'固定资产描述',t:"p" },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    { gname: "address", p: '详细地址', t: "modalEditAddress"},
    {gname:"thumbnail", p: '图片简介',t: "thumb" },
    {gname:"fcode", p: '编号',t: "inScan"  }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。"
},
"product":{
  "pName": "产品",
  "pSuccess": [
    {inclose: true, gname:"protype", p:'产品类别',t:"producttype",  csc:"arrsel" },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"aGeoPoint", p:'出厂位置', t: "chooseAd" },
    { gname: "address", p: '产地', t: "modalEditAddress" },
    {gname:"PARM_content", p:'内容', t:"h4" },
    {gname:"PARM_additive", p:'附加', t:"h4" },
    {gname:"PARM_attention", p:'注意事项', t:"h4" },
    {gname:"PARM_period", p:'期限(天)', t:"dg",csc:"digit" },
    {gname:"standard_code", p:'执行标准', t:"h4" },
    {gname:"license_no", p:'许可证号', t:"h4" },
    {gname:"surface", p:'外观范围', t:"arrList",inclose:true },
    {gname:"size", p:'尺寸范围', t:"arrList",inclose:true },
    {gname:"weight", p:'重量范围', t:"arrList",inclose:true }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。"
},
"service":{
  "pName": "服务",
  "pSuccess": [
    {gname:"serFamily", p:'服务类型', inclose: true, t:"producttype",  csc:"arrsel"},
    {gname:"title", p:'简介',t:"h4" },
    {gname:"aGeoPoint", p: '服务地位置', t: "chooseAd" },
    { gname: "address", p: '服务地址', t: "modalEditAddress" },
    {gname:"price", p:'价格', t:"dg",csc:"digit" },
    {gname:"serParty", p:'服务方', t:"h4" },
    {gname:"serName", p:'联系人姓名', t:"h4" },
    {gname:"serPhone", p:'联系人电话', t:"h4" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。"
},
"cargo":{
  "pName": "成品",
  "pSuccess": [
    {gname:"product", p:'产品', t:"sId", csc:"idsel" },
    {gname:"title", p:'成品简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t: "thumb" },
    {gname:"content", p:'内含物', t:"content", csc:"arrsel" },
    {gname:"s_product", p:'外观尺寸重量', t:"arrplus", csc:"arrsel" },
    {gname:"retail_price", p:'零售价', t:"dg",itype:"digit",csc:"digit" }
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。"
},
"goods":{
  "pName": "商品",
  "pSuccess": [
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"title", p:'简介',t:"h2" },
    {gname:"tvidio", p:'',t: "vidio" },
    {gname:"desc", p:'',t:"p" },
    {gname:"specstype", p:'规格',t:"specsel",csc:"specsel" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "产品条线提出商品设置或修改申请，由产品条线负责人进行审批。"
},
"specs":{
  "pName": "商品规格",
  "pSuccess": [
    {gname:"goods", p:'商品', t:"sId", csc:"idsel" },
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"serFamily", p:'服务类型', inclose:false,t:"listsel", aList:['快递送货','货运自提','柜台提货','店铺消费'] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"package", p:'含成品数量', t:"dg",csc:"number" },
    {gname:"price", p:'零售价', t:"dg",csc:"digit" }
  ],
  "pBewrite": "产品条线提出商品规格设置或修改申请，由产品条线负责人进行审批。"
},
"promotion":{
  "pName": "众筹团购及促销",
  "afamily":['众筹','团购','促销'],
  "pSuccess": [
    {gname:"specs", p:'商品规格', t:"sId", csc:"idsel" },
    {gname:"base_price", p:'基础优惠价', t:"dg",csc:"digit" },
    {gname:"base_amount", p:'基础目标数量',t:"dg",csc:"number" },
    {gname:"big_price", p:'大额优惠价', t:"dg",csc:"digit" },
    {gname:"big_amount", p:'大额目标数量',t:"dg",csc:"number" },
    {gname:"start_end", p:'活动起止日期', t:"sedate",endif:false}
  ],
  "pBewrite": "产品条线提出促销活动设置或修改申请，由营销条线负责人进行审批。"
},
"artshop":{
  "pName": "店铺文章",
  "afamily": ['我的推介','营销经验','常见问题'],
  "pSuccess": [
    {gname:"title",t:"h2", p:"标题" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"desc", t:"p", p:"摘要" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "puRoles": [
    "20",
    "admin"
  ],
  "pBewrite": "编写各类文章，经单位领导审批后发布。个人编写的此类文章由所属服务机构审批。"
},
"order": {
  "pName": "订单处理",
  "afamily": ['订单确认', '订单取消', '付款确认', '要求发货'],
  "pSuccess": [
    {gname:"cart", p:'购买商品',t:"sCart", csc:"objArr" },
    { gname: "thumbnail", p: '图片', t: "thumb" },
    { gname: "title", p: '内容', t: "h3"},
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity'] },
    { indexField: 'address', sumField: ['deliverTotal'] },
    { indexField: 'address', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1, 1, 3],
  "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
  "oModel": "orderlist"
},
"orderlist":{
  "pName": "订单成交",
  "afamily": ['付款确认', '要求发货', '待清冻结', '退货还款', '清算结束'],
  "pSuccess": [
    {gname:"cart", p:'购买商品',t:"sCart", csc:"objArr" },
    {gname:"order", p:'订单',t:"sObject", csc:"objsel" },
    { gname: "thumbnail", p: '图片', t: "thumb" },
    { gname: "title", p: '内容', t: "h3"},
    { gname: "_User", p: '付款人', t:"sObject", csc:"objsel"}
  ],
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity']},
    { indexField: 'address', sumField: ['deliverTotal'] },
    { indexField: 'address', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1,1,3],
  "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
  "oModel": "cargoSupplies"
},
"cargoSupplies":{
  "pName": "成品供货",
  "afamily": ['供货订单', '供货确认', '成品出货', '到货确认'],
  "pSuccess": [
    {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
    {gname:"unitPrice", p:'成交单价:',t:"dg",csc:"digit" },
    {gname:"suppliesQuantity", p:'供货数量:',t:"dg",csc:"number" },
    {gname:"suppliesPrice", p:'供货价格:',t:"dg",csc:"number" },
    {gname:"serFamily", p:'服务类型', inclose:false,t:"listsel", aList:['快递送货','货运自提','柜台提货','店铺消费'] },
    {gname:"specs", p:'规格',t:"specsel",csc:"specsel" },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname: "address", p: '收货地址', t: "modalEditAddress"},
    {gname:"order", p:'订单',t:"sOrder", csc:"objsel" },
    {gname:"returnQuantity", p:'退货数量:',t:"dg",csc:"number" },
    { gname: "unitId", p: '厂商', t:"sId", csc:"idsel" },
    { gname: "deliverArr", p: '发货单', t: "sDeliver" }
  ],
  "puRoles": [1,1,3],
  "pBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。"
},
"unfinishedorder":{
  "pName": "店铺优惠",
  "pSuccess": [
    {gname:"order", p:'订单',t:"sObject", csc:"objsel" },
    {gname:"amount", p:'订单总金额:',t:"dg",csc:"digit" },
    {gname:"sale", p:'优惠金额:',t:"dg",csc:"digit"}
  ],
  "pBewrite": "店铺所有成员均可通过会话接受客户的优惠申请，直接写入优惠表。"
},
"returns":{
  "pName": "退回厂家",
  "pSuccess": [
    {gname:"cargoSupplies", p:'供货成品:',t:"sObject", csc:"objsel" },
    {gname:"unitPrice", p:'单价:',t:"dg",csc:"digit" },
    {gname:"returnQuantity", p:'数量:',t:"dg",csc:"number" },
    {gname:"returnPrice", p:'退货价格:',t:"dg",csc:"digit" },
    {gname:"orderlist", p:'订单',t:"sObject", csc:"objsel" },
    {gname:"returns", p:'退货单号:',t:"inScan"},
    {gname:"returnAmount", p:'退货金额:',t:"dg",csc:"digit" },
    {gname:"invoice", p:'重发货单号:',t:"inScan" }
  ],
  "pBewrite": "店铺所有成员均可通过会话接受客户的退货申请，直接写入退货表。"
},
"evaluates":{
  "pName": "客户评价",
  "afamily": ['好评','差评'],
  "pSuccess": [
    {gname:"cargoSupplies", p:'供货成品:',t:"sObject", csc:"objsel" },
    {gname:"specsName", p:'规格名称',t:"h3" },
    { gname: "unitId", p: '厂商', t:"sId", csc:"idsel" },
    {gname:"order", p:'订单',t:"sObject", csc:"objsel" },
    { gname: "thumbnail", p: '图片', t: "thumb" },
    { gname: "title", p: '标题', t: "h3"},
    {gname:"desc", t:"p", p:"内容" }
  ],
  "pBewrite": "消费者对成品进行评价，直接写入客户评价表。"
},
"distribution":{
  "pName": "分红付账",
  "pSuccess": [
    {gname:"orderlist", p:'订单',t:"sObject", csc:"objsel" },
    {gname:"cargoSupplies", p:'成品',t:"sObject", csc:"objsel" },
    {gname:"amount", p:'订单金额',t:"dg",csc:"digit" },
    {gname:"income", p:'分红金额',t:"dg",csc:"digit" }
  ],
  "pBewrite": "系统在交易清算后自动进行分红、付产品款、付信息服务费等结算。"
}
}
