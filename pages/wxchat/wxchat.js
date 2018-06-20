//系统对话和聊天室模块
const conversationRole = {
  "推广通知":{participant:9,chairman:6},
  "工作沟通":{participant:8,chairman:5},
  "直播课堂":{participant:9,chairman:7},
  "客户服务":{participant:9,chairman:6}
};
const { checkRole,checkRols } =  require('../../model/initForm');
const {i_msgEditSend} = require('../../model/controlModal');
var app = getApp()
Page({
  data:{
    sysheight:app.sysinfo.windowHeight-60,
    syswidth:app.sysinfo.windowWidth-10,
    statusBar: app.sysinfo.statusBarHeight,
    user: app.roleData.user,
    enMultimedia: true,
    announcement: false,
    showModalBox: false,
    animationData: {},
    chairman: false,
    sPages: [],
    vData: {},
    message: [],
    idClicked: '0',
    cId:'',
    mgrids: ['产品','图像','音频','视频','位置','文件']
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
          iMsg.mtext = app.fData[options.pNo].pName+':'+app.aData[options.pNo][options.artId].uName;
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

  i_msgEditSend: i_msgEditSend

})
