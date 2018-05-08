// 联系厂家
const app=getApp();
Page({
data:{
  vData:[],
  iClicked: '0'
},
onLoad:function(options){
  this.setData({vData:[app.roleData.uUnit,app.roleData.sUnit]});
  this.indexClick = require('../../libs/util.js').indexClick;
}

})
