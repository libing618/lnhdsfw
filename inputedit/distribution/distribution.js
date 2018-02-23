//货架管理
const AV = require('../../libs/leancloud-storage.js');
const { checkRols,indexClick } = require('../../util/util');
const { updateData } = require('../../model/initupdate');
var app = getApp();

Page({
  data:{
    mPage: app.mData.goods[app.roleData.uUnit.objectId],
    pageData: {}
  },
  onLoad:function(options){
    var that = this;
    if ( checkRols(9) ) {
      updateData(true,6).then((reNew)=>{
        if (reNew) {                     //商品数据有更新
          that.setData({
            pageData: app.aData.goods[app.roleData.uUnit.objectId],
            mPage:app.mData.goods[app.roleData.uUnit.objectId]
          });
        }
      }).catch(console.error);
    };
  },

  fSave:function({currentTarget:{id}}){
    var that = this;
    return new AV.Object.createWithoutData('goods',id).set({                  //选择商品的ID
      inSale:!app.aData.goods[app.roleData.uUnit.objectId][id].inSale
    }).save().then((prodata)=>{
      let aSetData = {};
      app.aData.goods[app.roleData.uUnit.objectId][id].inSale = !app.aData.goods[app.roleData.uUnit.objectId][id].inSale;
      aSetData['pageData.'+id+'.inSale'] = app.aData.goods[app.roleData.uUnit.objectId][id].inSale;
      that.setData(aSetData);
    }).catch( console.error );
  }
})
