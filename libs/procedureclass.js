module.exports = [
{
  "pNo": 0,
  "pName": "单位名称和负责人",
  "afamily": ['个体生产者','工农商企业','电商服务点','销售渠道'],
  "pSuccess": [
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", apdclist:require('./apd1.js'), apdvalue:[0, 0, 0] },
    {gname:"nick", p:'单位简称',t:"h3" },
    {gname: "title", p: '单位简介', t: "p"},
    {gname: "desc", p: '单位描述', t: "p"},
    {gname: "thumbnail", p: '图片简介', t: "thumb" },
    {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
    {gname: "address", p: '详细地址', t: "ed"},
    {gname: "licenseNumber", p:'社会信用代码', t: "h3" },
    {gname:"pPhoto", p:'申请人手持身份证的照片',t:"pic", e:'http://ady3cqpl0902fnph-10007535.file.myqcloud.com/667b99d135e2d8fa876d.jpg' },
    {gname:"uPhoto", p:'单位营业执照或个人身份证背面的照片',t:"pic", e:'http://ady3cqpl0902fnph-10007535.file.myqcloud.com/80b1db6d2b4f0a1cc7cf.jpg' }
  ],
  "puRoles": [],
  "pBewrite": "单位负责人提出岗位和单位设置或修改申请，提交单位或个人身份证明文件的照片，由电子商务服务公司进行审批。",
  "suRoles": [
    "32",
    "31"
  ],
  "pModle": "_Role"
},
{
  "pNo": 1,
  "pName": "文章",
  "afamily": ['商圈人脉','品牌建设','政策扶持','产品宣传','帮助问答','我的推介'],
  "pSuccess": [
    {gname:"uName", t:"h1", p:"名称" },
    {gname:"title",t:"h2", p:"标题" },
    {gname:"desc", t:"ap", p:"摘要" },
    {gname:"thumbnail", p: '上传用于缩略图的图片',t: "thumb" },
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
  "pModle": "articles"
},
{
  "pNo": 2,
  "pName": "固定资产登记",
  "pSuccess": [
    {gname: "uName", p:'固定资产名称', t:"h3" },
    {inclose: true, gname:"assetType", p:'固定资产类别',t:"assettype", assclist:require('./ass1.js'), ascvalue:[0, 0, 0] },
    {gname:"title", p:'固定资产简介',t:"p" },
    {gname:"desc", p:'固定资产描述',t:"p", },
    {gname:"aGeoPoint", p:'地理位置',t:"chooseAd" },
    {gname: "address", p: '详细地址', t: "ed"},
    {gname:"thumbnail", p: '图片简介',t: "thumb" },
    {gname:"fcode", p: '二维码编号（请扫描）',t: "tv"  }
  ],
  "pBewrite": "综合条线提出固定资产设置或修改申请，由条线负责人进行审批。",
  "puRoles": [
    "32",
    "31"
  ],
  "sFinallyRole": "32",
  "pModle": "asset"
},
{
  "pNo": 3,
  "pName": "产品服务",
  "afamily":['产品管理','服务管理'],
  "pSuccess": [
    {gname: "uName", p:'名称', t:"h3" },
    {inclose: true, gname:"protype", p:'产品类别',t:"producttype", apdclist:[11301,11302,11303,11304,11305], apdvalue:[0, 0, 0] },
    {gname:"title", p:'简介',t:"p" },
    {gname:"desc", p:'描述',t:"p" },
    {gname:"thumbnail", p:'图片简介',t:"thumb" },
    {gname:"pics", p:'图片集',t:"pics"},
    {gname:"tvidio", p:'视频简介',t: "vidio" },
    {gname: "aGeoPoint", p: '地理位置', t: "chooseAd" },
    {gname: "address", p: '详细地址', t: "ed" },
    { gname:"PARM_content", p:'内容', t:"h4" },
    {gname:"PARM_additive", p:'附加', t:"h4" },
    { gname: "PARM_attention", p:'注意事项', t:"h4" },
    {gname:"PARM_period", p:'期限(天)', t:"dg" },
    {gname:"standard_code", p:'执行标准', t:"h4" },
    {gname:"license_no", p:'许可证号', t:"h4" },
    {gname:"details", p:'详情',t:"eDetail" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "product"
},
{
  "pNo": 4,
  "pName": "团购众筹",
  "afamily":['众筹产品','团购产品'],
  "pSuccess": [
    {gname: "prObjectId", p:'产品服务', inclose: true,t:"sproduct", provalue:[0,0] },
    {gname: "uName", p:'名称', t:"h3" },
    {gname:"title", p:'简介',t:"p" },
    {gname:"thumbnail", p:'图片简介',t: "thumb" },
    {gname:"retail_price", p:'零售价', t:"dg" },
    { gname: "base_price", p:'基础共享优惠', t:"dg" },
    {gname:"base_amount", p:'基础目标数量',t:"dg" },
    { gname: "big_price", p:'大额共享优惠', t:"dg" },
    {gname:"big_amount", p:'大额目标数量',t:"dg" },
    {gname:"start_end", p:'预订', t:"sedate",inclose:true,endif:false},
    {gname:"proportion", p:'占产品总量的比例', t:"dg" }
  ],
  "pBewrite": "产品条线提出服务设置或修改申请，由产品条线负责人进行审批。",
  "puRoles": [
    "12",
    "11"
  ],
  "sFinallyRole": "12",
  "pModle": "shelves"
},
{
  "pNo": 5,
  "pName": "产品上架",
  "pSuccess": [
    {gname: "prObjectId", p:'产品服务', inclose: true,t:"sproduct" },
    {gname:"uName", p:'规格名称', t:"h3" },
    {gname:"title", p:'规格简述',t:"p" },
    {gname:"thumbnail", p:'图片',t: "thumb" },
    {gname:"retail_price", p:'零售价', t:"dg" },
    {gname:"base_amount", p:'小优惠起点', t:"dg" },
    {gname:"base_price", p:'小优惠价格', t:"dg" },
    {gname:"big_amount", p:'大优惠起点', t:"dg" },
    {gname:"big_price", p:'大优惠价格', t:"dg" },
    {gname:"start_end", p:'供应', t:"sedate",inclose:true,endif:false },
    {gname:"proportion", p:'占产品总量的比例', t:"dg" }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "12",
    "31"
  ],
  "sFinallyRole": "32",
  "pModle": "shelves"
},
{
  "pNo": 6,
  "pName": "生产计划",
  "afamily":['3年','每年','半年','每季','每月','每日'],
  "pSuccess": [
    {gname: "prObjectId", p:'产品服务', inclose: true,t:"sproduct" },
    {gname:"uName", p:'计划名称', t:"h3" },
    {gname:"title", p:'计划简述',t:"p" },
    {gname:"thumbnail", p:'图片',t: "thumb" },
    {gname:"assetArr", p:'生产用固定资产', t:"assetarray",inclose:true },
    {gname:"dOutput", p:'计划产量', t:"dg" },
    {gname:"rawStocks", p:'原材料', t:"stockArr",inclose:true },
    {gname:"startTime", p:'起点时间', t:"datetime" },
    {gname:"pPlan", p:['开始点(24时制)','计划进度(%)'], t:"table",inclose:true }
  ],
  "pBewrite": "产品条线提出产品设置或修改申请，由营销条线负责人进行审批。",
  "puRoles": [
    "11",
    "10"
  ],
  "sFinallyRole": "11",
  "pModle": "prodesign"
}
]
