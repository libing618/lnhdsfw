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

  f_modalFieldView: function ({ currentTarget:{id,dataset} }) {            //字段内容查看弹出页
    var that = this;
    let hidePage = {};
    switch (id) {
      case 'fBack':                  //返回
        downModal(that,hidePage);
        break;
      default:                  //打开弹出页
        let showPage = {};
        showPage['pageData.'+id] = app.aData[dataset.pNo][id];
        showPage.sPages = that.data.sPages.push({pageName:'modalFieldView',targetId:id,reqData: require('procedureclass.js')[dataset.pNo].pSuccess});
        that.setData(showPage);
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
        hidePage['vData.'+that.data.reqData[nowPage.n].gname] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
        downModal(that,hidePage);
        break;
      case 'fPop':                  //打开弹出页
        let showPage = {};
        showPage.pageData = app.aData[dataset.pNo];
        showPage.tPage = app.mData[dataset.pNo];
        showPage.idClicked = '0';
        showPage.sPages = that.data.sPages.push({pageName:'modalSelectPanel',vData:that.data.vData});
        that.setData(showPage);
        popModal(that)
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
        hidePage['vData.'+that.data.reqData[nowPage.n].gname] =  { pNo: nowPage.pNo, ...that.data.pageData[that.data.idClicked] };
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
    let hidePage = {};
    switch (id) {
      case 'fSave':                  //确认返回数据
        let nowPage = that.data.sPages[that.data.sPages.length-1];
        hidePage['vData.'+that.data.reqData[nowPage.n].gname] =  { code: that.data.saddv, sName: value.address1 };
        downModal(that,hidePage)
        break;
      case 'fBack':                  //返回
        downModal(that,hidePage)
        break;
      case 'faddclass':                  //选择行政区划
        showPage.saddv = 0;
        if (that.data.adcvalue[0] == value[0]){
          if (that.data.adcvalue[1] == value[1]) {
            showPage.saddv = that.data.adclist[value[0]].st[value[1]].ct[value[2]].c;
            showPage.address1 = that.data.adclist[val[0]].n + that.data.adclist[val[0]].st[val[1]].n + that.data.adclist[val[0]].st[val[1]].ct[val[2]].n;
          } else { value[2]=0 }
        } else { value[1]=0 }
        showPage.adcvalue = value;
        that.setData(showPage);
        break;
      case 'raddgroup':                  //读村镇区划数据
        if (that.data.saddv != 0) {
          return new AV.Query('ssq4')
          .equalTo('tncode', that.data.saddv)
          .first()
          .then(result => {
            let adgroup = result.toJSON() ;
            that.setData({ adglist: adgroup.tn });
          }).catch( console.error );
        };
        break;
      case 'saddgroup':                  //选择村镇
        showPage.adgvalue = value;
        if (that.data.adgvalue[0] == value[0]) {
          showPage.address1 = that.data.address1 + that.data.adglist[value[0]].n + that.data.adglist[value[0]].cm[value[1]].n;
        }
        that.setData(showPage);
        break;
      case 'modalEditAddress':                  //打开弹出页
        let newPage = {
          pageName: 'modalEditAddress',
          adclist: require('addresclass.js'),   //读取行政区划分类数据
          adglist: [],
          saddv: 0,
          adcvalue: [3, 9, 15],
          adgvalue: [0, 0]
        };
        newPage.n = parseInt(dataset.n)      //数组下标;
        that.setData({sPages: that.data.sPages.push(newPage)});
        popModal(that);
        break;
    }
  },

  i_msgEditSend:function(e){            //消息编辑发送框
    var that = this;
    switch (e.currentTarget.id) {
      case 'sendMsg':
        app.sendM(e.detail.value,that.data.cId).then( (rsm)=>{
          if (rsm){
            that.setData({
              vData: {mtype:-1,mtext:'',wcontent},
              messages: app.conMsg[that.data.cId]
            })
          }
        });
        break;
      case 'fMultimedia':
        that.setData({enMultimedia: !that.data.enMultimedia});
        break;
      case 'iMultimedia':
        var sIndex = parseInt(e.currentTarget.dataset.n);      //选择的菜单id;
        return new Promise( (resolve, reject) =>{
          let showPage = {};
          switch (sIndex){
            case 1:             //选择产品
              if (!that.f_modalSelectPanel) {that.f_modalSelectPanel = require('../../model/controlModal').f_modalSelectPanel}
              showPage.pageData = app.aData.goods;
              showPage.tPage = app.mData.goods;
              showPage.idClicked = '0';
              showPage.sPages = that.data.sPages.push({pageName:'modalSelectPanel',pNo:'goods',n:0});
              that.setData(showPage);
              popModal(that);
              resolve(true);
              break;
            case 2:               //选择相册图片或拍照
              wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
                success: function (res) { resolve(res.tempFilePaths[0]) },               //返回选定照片的本地文件路径列表
                fail: function(err){ reject(err) }
              });
              break;
            case 3:               //录音
              wx.startRecord({
                success: function (res) { resolve( res.tempFilePath ); },
                fail: function(err){ reject(err) }
              });
              break;
            case 4:               //选择视频或拍摄
              wx.chooseVideo({
                sourceType: ['album','camera'],
                maxDuration: 60,
                camera: ['front','back'],
                success: function(res) { resolve( res.tempFilePath ); },
                fail: function(err){ reject(err) }
              })
              break;
            case 5:                    //选择位置
              wx.chooseLocation({
                success: function(res){ resolve( { latitude: res.latitude, longitude: res.longitude } ); },
                fail: function(err){ reject(err) }
              })
              break;
            case 6:                     //选择文件
              if (!that.f_modalSelectFile) { that.f_modalSelectFile = require('../../model/controlModal').f_modalSelectFile };
              wx.getSavedFileList({
                success: function(res) {
                  let index,filetype,fileData={},cOpenFile=['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];
                  var sFiles=res.fileList.map(({filePath,createTime,size})=>{
                    index = filePath.indexOf(".");                   //得到"."在第几位
                    filetype = filePath.substring(index+1);          //得到后缀
                    if ( cOpenFile.indexOf(filetype)>=0 ){
                      fileData[filePath] = {"fType":filetype,"cTime":formatTime(createTime,false),"fLen":size/1024};
                      return (fileList.filePath);
                    }
                  })
                  showPage.pageData = fileData;
                  showPage.tPage = sFiles;
                  showPage.idClicked = '0';
                  showPage.sPages = that.data.sPages.push({pageName:'modalSelectFile',pNo:'files',n:5});
                  that.setData(showPage);
                  popModal(that);
                  resolve(true);
                }
              })
              break;
            default:
              resolve('输入文字');
              break;
          }
        }).then( (wcontent)=>{
          return new Promise( (resolve, reject) => {
            if (sIndex>1 && sIndex<5){
              wx.saveFile({
                tempFilePath : icontent,
                success: function(cres){ resolve(cres.savedFilePath); },
                fail: function(cerr){ reject('媒体文件保存错误！') }
              });
            }else{
              resolve(wcontent);
            };
          });
        }).then( (content) =>{
          that.setData({ mtype: -sIndex ,wcontent: content });
        }).catch((error)=>{console.log(error)});
      break;
    default:
      break;
    }
  }

}
