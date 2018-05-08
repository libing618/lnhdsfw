//系统对话和聊天室模块
const conversationRole = {
  "推广通知":{participant:9,chairman:6},
  "工作沟通":{participant:8,chairman:5},
  "直播课堂":{participant:9,chairman:7},
  "客户服务":{participant:9,chairman:6}
};
const {checkRols,checkRole} = require('../../libs/util.js');
const {popModal} = require('../../model/controlModal');
var app = getApp()
Page({
  data:{
    sysheight:app.sysinfo.windowHeight-60,
    syswidth:app.sysinfo.windowWidth-10,
    pw: app.sysinfo.pw,
    user: app.roleData.user,
    enMultimedia: true,
    announcement: false,
    showModalBox,
    animationData,
    chairman: false,
    sPages: [],
    vData: {},
    message: [],
    idClicked: '0',
    cId:'',
    reqData: [
      {gname:'wcontent',p:'产品'},
      {gname:'wcontent',p:'图像'},
      {gname:'wcontent',p:'音频'},
      {gname:'wcontent',p:'视频'},
      {gname:'wcontent',p:'位置'},
      {gname:'wcontent',p:'文件'}
    ]
  },

  onLoad:function(options){
    var that = this;
    let cPageSet = {};
    let nowPages = getCurrentPages();
    app.nowOpenChat = nowPages[nowPages.length-1];
    cPageSet.navBarTitle = options.ctype;
    if (options.ctype=='客户服务'){    //对话形式
      cPageSet.announcement = false;    //无通告（直播）窗口
      cPageSet.cId='5aedc6f9ee920a0046b050b4';
    } else {
      if (checkRols(conversationRole[options.ctype].participant,app.roleData.user)){
        cPageSet.announcement = true;    //有通告（直播）窗口
        cPageSet.chairman = checkRole(conversationRole[options.ctype].participant,app.roleData.user)
        app.fwCs.forEacth(conversation=>{ if (options.ctype == conversation.name){cPageSet.cId=conversation.cId} });
      }
    };
    app.getM(cPageSet.cId).then(updatedmessage=>{
      cPageSet.messages = app.conMsg[cPageSet.cId];
      if (options.pNo && options.artId){
        let pName = require('../../model/procedureclass.js')[options.pNo].pName;
        let iMsg = {mtype: -1};
        return new Promise((resolve, reject) => {
          if (app.aData[options.pNo][options.artId]){
            resolve(true)
          } else {
            AV.Object.createWithoutData(options.pNo,options.artId).fetch().then(getData=>{
              app.aData[options.pNo][options.artId] = getData.toJSON();
              resolve(true)
            }).catch(reject(false))
          }
        }).then(()=>{
          iMsg.mtext = pName+':'+app.aData[options.pNo][options.artId].uName;
          iMsg.mcontent = {pNo:options.pNo,...app.aData[options.pNo][options.artId]};
          app.sendM(iMsg,cPageSet.cId).then(()=>{
            cPageSet.messages = app.conMsg[cPageSet.cId];
            that.setData(cPageSet);
          })
        })
      } else {
        that.setData(cPageSet);
      }
    }).catch( console.error );
  },

  i_msgEditSend: function(e){
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
          switch (sIndex){
            case 1:             //选择产品
              if (!that.f_modalSelectPanel) {that.f_modalSelectPanel = require('../../model/controlModal').f_modalSelectPanel}
              let showPage = {};
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
              if (!that.f_modalSelectFile) {that.f_modalSelectFile = require('../../model/controlModal').f_modalSelectFile}
              let showPage = {};
              wx.getSavedFileList({
                success: function(res) {
                  let index,filetype,fileData={},cOpenFile=['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];
                  var sFiles=res.fileList.map((fileList)=>{
                    index = fileList.filePath.indexOf(".");                   //得到"."在第几位
                    filetype = fileList.filePath.substring(index+1);          //得到后缀
                    if ( cOpenFile.indexOf(filetype)>=0 ){
                      fileData[fileList.filePath] = {"fType":filetype,"fLen":fileList.filePath.size/1024};
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
          }
        }).then( (wcontent)=>{
          return new Promise( (resolve, reject) => {
            if (['-2','-3','-4'].indexOf(sIndex)>=0){
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
})
