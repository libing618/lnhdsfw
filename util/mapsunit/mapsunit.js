//从地图选单位util/mapsunit/mapsunit.js
const AV = require('../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data: {
    Height: app.globalData.sysinfo.windowHeight-300,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    controls: [
      { id: 1,
        iconPath: '/images/jia.png',
        position: {
          left: 84,
          top: app.globalData.sysinfo.windowHeight - 332,
          width: 32,
          height: 32
        },
        clickable: true
      },
      { id: 2,
        iconPath: '/images/jian.png',
        position: {
          left: 284,
          top: app.globalData.sysinfo.windowHeight - 332,
          width: 32,
          height: 32
        },
        clickable: true
      },
      { id: 3,
        iconPath: '/images/quedin.png',
        position: {
          left: 161,
          top: app.globalData.sysinfo.windowHeight - 332,
          width: 78,
          height: 32
        },
        clickable: false
      }
    ],
    circles: [],
    unitArray: {},
    sId: 0
  },
  reqNumber: 0,
  reqProIsSuperior: false,
  prevPage: {},

  onLoad: function (options) {
    this.reqNumber = Number(options.reqNumber);
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    this.prevPage = pages[pages.length - 2];        //上个页面
    this.reqProIsSuperior = typeof this.prevPage.data.reqData[this.reqNumber].indTypes == 'number' ;
    if ( this.reqProIsSuperior ) {wx.showToast({title:'选择服务单位，请注意：选定后不能更改！'})}
  },

  onReady: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res){
        let cadd = new AV.GeoPoint(that.reqProIsSuperior ? that.prevPage.data.vData.aGeoPoint : { latitude: res.latitude, longitude: res.longitude });
        var qGeo = new AV.Query('_Role');
        qGeo.withinKilometers('aGeoPoint', cadd, 20);
        var qType = new AV.Query('_Role');
        if (that.reqProIsSuperior) {
          qType.containsAll('indType', [that.prevPage.data.reqData[that.reqNumber].indTypes])
        } else { qType.containedIn('indType', that.prevPage.data.reqData[that.reqNumber].indTypes) };
        var query = AV.Query.and(qGeo,qType);
        query.select(['uName','unitType','nick','title','aGeoPoint','indType','thumbnail','unitUsers'])
        query.find().then( (results)=> {
          let rLength=results.length;
          if (rLength) {
            let uM = {},unitArray=[],uMarkers=[]
            let resJSON,badd;
            for (let i=0;i<rLength;i++){
              resJSON = results[i].toJSON();
              uM.id=i;
              uM.latitude=resJSON.aGeoPoint.latitude;
              uM.longitude=resJSON.aGeoPoint.longitude;
              uM.title=resJSON.nick;
              uM.iconPath=resJSON.unitType ? '/images/icon-personal.png' : '/images/icon-company.png';
              uMarkers.push(uM);
              badd = new AV.GeoPoint(resJSON.aGeoPoint);
              resJSON.distance = parseInt(badd.kilometersTo(cadd) * 1000 +0.5);
              unitArray.push( resJSON );
            }
            that.data.controls[2].clickable = true;
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: uMarkers,
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#FF0000DD',
                fillColor: '#7cb5ec88',
                radius: 3000,
                strokeWidth: 1
              }],
              controls: that.data.controls,
              unitArray: unitArray
            })
          }
        }).catch( (error)=> { console.log(error) });
      }
    })
  },

  markertap(e) {      //点击merkers气泡
    this.setData({ sId: e.markerId })
  },

  controltap(e) {       //点击缩放按钮动态请求数据
    var that = this;
    switch (e.controlId) {
      case 1:
        that.setData({ scale: that.data.scale==18 ? 18 : that.data.scale+1  })
        break;
      case 2:
        that.setData({ scale: that.data.scale==5 ? 5 : that.data.scale-1  })
        break;
      case 3:
       //that.prevPage.data.vData[that.reqNumber] = that.data.unitArray[that.data.sId].objectId;
     //   that.prevPage.data.reqData[that.reqNumber].e = that.data.unitArray[that.data.sId].uName;
        let reqset = {};
        reqset['reqData[' + that.reqNumber + '].e'] = that.data.unitArray[that.data.sId].uName;
        reqset['vData.' + that.prevPage.data.reqData[that.reqNumber].gname] = that.data.unitArray[that.data.sId].objectId;
        if (that.reqProIsSuperior) {
          app.uUnit.sUnit = that.data.unitArray[that.data.sId].objectId;
          app.sUnit = that.data.unitArray[that.data.sId];
          reqset['dObjectId'] = app.uUnit.objectId;
        };
        that.prevPage.setData(reqset, callback=> { wx.navigateBack({ delta: 1 }) } );
        break;
    }
  }

})
