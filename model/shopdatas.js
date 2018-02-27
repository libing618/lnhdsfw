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
  "pName": "单位名称和负责人",
  "afamily": ['产品制造人','物流服务人','电商服务站','生产厂家','电子商务企业'],
  "pSuccess": [
    {inclose:true, gname:"indType", p:'主营业务', t:"industrytype", csc:"aslist" },
    {gname:"nick", p:'单位简称',t:"h2" },
    {gname: "title", p:'单位简介', t:"h3"},
    {gname: "desc", p: '单位描述', t: "p"},
    {gname: "thumbnail", p: '图片简介', t: "thumb" },
    {gname: "aGeoPoint", p: '选择地理位置', t: "chooseAd" },
    {gname: "address", p: '地址', t: "ed"},
    {gname: "sUnit", p: '服务单位', t: "MS", indTypes: 620406 },
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
  "pModel": "_Role"
},
{
  "pNo": 1,
  "pName": "店铺文章",
  "afamily": ['产品课堂','营销课堂','我的推介','常见问题'],
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
{
  "pNo": 2,
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
]
