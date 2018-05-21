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
        that.data.sPages.push({pageName:'modalRecordView',targetId:id});
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
        that.data.sPages.push({pageName:'modalFieldView', rFormat: require('procedureclass.js')[dataset.pNo].pSuccess});
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

  i_modalSelectFile: function ({ currentTarget:{id,dataset} }) {            //单项选择面板弹出页
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
        hidePage['vData.' + that.data.reqData[nowPage.n].gname] = { code: nowPage.saddv, sName: value.address1 };
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

  i_cutImageThumbnail: function ({ currentTarget:{id,dataset},touches:[] }) {      //图片编辑弹出页
    var that = this;
    let hidePage = {}, showPage = {}, pageNumber = that.data.sPages.length - 1;
    let spmKey = 'sPages[' + pageNumber +'].';
    let nowPage = that.data.sPages[pageNumber];
    function iDraw(x,y){
      var xm ,ym;
      if (x < this.data.xOff) {
        xm = 0;
      } else {
        if (x > nowPage.xImage) { xm = nowPage.xImage - nowPage.xOff }
        else { xm = x - nowPage.xOff }
      }
      if (y < nowPage.yOff) {
        ym = 0;
      } else {
        if (y > nowPage.yImage) { ym = nowPage.yImage - nowPage.yOff }
        else { ym = y - nowPage.yOff }
      }
      showPage[spmKey + 'x'] = xm;
      showPage[spmKey + 'y'] = ym;
      this.setData(showPage);
      that.ctx.scale(nowPage.ds*nowPage.cScale / nowPage.iScale, nowPage.ds*nowPage.cScale / nowPage.iScale);
      that.ctx.drawImage(nowPage.iscr, 0 - xm/nowPage.cScale/nowPage.ds, 0 - ym/nowPage.cScale/nowPage.ds, 320, 272);
      that.ctx.draw();
    };
    switch (id) {
      case 'fSave':                  //确认返回数据
        wx.canvasToTempFilePath({
          canvasId: 'cei',
          destWidth: 640,
          destHeight: 544,
          success: function(resTem){
            hidePage['vData.' + that.data.reqData[nowPage.n].gname] = { code: nowPage.saddv, sName: value.address1 };
            downModal(that,hidePage);
          }
        })
        break;
      case 'fBack':                  //返回
        downModal(that,hidePage)
        break;
      case 'fHandle':                  //触摸
        iDraw(event.touches[0].pageX, event.touches[0].pageY);
        break;
      case 'fplus':                  //扩大范围
        if (nowPage.xOff<320) {
          showPage[spmKey + 'xOff'] = nowPage.xOff+16;
          showPage[spmKey + 'yOff'] = nowPage.yOff+13.6;
          showPage[spmKey + 'iScale'] = nowPage.iScale+0.1;
          that.setData(showPage);
          this.iDraw(nowPage.xOff+nowPage.x, nowPage.yOff+nowPage.y);
        };
        break;
      case 'freduce':                  //缩小范围
        if (nowPage.xOff>160) {
          showPage[spmKey + 'xOff'] = nowPage.xOff-16;
          showPage[spmKey + 'yOff'] = nowPage.yOff-13.6;
          showPage[spmKey + 'iScale'] = nowPage.iScale-0.1;
          that.setData(showPage);
          that.iDraw(nowPage.xOff+nowPage.x, nowPage.yOff+nowPage.y);
        }
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
                let newPage = {
                  pageName: 'cutImageThumbnail',
                  iscr:restem.tempFilePaths[0],
                  xImage: app.sysinfo.windowWidth,
                  yImage: res.height *app.sysinfo.windowWidth/ res.width,
                  ds: res.width/320,
                  cScale: app.sysinfo.windowWidth/ res.width,
                  iScale: 1,
                  xOff: 320,
                  yOff: 272,
                  x:100,
                  y:100
                };
                newPage.n = parseInt(id.substring(3))      //数组下标;
                that.data.sPages.push(newPage);
                that.setData({sPages: that.data.sPages});
                popModal(that);
                that.ctx = wx.createCanvasContext('cei',that);
              }
            })
          },
          fail: function () { wx.showToast({ title: '选取照片失败！' }) }
        })
        break;
    }
  }

}
