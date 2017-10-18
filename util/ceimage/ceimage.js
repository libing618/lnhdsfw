//图片选取及简单编辑模块 util/ceimage/ceimage.js
var iScale=1 , cScale ,ds;
var ctx = wx.createCanvasContext('cei');
var app = getApp();
Page({
  data: {
    xImage: app.globalData.sysinfo.windowWidth,
    yImage: 0,
    iscr: '',
    xOff: 320,
    yOff: 272,
    x:100,
    y:100
  },
  reqField: '',
  prevPage: {},

  onLoad: function (options) {
    var that = this;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    that.reqField = 'vData.' + options.reqName;
    if (that.prevPage.data.selectd<0) {
      var getSrc = that.prevPage.data.vData[options.reqName];
    } else {
      that.reqField += '['+that.prevPage.data.selectd+'].c';
      var getSrc = that.prevPage.data.vData[options.reqName][that.prevPage.data.selectd].c
    };
    wx.getImageInfo({
      src: getSrc,
      success: function (res){
        ds = res.width/320;
        cScale = that.data.xImage / res.width;
        that.setData({ iscr: res.path, yImage: res.height*cScale });
        that.iDraw(that.data.xOff,that.data.yOff)
      }
    })
  },

  iDraw: function(x,y){
    var xm ,ym;
    if (x < this.data.xOff) {
      xm = 0;
    } else {
      if (x > this.data.xImage) { xm = this.data.xImage - this.data.xOff }
      else { xm = x - this.data.xOff }
    }
    if (y < this.data.yOff) {
      ym = 0;
    } else {
      if (y > this.data.yImage) { ym = this.data.yImage - this.data.yOff }
      else { ym = y - this.data.yOff }
    }
    this.setData({ x: xm, y: ym });
    ctx.scale(ds*cScale / iScale, ds*cScale / iScale);
    ctx.drawImage(this.data.iscr, (0 - xm) / cScale, (0 - ym) / cScale, 320, 272);
    ctx.draw();
  },

  EventHandle: function (event) {
    this.iDraw(event.touches[0].pageX, event.touches[0].pageY);
  },

  fplus: function () {                   //扩大范围
    if (this.data.xOff<320) {
      this.setData({xOff:this.data.xOff+16,yOff:this.data.yOff+13.6});
      iScale = iScale+0.1;
      this.iDraw(this.data.xOff+this.data.x, this.data.yOff+this.data.y);
    }
  },

  freduce: function () {                   //缩小范围
    if (this.data.xOff>160) {
      this.setData({xOff:this.data.xOff-16,yOff:this.data.yOff-13.6});
      iScale = iScale-0.1;
      this.iDraw(this.data.xOff + this.data.x, this.data.yOff + this.data.y);
    }
  },

  fSave: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'cei',
      destWidth: 640,
      destHeight: 544,
      success: function(resTem){
        wx.saveFile({
          tempFilePath: resTem.tempFilePath,
          success: function (res) {
            let reqset = {};
            reqset[that.reqField] = res.savedFilePath;
            that.prevPage.setData(reqset);
            wx.navigateBack({ delta: 1 });
          }
        })
      }
    })
  }
})
