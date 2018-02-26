//gname为字段名称，p为显示的没字名，t为编辑类型，css为存储和显示类型
//csc对应关系：aslist行业数组选择，存储{code：代码数组，sName:代码对应值的数组}
//csc对应关系：arrsel数组选择，存储{code：选择值，sName:选择对应的值}
//csc对应关系：objsel对象选择，存储gname对应数据表选择的ID值，显示slave对应uName:选择记录的名称，title:选择记录的简介，thumbnail:选择记录的缩略图}
//csc对应关系：specsel对象选择，存储gname对应数据表选择的ID值，显示slave对应要素及carga要素
//csc对应关系：idsel数组选择，存储gname对应数据表选择的ID值，显示选择对应的app.aData[gname][unitId].uName
//csc对应关系：t:"dg"为数据型,csc的digit代表2位小数点浮点数，number则为整数型
module.exports = [
{
  "pNo": 0,
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
{
  "pNo": 1,
  "pName": "厂商文章",
  "afamily": ['商圈人脉','品牌建设','扶持优惠','产品宣传','常见问题'],
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
{
  "pNo": 2,
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
{
  "pNo": 3,
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
{
  "pNo": 4,
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
{
  "pNo": 5,
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
{
  "pNo": 6,
  "pName": "商品",
  "pSuccess": [
    {gname: "uName", p:'名称', t:"h2" },
    {inclose: true, gname:"goodstype", p:'商品类别',t:"sObject",  csc:"objsel" },
    {gname:"title", p:'简介',t:"h3" },
    {gname:"desc", p:'描述',t:"p" },
    {gname:"specstype", p:'规格类型', inclose:false,t:"listsel", aList:['单品','套餐']},
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"tvidio", p:'视频简介',t: "vidio" },
    {gname: "channel", p:'渠道分成比例%',t:"dg",itype:"digit",csc:"mCost"},
    {gname: "extension", p:'推广分成比例%',t:"dg",itype:"digit",csc:"mCost"},
    {gname: "mCost", p:'销售管理总占比', t: "fg"},
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
{
  "pNo": 7,
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
{
  "pNo": 8,
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
{
  "pNo": 9,
  "pName": "原材料与包装",
  "pSuccess": [
    {gname:"uName", p:'材料名称', t:"h3" },
    {gname:"title", p:'材料简述',t:"p" },
    {gname:"dafamily", p:'材料类型',inclose:false,t:"listsel", aList:['自产原料','外购原料','包装'] },
    {gname:"thumbnail", p:'图片',t: "thumb" },
    {gname:"rawStocks", p:'原材料库存', t:"dg",csc:"number" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "material"
},
{
  "pNo": 10,
  "pName": "成品内含原料及包装",
  "pSuccess": [
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"material", p:'材料(包装)', t:"sId",csc:"idsel" },
    {gname:"dOutput", p:'内含数量', t:"dg",csc:"number" },
    {gname:"price", p:'价格预算', t:"dg",csc:"digit"}
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "content"
},
{
  "pNo": 11,
  "pName": "生产计划",
  "pSuccess": [
    {gname:"uName", p:'计划名称', t:"h3" },
    {gname:"cargo", p:'成品', inclose: true,t:"sObject", csc:"objsel" },
    {gname:"title", p:'计划简述',t:"h3" },
    {gname:"dafamily", p:'计划周期',inclose:false,t:"listsel", aList:['3年','每年','半年','每季','每月','每日'] },
    {gname:"thumbnail", p:'图片',t: "thumb" },
    {gname:"dOutput", p:'计划产量', t:"dg",csc:"number" },
    {gname:"rawStart", p:'原材料供应起点时间', t:"datetime" },
    {gname:"packStart", p:'包装加工起点时间', t:"datetime" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "pModel": "prodesign"
},
{
  "pNo": 12,
  "pName": "产品批发",
  "pSuccess": [
    {gname:"product", p:'产品', t:"sId", csc:"idsel" },
    {gname:"uName", p:'批发品名称', t:"h2" },
    {gname:"title", p:'批发品简介',t:"h4" },
    {gname:"thumbnail", p:'图片简介',t: "thumb" },
    {gname:"s_product", p:'外观尺寸重量', t:"arrplus", csc:"arrsel" },
    {gname:"whole_price", p:'零售价', t:"dg",itype:"digit",csc:"digit" },
    {gname:"wholeStock", p:'库存', t:"dg",itype:"number", csc:"canSupply"},
    {gname: "canwholesale", p:'可供销售', t: "fg"}
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "pModel": "wholesale"
}
]
