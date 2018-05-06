//系统对话和聊天室模块
const conversationRole = {
  "推广通知":{participant:9,chairman:6},
  "工作沟通":{participant:8,chairman:5},
  "直播课堂":{participant:9,chairman:7},
  "客户服务":{participant:9,chairman:6}
};
const {checkRols,checkRole} = require('../../libs/util.js');
var app = getApp()
Page({
  data:{
    sysheight:app.sysinfo.windowHeight-60,
    syswidth:app.sysinfo.windowWidth-10,
    pw: app.sysinfo.pw,
    user: app.roleData.user,
    enMultimedia: true,
    announcement: false,
    chairman: false,
    vData: {},
    message: [],
    cId:'',
    mgrids: ['产品','图像','音频','视频','位置','文件']   //
  },

  onLoad:function(options){
    var that = this;
    let cPageSet = {};
    let nowPages = getCurrentPages();
    app.nowOpenChat = nowPages[nowPages.length-1];
    cPageSet.navBarTitle = options.ctype;
    if (options.ctype=='客户服务'){    //对话形式
      cPageSet.announcement = false;    //无通告（直播）窗口
      '客户服务';
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

  sendMsg: function(e){
    var that = this;
    let sMsg = {};
    sMsg.mtext = e.detail.value.inputtext;
    sMsg.mtype = e.detail.value.itype;
    sMsg.wcontent = e.detail.value.inputmu;
    app.sendM(sMsg,that.data.cId).then( (rsm)=>{
      if (rsm){
        that.setData({ itext: '',
          messages: app.conMsg[that.data.cId]
        })
      }
    });
  },

  fMultimedia: function(e){
    this.setData({enMultimedia: !this.data.enMultimedia});
  },

  iMultimedia: function(e){
    var that = this;
    var sIndex = parseInt(e.currentTarget.id);      //选择的菜单id;
    return new Promise( (resolve, reject) =>{
      switch (sIndex){
        case '-1':             //选择产品
          wx.navigateTo({
            url: '../goodssct/goodssct?reqName="chatPro"',
            success: function(res){ resolve(that.data.vData.chatPro); },
            fail: function(err){ reject(err) }
          })
          break;
        case '-2':               //选择相册图片或拍照
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],             //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],                 //可以指定来源是相册还是相机，默认二者都有
            success: function (res) { resolve(res.tempFilePaths[0]) },               //返回选定照片的本地文件路径列表
            fail: function(err){ reject(err) }
          });
          break;
        case '-3':               //录音
          wx.startRecord({
            success: function (res) { resolve( res.tempFilePath ); },
            fail: function(err){ reject(err) }
          });
          break;
        case '-4':               //选择视频或拍摄
          wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) { resolve( res.tempFilePath ); },
            fail: function(err){ reject(err) }
          })
          break;
        case '-5':                    //选择位置
          wx.chooseLocation({
            success: function(res){ resolve( { latitude: res.latitude, longitude: res.longitude } ); },
            fail: function(err){ reject(err) }
          })
          break;
        case '-6':                     //选择文件
        wx.navigateTo({
          url: '../filesct/filesct?reqName="chatFile"',
          success: function(res){ resolve(that.data.vData.chatFile); },
          fail: function(err){ reject(err) }
        })
          break;
        default:
          resolve('输入文字');
        }
      }).then( (wcontent)=>{
        return new Promise( (resolve, reject) => {
          if (['-2','-3','-4','-6'].indexOf(sIndex)>=0){
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
        that.setData({ itype: sIndex ,inputmu: content });
      }).catch((error)=>{console.log(error)});
  }
})
