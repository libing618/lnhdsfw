module.exports = {
  iss_append: [
    { p: "账本ID", gname: "ledger_id", t: "String", len: 32 },
    { p: "信息标识", gname: "info_key", t: "String", len: 64 },
    { p: "信息版本号", gname: "info_version", t: "Int" },
    { p: "记录状态", gname: "state", t: "Int" },
    { p: "记录内容", gname: "content", t: "JsonObject" },
    { p: "记录注释", gname: "notes", t: "JsonObject" },
    { p: "记录时间", gname: "commit_time", t: "String", len: 32 },
    { p: "记录方地址", gname: "account", t: "String", len: 64 },
    { p: "记录方公钥", gname: "public_key", t: "String", len: 256 },
    { p: "记录方签名", gname: "sign", t: "String", len: 256 }
  ],
  iss_query: [
    { p: "账本ID", gname: "ledger_id", t: "String", len: 32 },
    { p: "信息标识", gname: "info_key", t: "String", len: 64 },
    { p: "信息版本号", gname: "info_version", t: "Int" },
    { p: "记录状态", gname: "state", t: "Int" },
    { p: "记录内容", gname: "content", t: "JsonObject" },
    { p: "记录注释", gname: "notes", t: "JsonObject" },
    { p: "范围查询条件", gname: "range", t: "JsonObject" },
    { p: "记录方地址", gname: "account", t: "String", len: 64 },
    { p: "记录哈希", gname: "t_hash", t: "String", len: 64 },
    { p: "页码", gname: "page_no", t: "Int" },
    { p: "每页数量", gname: "page_limit", t: "Int" }
  ]
}
