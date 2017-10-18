//对话聊天模块pages
var app = getApp()
Page({
  data:{
    sysheight:app.globalData.sysinfo.windowHeight-60,
    syswidth:app.globalData.sysinfo.windowWidth-10,
    enMultimedia: true,
    selectd: -1,
    vData: {},
    mgrids: ['产品','图像','音频','视频','位置','文件']   //
  },

  onLoad:function(options){
    var that = this;
    that.setData({		    		// 获得当前用户
      user: app.globalData.user,
      messages : app.getM('58e53adbb1acfc0056ba3897'),
    })
    wx.setNavigationBarTitle({title:conversation.name});
  },

  sendMsg: function(e){
    var that = this;
    let sMsg = {};
    sMsg.mtext = e.detail.value.inputtext;
    sMsg.mtype = e.detail.value.itype;
    sMsg.wcontent = e.detail.value.inputmu;
    app.sendM(sMsg,'58e53adbb1acfc0056ba3897').then( (rsm)=>{
      if (rsm){
        that.data.messages.push(sMsg);
        sMsg.mtext = '信息发送成功，请等待客户服务人员与您联系。'
        that.setData({ itext: '',
          messages: that.data.messages
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
            url: '../productsct/productsct?reqName="chatPro"',
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
          if (indexOf(sIndex,['-2','-3','-4','-6'])>=0){
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
