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
    {gname:"uName", p:"厂商名称", t:"h1" },
    {gname:"afamily", p:'厂商类型', inclose:false,t:"listsel", aList:['产品制造人','物流服务人','电商服务站','生产厂家','电子商务企业']},
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", csc:"aslist" },
    {gname:"nick", p:'厂商简称',t:"h2" },
    {gname: "title", p:'厂商简介', t:"h3"},
    {gname: "desc", p: '厂商描述', t: "p"},
    {gname: "thumbnail", p: '厂商简介', t: "thumb" },
    {gname: "aGeoPoint", p: '地理位置', t: "chooseAd" },
    {gname: "address", p: '地址', t: "ed"},
    {gname: "adminPhone", p:'负责人手机号', t: "h3" },
    {gname: "agreement", p:'招募说明',t: "p" }
  ],
  "puRoles": [],
  "pBewrite": "单位负责人提出岗位和单位设置或修改申请，提交单位或个人身份证明文件的照片，由电子商务服务公司进行审批。",
  "suRoles": [
    "32",
    "31"
  ],
  "pModel": "manufactor"
},
"articles":{
  "pName": "厂商文章",
  "afamily": ['公告公示','品牌建设','扶持优惠','产品宣传','常见问题'],
  "pSuccess": [
    {gname:"uName", t:"h1", p:"名称" },
    {gname:"title",t:"h2", p:"标题" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"desc", t:"p", p:"摘要" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "puRoles": [
    "20",
    "admin"
  ],
  "pBewrite": "编写各类文章，经单位领导审批后发布。个人编写的此类文章由所属服务机构审批。",
  "suRoles": [
    "21",
    "20"
  ],
  "pModel": "articles"
},
"asset":{
  "pName": "厂商生产设备溯源",
  "pSuccess": [
    {gname:"uName", p:'固定资产名称', t:"h2" },
    {inclose:true, gname:"assetType", p:'固定资产类别',t:"assettype", csc:"arrsel"},
    {gname:"title", p:'固定资产简介',t:"h3" },
    {gname:"desc", p:'固定资产描述',t:"p" },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    {gname:"address", p: '详细地址', t: "ed"},
    {gname:"thumbnail", p: '图片简介',t: "thumb" },
    {gname:"fcode", p: '编号',t: "inScan"  }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。",
  "puRoles": [
    "32",
    "31"
  ],
  "pModel": "asset"
},
"product":{
  "pName": "产品",
  "pSuccess": [
    {gname: "uName", p:'名称', t:"h2" },
    {inclose: true, gname:"protype", p:'产品类别',t:"producttype",  csc:"arrsel" },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"aGeoPoint", p:'出厂位置', t: "chooseAd" },
    {gname:"address", p:'产地', t: "ed" },
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
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "product"
},
"service":{
  "pName": "服务",
  "pSuccess": [
    {gname:"uName", p:'名称', t:"h2" },
    {gname:"serFamily", p:'服务类型', inclose: true, t:"producttype",  csc:"arrsel"},
    {gname:"title", p:'简介',t:"h4" },
    {gname:"aGeoPoint", p: '服务地位置', t: "chooseAd" },
    {gname:"address", p: '服务地址', t: "ed" },
    {gname:"price", p:'价格', t:"dg",csc:"digit" },
    {gname:"serParty", p:'服务方', t:"h4" },
    {gname:"serName", p:'联系人姓名', t:"h4" },
    {gname:"serPhone", p:'联系人电话', t:"h4" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "service"
},
"cargo":{
  "pName": "成品",
  "pSuccess": [
    {gname:"product", p:'产品', t:"sId", csc:"idsel" },
    {gname:"uName", p:'成品名称', t:"h2" },
    {gname:"title", p:'成品简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t: "thumb" },
    {gname:"s_product", p:'外观尺寸重量', t:"arrplus", csc:"arrsel" },
    {gname:"retail_price", p:'零售价', t:"dg",itype:"digit",csc:"digit" },
    {gname:"cargoStock", p:'库存', t:"dg",itype:"number", csc:"canSupply"},
    {gname: "canSupply", p:'可供销售', t: "fg"}
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "cargo"
},
"goods":{
  "pName": "商品",
  "pSuccess": [
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"uName", p:'名称', t:"h1" },
    {gname:"title", p:'简介',t:"h2" },
    {gname:"tvidio", p:'',t: "vidio" },
    {gname:"desc", p:'',t:"p" },
    {gname:"goodsprice", p:'价格', t:"price"},
    {gname:"specs", p:'规格',t:"specsel",csc:"specsel" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "suRoles": ["12"],
  "pModel": "goods"
},
"specs":{
  "pName": "商品规格",
  "pSuccess": [
    {gname:"goods", p:'商品', t:"sId", csc:"idsel" },
    {gname:"uName", p:'名称', t:"h3" },
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"serFamily", p:'服务类型', inclose:false,t:"listsel", aList:['快递送货','货运自提','柜台提货','店铺消费'] },
    {gname:"title", p:'简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"package", p:'含成品数量', t:"dg",csc:"number" },
    {gname:"price", p:'零售价', t:"dg",csc:"digit" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "specs"
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
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "12",
    "31"
  ],
  "pModel": "promotion"
},
"artshop":{
  "pName": "店铺文章",
  "afamily": ['产品课堂','营销课堂','常见问题'],
  "pSuccess": [
    {gname:"uName", t:"h1", p:"名称" },
    {gname:"title",t:"h2", p:"标题" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"desc", t:"p", p:"摘要" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "puRoles": [
    "20",
    "admin"
  ],
  "pBewrite": "编写各类文章，经单位领导审批后发布。个人编写的此类文章由所属服务机构审批。",
  "suRoles": [
    "21",
    "20"
  ],
  "pModel": "artshop"
},
"recommend":{
  "pName": "推荐文章",
  "pSuccess": [
    {gname:"uName", t:"h1", p:"名称" },
    {gname:"title",t:"h2", p:"标题" },
    {gname:"userId", t:"h3", p:"作者", csc:"objsel" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
    {gname:"desc", t:"p", p:"摘要" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "puRoles": [
    "20",
    "admin"
  ],
  "pBewrite": "编写推荐文章，经单位领导审批后发布。",
  "suRoles": [
    "21",
    "20"
  ],
  "pModel": "artshop"
},
"order": {
  "pName": "订单处理",
  "oprocess": ['订单确认', '成品出货', '到货确认'],
  "pSuccess": [
    { gname: "uName", p: '成品名称', t: "h3" },
    { gname: "cargo", p: '成品', t: "sObject", csc: "objsel" },
    { gname: "thumbnail", p: '图片', t: "thumb" },
    { gname: "vUnit", p: '物流商', t: "h3", e: '单位名称' },
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "pModel": "Order",
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity'] },
    { indexField: 'address', sumField: ['deliverTotal'] },
    { indexField: 'address', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1, 1, 3],
  "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
  "oModel": "supplies"
},
"orderlist":{
  "pName": "订单处理",
  "oprocess": ['订单确认', '成品出货', '到货确认'],
  "pSuccess": [
    {gname: "uName", p:'成品名称', t:"h3" },
    {gname:"cargo", p:'成品',t:"sObject", csc:"objsel" },
    { gname: "thumbnail", p: '图片', t: "thumb" },
    { gname: "vUnit", p: '物流商', t: "h3", e: '单位名称' },
    { gname: "signUser", p: '签收人', t: "h3", e: '签收人名称' }
  ],
  "pModel": "orderlist",
  "oSuccess": [
    { indexField: 'cargo', sumField: ['quantity']},
    { indexField: 'address', sumField: ['deliverTotal'] },
    { indexField: 'address', sumField: ['receiptTotal'] }
  ],
  "ouRoles": [1,1,3],
  "oBewrite": "产品条线确认订单并出货,服务条线进行店铺确认。",
  "oModel": "supplies"
},

"proUnit":{
  "pName": "厂商签约",
  "pSuccess": [
    {gname:"uName", p:'厂商名称', t:"h2" },
    {inclose:true, gname:"unitId", p:'厂商代码',t:"fd"},
    {gname:"title", p:'厂商简介',t:"h3" },
    {gname:"desc", p:'厂商描述',t:"p" },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    {gname:"address", p: '详细地址', t: "ed"},
    {gname:"thumbnail", p: '图片简介',t: "thumb" },
    {gname:"fcode", p: '编号',t: "inScan"  }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。",
  "puRoles": [
    "32",
    "31"
  ],
  "pModel": "proUnit"
}
}
