const AV = require('./libs/leancloud-storage.js');
const Realtime = require('./libs/leancloud-realtime.js').Realtime;
const TypedMessagesPlugin = require('./libs/leancloud-realtime-plugin-typed-messages.js').TypedMessagesPlugin;
const TextMessage = require('./libs/leancloud-realtime.js').TextMessage;
const ImageMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').ImageMessage;
const AudioMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').AudioMessage;
const VideoMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').VideoMessage;
const LocationMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').LocationMessage;
const FileMessage = require('./libs/leancloud-realtime-plugin-typed-messages.js').FileMessage;
AV.init({
  appId: "kUsS8QFC8BLXbueQYwiYPfUF-gzGzoHsz",                    // 初始化存储 SDK
  appKey: "hCxPWp7TGfQWs6OShmL2uB1g"
});
const realtime = new Realtime({
  appId: 'kUsS8QFC8BLXbueQYwiYPfUF-gzGzoHsz',                      // 初始化实时通讯 SDK
  appKey: "hCxPWp7TGfQWs6OShmL2uB1g",
  region: 'cn',                                               // 目前仅支持中国节点 cn
  noBinary: true,
  plugins: [TypedMessagesPlugin],                    // 注册富媒体消息插件
  pushOfflineMessages: true                          //使用离线消息通知方式
});
const aimenu = require('./libs/allmenu.js').iMenu;
const wxappNumber = 2;    //本小程序在开放平台中自定义的序号
let lcUser = AV.User.current();

App({
  globalData: lcUser ? {user:lcUser.toJSON()} : require('globaldata.js').globalData,
  roleData: wx.getStorageSync('roleData') || require('globaldata.js').roleData,
  netState: true,
  mData: wx.getStorageSync('mData') || require('globaldata.js').mData,              //读数据管理的缓存
  aData: wx.getStorageSync('aData') || {},                           //以objectId为key的数据记录
  configData: wx.getStorageSync('configData') || {},
  procedures: wx.getStorageSync('procedures') || {},              //读流程的缓存
  logData: [],                         //操作记录
  fwClient: {},                        //实时通信客户端实例
  fwCs: [],                           //客户端的对话实例
  urM: [],                           //未读信息
  openWxLogin: function() {            //注册登录
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (wxlogined) {
          if (wxlogined.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (wxuserinfo) {
                if (wxuserinfo) {
                  AV.Cloud.run('wxLogin2', { code: wxlogined.code, encryptedData: wxuserinfo.encryptedData, iv: wxuserinfo.iv }).then(function (wxuid) {
                    let signuser = {};
                    signuser['uid'] = wxuid.uId;
                    AV.User.signUpOrlogInWithAuthData(signuser, 'openWx').then((statuswx) => {    //用户在云端注册登录
                      if (statuswx.country) {
                        this.globalData.user = statuswx.toJSON();
                        resolve(1);                        //客户已注册在本机初次登录成功
                      } else {                         //客户在本机授权登录则保存信息
                        let newUser = wxuserinfo.userInfo;
                        newUser['wxthis' + wxthisNumber] = wxuid.oId;         //客户第一次登录时将openid保存到数据库且客户端不可见
                        statuswx.set(newUser).save().then((wxuser) => {
                          this.globalData.user = wxuser.toJSON();
                          resolve(0);                //客户在本机刚注册，无菜单权限
                        }).catch(err => { reject({ ec: 0, ee: err }) });
                      }
                    }).catch((cerror) => { reject({ ec: 2, ee: cerror }) });    //客户端登录失败
                  }).catch((error) => { reject({ ec: 1, ee: error }) });       //云端登录失败
                }
              }
            })
          } else { reject({ ec: 3, ee: '微信用户登录返回code失败！' }) };
        },
        fail: function (err) { reject({ ec: 4, ee: err.errMsg }); }     //微信用户登录失败
      })
    });
  },

  fetchMenu: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.user.mobilePhoneVerified) {
        return new AV.Query('userInit')
          .notEqualTo('updatedAt', new Date(that.roleData.wmenu.updatedAt))
          .select(['manage', 'marketing', 'customer'])
          .equalTo('objectId', that.globalData.user.userRol.objectId).find().then(fMenu => {
            if (fMenu.length > 0) {                          //菜单在云端有变化
              that.roleData.wmenu = fMenu[0].toJSON();
              ['manage', 'marketing', 'customer'].forEach(mname => {
                that.roleData.wmenu[mname] = that.roleData.wmenu[mname].filter(rn => { return rn != 0 });
              });
              resolve(true);
            } else {
              resolve(false);
            };
          })
      } else {
        resolve(false);
      };
    }).then(updateMenu => {
      return new Promise((resolve, reject) => {
        if (hat.globalData.user.mobilePhoneVerified) {that.roleData.iMenu = aimenu(that.roleData.wmenu)};
        wx.getUserInfo({        //检查客户信息
          withCredentials: false,
          success: function ({ userInfo }) {
            if (userInfo) {
              let updateInfo = false;
              for (var iKey in userInfo) {
                if (userInfo[iKey] != that.globalData.user[iKey]) {             //客户信息有变化
                  updateInfo = true;
                  that.globalData.user[iKey] = userInfo[iKey];
                }
              };
              if (hat.globalData.user.mobilePhoneVerified) {that.roleData.iMenu.manage[0].mIcon = that.globalData.user.avatarUrl};   //把微信头像地址存入第一个菜单icon
              if (updateInfo) {
                AV.User.become(AV.User.current().getSessionToken()).then((rLoginUser) => {
                  rLoginUser.set(userInfo).save().then(() => { resolve(true) });
                })
              } else {
                resolve(updateMenu);
              };
            }
          }
        });
      });
    }).then(uMenu => {
      if (that.globalData.user.unit != '0') {
        return new AV.Query('_Role')
          .notEqualTo('updatedAt', new Date(that.roleData.uUnit.updatedAt))
          .equalTo('objectId', that.globalData.user.unit).first().then(uRole => {
            if (uRole) {                          //本单位信息在云端有变化
              that.roleData.uUnit = uRole.toJSON();
              uMenu = true;
            };
            if (that.roleData.uUnit.sUnit != '0') {
              return new AV.Query('_Role')
                .notEqualTo('updatedAt', new Date(that.roleData.sUnit.updatedAt))
                .equalTo('objectId', that.roleData.uUnit.sUnit).first().then(sRole => {
                  if (sRole) {
                    that.roleData.sUnit = sRole.toJSON();
                    uMenu = true;
                  };
                }).catch(console.error)
            }
          }).catch(console.error)
      };
      if (uMenu) { wx.setStorage({ key: 'roleData', data: that.roleData }); }
      that.imLogin(that.globalData.user.username);
      return uMenu;
    }).catch(error => { return error });
  },

  imLogin: function(username){                               //实时通信客户端登录
    realtime.createIMClient(username+wxappNumber).then( (im)=> {
      that.fwClient = im;
      im.getQuery().containsMembers([username+wxappNumber]).find().then( (conversations)=> {  // 默认按每个对话的最后更新日期（收到最后一条消息的时间）倒序排列
        conversations.map( (conversation)=> { that.fwCs.push(conversation); });
      });
      im.on('unreadmessagescountupdate', function unreadmessagescountupdate(conversations) { that.urM = conversations; });
    });
  },

  sendM: function(sMessage,conversationId){
    var sendMessage;
    switch (sMessage.mtype) {
      case -1:
        sendMessage = new TextMessage(sMessage.mtext);
        if (sMessage.wcontent){
          sendMessage.setAttributes({ product: sMessage.wcontent })  //如有产品信息则发送之
        };
        break;
      case -2:
        sendMessage = new ImageMessage(sMessage.wcontent);       //根据图像文件上传成功路径构建消息实例
        sendMessage.setText('图片消息: ' + sMessage.mtext);
        break;
      case -3:
        sendMessage = new AudioMessage(sMessage.wcontent);       //根据音频文件上传成功路径构建消息实例
        sendMessage.setText('音频消息: ' + sMessage.mtext);
        break;
      case -4:
        sendMessage = new VideoMessage(sMessage.wcontent);       //根据视频文件上传成功路径构建消息实例
        sendMessage.setText('视频消息: ' + sMessage.mtext);
        break;
      case -5:
        sendMessage = new LocationMessage(sMessage.wcontent);       //根据位置构建消息实例
        sendMessage.setText('位置消息: ' + sMessage.mtext);
        break;
      case -6:
        sendMessage = new FileMessage(sMessage.wcontent);       //根据文件上传成功路径构建消息实例
        sendMessage.setText('文件消息: ' + sMessage.mtext);
        break;
      default:
        return;
    };
    sendMessage.setAttributes({                                 //发送者呢称和头像
      avatarUrl: this.globalData.user.avatarUrl,
      nickName: this.globalData.user.nickName
    });
    return new Promise((resolve, reject) => {
      this.fwClient.getConversation(conversationId).then(function(conversation) {
        conversation.send(sendMessage).then(function(){
          return resolve(true);
        });
      });
    }).catch((error)=>{ return reject(error) });
  },

  getM: function(conversationId){                   //接收消息内容
    var that = this;
    that.fwClient.getConversation(conversationId).then(function(conversation) {
      conversation.queryMessages({ limit: 10, }).then(function(messages) {    //取limit条消息，取值范围 1~1000，默认 20
        const gMesssages = messages.map((message)=>{ return that.mParse(message) });     //解析最新的limit条消息，按时间增序排列
        Promise.all(gMesssages).then( (gM)=>{ return gMesssages });
      }).catch(console.error.bind(console));
    })
  },

  mParse: function(message,conversation){                   //根据消息和对话实例解析消息内容
    var that = this;
    var mfile;
    let rMessage = {};
    rMessage.type = message.type;
    rMessage.objectId = message.id;
    rMessage.wtext = message.getText();
    switch (message.type) {
      case TextMessage.TYPE:
        if (typeof message.getAttributes() != 'undefined'){
          if (message.getAttributes().product){ rMessage.product = message.getAttributes().product;}
        }
        break;
      case FileMessage.TYPE:
        mfile = message.getFile(); // file 是 AV.File 实例
        rMessage.wcontent = mfile.url();
        break;
      case ImageMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case AudioMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case VideoMessage.TYPE:
        mfile = message.getFile();
        rMessage.wcontent = mfile.url();
        break;
      case LocationMessage.TYPE:
        rMessage.wcontent = message.getLocation();
        break;
      default:
        console.warn('收到未知类型消息');
    }
    if (typeof message.getAttributes() != 'undefined'){
      rMessage.nickName = message.getAttributes().nickName;
      rMessage.avatarUrl = message.getAttributes().avatarUrl;
    }
    return rMessage;
  },

  onLaunch: function () {
    var that = this;            //调用应用实例的方法获取全局数据
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == 'none') {
          that.netState = false;
          wx.showToast({ title: '请检查网络！' });
        } else {
          that.netState = true;
        }
      }
    });
    wx.getSystemInfo({                     //读设备信息
      success: function(res) {
        that.globalData.sysinfo = res;
        let sdkvc = res.SDKVersion.split('.');
        let sdkVersion = parseFloat(sdkvc[0]+'.'+sdkvc[1]+sdkvc[2]);
        if (sdkVersion<1.9) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法正常使用，请升级到最新微信版本后重试。',
            compressed(res) {setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 2000);}
          })
        };
      }
    });
    wx.onNetworkStatusChange(res => {
      if (!res.isConnected) {
        that.netState = false;
        wx.showToast({ title: '请检查网络！' });
      } else {
        that.netState = true;
      }
    });
  },

  onShow: function ({ path, query, scene, shareTicket, referrerInfo }){
    var that = this;
    function loginAndMenu() {
      return new Promise((resolve, reject) =>{     //用户如已注册并在本机登录过,则有数据缓存，否则进行注册登录
        if (that.globalData.user.objectId != '0'){
          that.fetchMenu().then(() => { resolve(true) });
        } else {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {                   //用户已经同意小程序使用用户信息
                that.openWxLogin().then(() => {
                  that.fetchMenu().then(() => { resolve(true) });
                }).catch((loginErr) => { reject('系统登录失败:' + loginErr.toString()) });
              } else { resolve(false) }
            }
          })
        }
      }).catch(lcuErr => {
        that.logData.push([Date.now(), lcuErr]);
      })
    };

    function initConfig(query){
      return new Promise((resolve, reject) => {
        let initTime = new Date(0).toISOString();
        let proSceneQuery = wx.getStorageSync('proSceneQuery') || {query:{}};
        if (query){
          if (query.sjId){
            that.globalData.user.sjid = query.sjId;
            delete query.sjId;
          } else {
            if (proSceneQuery.query.sjId){ that.globalData.user.sjid = proSceneQuery.query.sjId };
          }
        }
        if (typeof that.globalData.user.sjid == 'undefined') { that.globalData.user.sjid = '59f08fbb67f356004449a4a4' };
        let proConfig = wx.getStorageSync('configData') || {goods:{ updatedAt: initTime }};
        if (that.netState) {
          new AV.Query('shopConfig').find().then(dConfig => {
            let cData;
            dConfig.forEach(conData => {
              cData = conData.toJSON();
              that.configData[cData.cName] = { cfield: cData.cfield, fConfig: cData.fConfig,updatedAt: cData.updatedAt}
            });
            if (that.configData.goods.updatedAt!=proConfig.goods.updatedAt){ that.mData.pAt.goods=[initTime,initTime]};   //店铺签约厂家有变化则重新读商品数据
            return new AV.Query('_User').select('goodsIndex').get(that.globalData.user.sjid);
         }).then(sjData => {
           if (sjData.get('goodsIndex')) { that.configData.goodsIndex = sjData.get('goodsIndex') };
           resolve(query.toString())
         }).catch(console.error)
        } else {
          that.configData.goodsIndex = proConfig.goodsIndex;
          resolve(query.toString())
        };
      })
    };
    return Promise.all([initConfig(query),loginAndMenu()]).then((nQuery,sTab) => {
      if (that.globalData.user.mobilePhoneVerified) { wx.showTabBar() } else { wx.hideTabBar(); }
      if (scene === 1007 && path == '/pages/signup/signup') {

      };
      wx.setStorage({ key: 'proSceneQuery', data: { path, query, scene } })
      wx.setStorage({ key: 'configData', data: that.configData });
      that.configData.articles = { cfield: 'afamily', fConfig: [1, 3] };
      if (path!=='index/shops/shops') {wx.navigateTo({ url: '../../'+path })}
    }).catch(console.error)
  },

  onHide: function () {             //进入后台时缓存数据。
    var that=this;
    wx.getStorageInfo({             //查缓存的信息
      success: function(res) {
        if ( res.currentSize>(res.limitSize-512) ) {          //如缓存占用大于限制容量减512kb，将大数据量的缓存移除。
          wx.removeStorage({key:"aData"});
          wx.removeStorage({key:"mData"});
          wx.removeStorage({key:"procedures"});
        }else{
          wx.setStorage({key:"aData", data:that.aData});
          wx.setStorage({key:"mData", data:that.mData});
          wx.setStorage({key:"procedures", data:that.procedures});
        }
      }
    });
    let logData = that.logData.concat(wx.getStorageSync('loguser') || []);  //如有旧日志则拼成一个新日志数组
    if (logData.length>0){
      wx.getNetworkType({
        success: function(res) {
          if (res.networkType=='none') {                     //如果没有网络
            wx.setStorageSync('loguser', logData)           //缓存操作日志
          }else{
            let loguser = AV.Object.extend('userlog');       //有网络则上传操作日志
            let userlog = new loguser();
            userlog.set('userObjectId',that.globalData.user.objectId);
            userlog.set('workRecord',logData);
            userlog.save().then( resok =>{
              wx.removeStorageSync('loguser');              //上传成功清空日志缓存
            }).catch( (error) =>{                            //上传失败保存日志缓存
              wx.setStorage({ key: 'loguser', data: logData })
            })
          }
        }
      })
    }
  },

  onError: function(msg) {
    this.logData.push([Date.now(), '系统错误:'+msg]);
  }

})
