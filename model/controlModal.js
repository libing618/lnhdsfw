const AV = require('../libs/leancloud-storage.js');
var app = getApp();
function popModal(that){
  if (typeof that.animation=='undefined'){
    that.animation = wx.createAnimation({      //遮罩层
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
  }
  that.animation.height(app.sysinfo.pw.cwHeight).translateY(app.sysinfo.pw.cwHeight).step();
  that.setData({ animationData: that.animation.export() });
  setTimeout(function () {
    that.animation.translateY(0).step()
    that.setData({
      animationData: that.animation.export(),
      showModalBox: true
    });
  }, 200)
};
function downModal(that,hidePage){
  that.animation.translateY(-app.sysinfo.pw.cwHeight).step();
  that.setData({ animationData: that.animation.export() });
  setTimeout(function () {
    let sPages = that.data.sPages;
    sPages.pop();
    hidePage.sPages = sPages;
    that.animation.translateY(0).step();
    hidePage.animationData = that.animation.export();
    hidePage.showModalBox = false;
    that.setData(hidePage);
  }, 200)
}
module.exports = {
  f_modalSwitchBox: function ({ currentTarget:{id,dataset} }) {            //切换选择弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fSwitch':                  //确认切换到下一数组并返回
        let arrNext = (that.data.ht.pageCk + 1) == that.data.ht.fLength ? 0 : (that.data.ht.pageCk + 1);
        that.data.cPage[arrNext].push(that.data.modalId);
        let oldNo = that.data.cPage[that.data.ht.pageCk].indexOf(that.data.modalId);
        that.data.cPage[that.data.ht.pageCk].splice(oldNo, 1);
        hidePage.cPage = that.data.cPage;
        downModal(that,hidePage)
        break;
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
        that.data.sPages.push({
          pageName: 'modalSwitchBox',
          targetId: id,
          smtName: that.data.ht.modalBtn[that.data.ht.pageCk]
        });
        that.setData({
          sPages: that.data.sPages
        });
        popModal(that)
        break;
    }
  },

  f_modalRecordView: function ({ currentTarget:{id,dataset} }) {            // 记录内容查看弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
        that.data.sPages.push({
          pageName:'modalRecordView',
          vFormat: app.fData[dataset.pNo].pSuccess,
          targetId:id
        });
        that.setData({ sPages: that.data.sPages });
        popModal(that)
        break;
    }
  },

  f_modalFieldView: function ({ currentTarget:{id,dataset} }) {            //字段内容查看弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
        that.data.sPages.push({
          pageName:'modalFieldView',
          vFormat: app.fData[dataset.pNo].pSuccess
        });
        that.setData({ sPages: that.data.sPages });
        popModal(that)
        break;
    }
  },

  i_modalSelectPanel: function ({ currentTarget:{id,dataset} }) {            //单项选择面板弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      case 'fSelect':                  //选定返回
        let nowPage = that.data.sPages[that.data.sPages.length-1];
        if (that.data.selectd<0){
          hidePage['vData.'+nowPage.gname] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        } else {
          hidePage['vData.'+nowPage.gname+'['+that.data.selectd+']'] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        }
        downModal(that,hidePage);
        break;
      default:                  //确认ID
        that.setData({idClicked:id});
        break;
    }
  },

  i_modalSelectFile: function ({ currentTarget:{id,dataset} }) {            //文件选择面板弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      case 'fSelect':                  //选定返回
        let nowPage = that.data.sPages[that.data.sPages.length-1];
        if (that.data.selectd<0){
          hidePage['vData.'+nowPage.gname] =  { ...that.data.pageData[that.data.idClicked] };
        } else {
          hidePage['vData.'+nowPage.gname+'['+that.data.selectd+']'] =  { ...that.data.pageData[that.data.idClicked] };
        }
        downModal(that,hidePage);
        break;
      case 'fOpen':                  //打开文件
        wx.openDocument({
          filePath: this.data.idClicked
        });
        break;
      default:                  //确认ID
        that.setData({idClicked:id});
        break;
    }
  },

  i_modalEditAddress: function ({ currentTarget:{id,dataset},detail:{value} }) {      //地址编辑弹出页
    var that = this;
    let hidePage = {}, showPage = {}, pageNumber = that.data.sPages.length - 1;
    let spmKey = 'sPages[' + pageNumber +'].';
    let nowPage = that.data.sPages[pageNumber];
    switch (id) {
      case 'fSave':                  //确认返回数据
        hidePage['vData.' + that.data.iFormat[nowPage.n].gname] = { code: nowPage.saddv, sName: value.address1 };
        downModal(that,hidePage)
        break;
      case 'fBack':                  //返回
        downModal(that,hidePage)
        break;
      case 'faddclass':                  //选择行政区划
        showPage[spmKey +'saddv'] = 0;
        if (nowPage.adcvalue[0] == value[0]){
          if (nowPage.adcvalue[1] == value[1]) {
            showPage[spmKey + 'saddv'] = nowPage.adclist[value[0]].st[value[1]].ct[value[2]].c;
            showPage[spmKey + 'address1'] = nowPage.adclist[value[0]].n + nowPage.adclist[value[0]].st[value[1]].n + nowPage.adclist[value[0]].st[value[1]].ct[value[2]].n;
          } else { value[2]=0 }
        } else { value[1]=0 }
        showPage[spmKey + 'adcvalue'] = value;
        that.setData(showPage);
        break;
      case 'raddgroup':                  //读村镇区划数据
        if (nowPage.saddv != 0) {
          return new AV.Query('ssq4')
          .equalTo('tncode', nowPage.saddv)
          .first()
          .then(results => {
            if (results){
              let adgroup = results.toJSON();
              console.log(adgroup)
              showPage[spmKey + 'adglist'] = adgroup.tn
              that.setData(showPage);
            };
          }).catch( console.error );
        };
        break;
      case 'saddgroup':                  //选择村镇
        showPage[spmKey + 'adgvalue'] = value;
        if (nowPage.adgvalue[0] == value[0]) {
          showPage[spmKey + 'address1'] = nowPage.address1 + nowPage.adglist[value[0]].n + nowPage.adglist[value[0]].cm[value[1]].n;
        }
        that.setData(showPage);
        break;
      default:                  //打开弹出页
        let newPage = {
          pageName: 'modalEditAddress',
          adclist: require('addresclass.js'),   //读取行政区划分类数据
          adglist: [],
          saddv: 0,
          adcvalue: [3, 9, 15],
          adgvalue: [0, 0]
        };
        newPage.n = parseInt(id.substring(3))      //数组下标;
        that.data.sPages.push(newPage);
        that.setData({sPages: that.data.sPages});
        popModal(that);
        break;
    }
  },

  i_cutImageThumbnail: function ({ currentTarget: { id, dataset }, detail }) {      //图片编辑弹出页
    var that = this;
    let hidePage = {}, showPage = {}, pageNumber = that.data.sPages.length - 1;
    let spmKey = 'sPages[' + pageNumber +'].';
    let nowPage = that.data.sPages[pageNumber];
    switch (id) {
      case 'fSave':                  //确认返回数据
        wx.canvasToTempFilePath({
          canvasId: 'cei',
          success: function(resTem){
            hidePage['vData.' + that.data.iFormat[nowPage.n].gname] = resTem.tempFilePath;
            downModal(that,hidePage);
          }
        })
        break;
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      case 'fHandle':                  //触摸
        if (detail.scale){
          showPage[spmKey +'cScale'] = detail.scale;
          that.ctx.drawImage(nowPage.iscr, nowPage.x, nowPage.y,detail.scale*nowPage.xOff, detail.scale*nowPage.yOff,0,0, 300, 225);
        } else {
          showPage[spmKey +'x'] = detail.x;
          showPage[spmKey +'y'] = detail.y;
          that.ctx.drawImage(nowPage.iscr,detail.x,detail.y,nowPage.cScale*nowPage.xOff, nowPage.cScale*nowPage.yOff,0,0, 300, 225);
        }
        that.setData(showPage);
        that.ctx.draw();
        break;
      default:                  //打开弹出页
        wx.chooseImage({
          count: 1,                                     // 最多可以选择的图片张数，默认9
          sizeType: ['compressed'],         // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'],             // album 从相册选图，camera 使用相机，默认二者都有
          success: function (restem) {                     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            wx.getImageInfo({
              src: restem.tempFilePaths[0],
              success: function (res){
                if (res.width<300 || res.height<225){
                  wx.showToast({ title: '照片尺寸太小！' })
                } else {
                  let xMaxScall = app.sysinfo.windowWidth/res.width;
                  let yMaxScall = (app.sysinfo.pw.cwHeight-260)/res.height;
                  let imageScall = xMaxScall>yMaxScall ? yMaxScall : xMaxScall;
                  let cutScallMax = xMaxScall>yMaxScall ? res.height/225 : res.width/300;
                  let newPage = {
                    pageName: 'cutImageThumbnail',
                    iscr:restem.tempFilePaths[0],
                    xImage: res.width*imageScall,
                    yImage: res.height*imageScall,
                    cScale: imageScall,
                    xOff: 300 /imageScall,
                    yOff: 225 /imageScall,
                    x:0,
                    y:0
                  };
                  newPage.n = parseInt(id.substring(3));      //数组下标
                  that.data.sPages.push(newPage);
                  that.setData({sPages: that.data.sPages});
                  popModal(that);
                  that.ctx = wx.createCanvasContext('cei',that);
                  that.ctx.drawImage(restem.tempFilePaths[0], 0, 0, 300, 225, 0, 0, 300, 225);
                  that.ctx.draw();
                };
              }
            })
          },
          fail: function () { wx.showToast({ title: '选取照片失败！' }) }
        })
        break;
    }
  },

  i_mapSelectUnit: function (e) {      //地图选择单位弹出页
    var that = this;
    let hidePage = {}, showPage = {}, pageNumber = that.data.sPages.length - 1;
    let spmKey = 'sPages[' + pageNumber +'].';
    let nowPage = that.data.sPages[pageNumber];
    switch (e.currentTarget.id.substring(0,3)) {
      case 'fSa':                  //确认返回数据
        hidePage['iFormat[' + nowPage.n + '].e'] = nowPage.unitArray[nowPage.sId].uName;
        hidePage['vData.' + that.data.iFormat[nowPage.n].gname] = nowPage.unitArray[nowPage.sId].objectId;
        if (nowPage.reqProIsSuperior) {
          app.roleData.uUnit.sUnit = nowPage.unitArray[nowPage.sId].objectId;
          app.roleData.sUnit = nowPage.unitArray[nowPage.sId];
          hidePage['dObjectId'] = app.roleData.uUnit.objectId;
        };
        break;
      case 'fBa':                  //返回
        downModal(that,hidePage)
        break;
      case 'ac-':                  //打开弹出页
        let n = parseInt(e.currentTarget.id.substring(3));
        let newPage = {
          pageName: 'mapSelectUnit',
          Height: app.sysinfo.windowHeight-300,
          scale: 16,
          sId: 0,
          markers:[],
          unitArray: [],
          reqProIsSuperior: typeof that.data.iFormat[n].indTypes == 'number',
          n: n,      //数组下标
          selIndtypes:[]
        };
        if ( newPage.reqProIsSuperior ) {
          newPage.selIndtypes.push(that.data.iFormat[n].indTypes);
          wx.showToast({title:'选择服务单位，请注意：选定后不能更改！',icon: 'none'});
        } else {newPage.selIndtypes=that.data.iFormat[n].indTypes}
        wx.getLocation({
          type: 'gcj02',//'wgs84',
          success: function(res){
            let cadd = new AV.GeoPoint(that.reqProIsSuperior ? that.prevPage.data.vData.aGeoPoint : { latitude: res.latitude, longitude: res.longitude });
            let points = [{ latitude: res.latitude, longitude: res.longitude }]
            var query = new AV.Query('_Role');
            query.withinKilometers('aGeoPoint', cadd, 200);
            query.select(['uName','afamily','nick','title','aGeoPoint','indType','thumbnail','unitUsers'])
            query.find().then( (results)=> {
              if (results) {
                let resJSON,badd,inInd;
                results.forEach((result,i)=>{
                  resJSON = result.toJSON();
                  inInd = false;     //先假设单位的类型不在查找范围内
                  newPage.selIndtypes.forEach(indType=>{
                    if (resJSON.indType.code.indexOf(indType) >= 0) { inInd = true }
                  })
                  if (inInd) {
                    newPage.markers.push({
                      id:i,
                      latitude:resJSON.aGeoPoint.latitude,
                      longitude:resJSON.aGeoPoint.longitude,
                      title:resJSON.nick,
                      iconPath: resJSON.afamily < 3 ? '/images/icon-personal.png' : '/images/icon-company.png',   //单位是个人还是企业
                    });
                    badd = new AV.GeoPoint(resJSON.aGeoPoint);
                    resJSON.distance = parseInt(badd.kilometersTo(cadd) * 1000 +0.5);
                    newPage.unitArray.push( resJSON );
                    points.push({ latitude: resJSON.aGeoPoint.latitude, longitude: resJSON.aGeoPoint.longitude})
                  }
                });
                newPage.latitude = res.latitude;
                newPage.longitude = res.longitude;
                newPage.circles = [{
                    latitude: res.latitude,
                    longitude: res.longitude,
                    color: '#FF0000DD',
                    fillColor: '#7cb5ec88',
                    radius: 3000,
                    strokeWidth: 1
                  }];
                that.data.sPages.push(newPage);
                that.setData({sPages: that.data.sPages});
                popModal(that);
                that.mapCtx = wx.createMapContext('mapSelect',that);
                that.mapCtx.includePoints({points});
              } else { wx.showToast({ title: '未发现合适单位' }) }
            }).catch( console.error );
          }
        });
        break;
      default:                   //移动点击
        if (e.markerId){      //点击merkers气泡
          showPage[spmKey +'sId'] = e.markerId;
          that.setData(showPage);
        };
        if (e.type){
          switch (e.type){
            case 'begin':
              that.mapCtx.moveToLocation();
              break;
            case 'end':
              that.mapCtx.getCenterLocation({
                success: (res)=>{
                  showPage[spmKey + 'latitude'] = res.latitude;
                  showPage[spmKey + 'longitude'] = res.longitude;
                  that.setData(showPage);
                }
              });
              break;
          }
        };
        break;
    }
  },

  i_goodsOrder: function ({ currentTarget:{id,dataset} }) {            //单项选择面板弹出页
    var that = this;
    let hidePage = {};
    let nPage = that.data.sPages.length-1      //当前页序号;
    let nowPage = that.data.sPages[nPage];
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      case 'oPlus':                  //+
        if (nowPage.quantity<nowPage.maxSupply){that.setData({'sPages['+nPage+'].quantity':nowPage.quantity+1}) };
        break;
      case 'oMinus':                  //+
        if (nowPage.quantity>0){that.setData({'sPages['+nPage+'].quantity':nowPage.quantity-1}) };
        break;
      case 'fBuy':                  //确定购买
        let nowPage = that.data.sPages[that.data.sPages.length-1];
        if (that.data.selectd<0){
          hidePage['vData.'+nowPage.gname] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        } else {
          hidePage['vData.'+nowPage.gname+'['+that.data.selectd+']'] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        }
        downModal(that,hidePage);
        break;
      case 'fGive':                  //确定赠送

        if (that.data.selectd<0){
          hidePage['vData.'+nowPage.gname] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        } else {
          hidePage['vData.'+nowPage.gname+'['+that.data.selectd+']'] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        }
        downModal(that,hidePage);
        break;
      case 'goods':                  //弹出套餐购买框
        let n = parseInt(dataset.n)      //数组下标;
        if (that.data.vFormat[n].canSupply>0){
          let newPage = {
            pageName: 'goodsOrder',
            n: n,
            vData: that.data.vData,
            vFormat: app.fData.specs,
            mPage: that.data.vData.specs,
            pageData: that.data.vFormat[n].master,
            price: that.data.vData.price,
            quantity: 1,
            maxSupply: that.data.vFormat[n].canSupply
          };
          newPage.n = parseInt(id.substring(3))      //数组下标;
          that.data.sPages.push(newPage);
          that.setData({sPages: that.data.sPages});
        popModal(that);
      } else {wx.showToast({title:'库存不足！'})}
        break;
      default:                                    //弹出单品购买框
        let n = parseInt(dataset.n)      //数组下标;
        if (that.data.vFormat[n].master[id].canSupply>0){
          let newPage = {
            pageName: 'goodsOrder',
            n: n,
            vData: that.data.vData,
            vFormat: app.fData.specs,
            mPage: [id],
            pageData: that.data.vFormat[n].master,
            price: that.data.vFormat[n].master[id].price,
            quantity: 1,
            maxSupply: that.data.vFormat[n].master[id].canSupply
          };
          that.data.sPages.push(newPage);
          that.setData({sPages: that.data.sPages});
          popModal(that);
        } else {wx.showToast({title:'库存不足！'})}
        break;
    }
  }
}
