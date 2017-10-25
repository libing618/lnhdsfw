//合伙人或伙伴注册
const AV = require('../../libs/leancloud-storage.js');
var app = getApp()
Page({
  data:{
    user: app.globalData.user,
    sysheight: app.globalData.sysinfo.windowHeight-160,
    swcheck: true,
    iName: { gname: "uName", p: '真实姓名', t: "Name" },
    phonen: '',
    vcoden: '',
    activemobile: true,
    rejectWxPhone: false,
    yzb: "验\u3000\u3000\u3000证"           //u3000在在js中插入全角空格，&#3000;这种形式在在wxml中不转义
	},
  wxlogincode: '',

  getLoginCode: function() {
    var that=this;
    wx.login({
      success: function (wxlogined) {
        that.wxlogincode = (wxlogined.code) ? wxlogined.code : ''
      }
    });
  },

  editenable: function(e) {                         //点击条目进入编辑或选择操作
    this.setData({activemobile: !this.data.activemobile });
  },

  onLoad: function () {
    var that = this;
    that.data.iName.c = app.globalData.user.uName;
    that.setData({		    		// 获得当前用户
      iName: that.data.iName
    });
    wx.setNavigationBarTitle({
      title: app.globalData.user.userRolName ? '您已注册为平台合伙人' : '平台合伙人注册',
    });
  },

	fswcheck: function(e){
		this.setData({ swcheck: !this.data.swcheck });
	},

  gUserPhoneNumber: function(e) {
    var that = this;
    if (that.wxlogincode) {
      if (e.detail.errMsg == 'getPhoneNumber:ok'){
        AV.Cloud.run('gPN', { code: that.wxlogincode, encryptedData: e.detail.encryptedData, iv: e.detail.iv }).then(function() {
          wx.showToast({
            title: '微信绑定的手机号注册成功', duration: 2000
          })
          app.globalData.user.mobilePhoneVerified = true;
          that.setData({ 'user.mobilePhoneVerified':app.globalData.user.mobilePhoneVerified})
        }).catch(console.error());
      } else {
        wx.showToast({
          title: '未授权使用微信手机号', duration: 2000
        });
        that.setData({ rejectWxPhone: true });               //输入手机号验证注册
      }
    } else {
      wx.showToast({
        title: '需要进行微信登录，请再次点击本按钮。', duration: 2000
      });
      that.getLoginCode();
    }
  },
  userInfoHandler: function (e) {
    var that = this;
    app.openWxLogin(that.globalData.user.userAuthorize,0).then( (mstate)=> {
      app.logData.push([Date.now(), '用户授权' + app.globalData.sysinfo]);                      //用户授权时间记入日志
      app.wmenu[0][0].mIcon = e.detail.userInfo.avatarUrl;      //把微信头像地址存入第一个菜单icon
      that.setData({ user: app.globalData.user })
    }).catch((error) => { console.log(error) });
  },
  i_Name: function(e) {							//修改用户姓名
    if ( e.detail.value.uName ) {                  //结束输入后验证是否为空
			AV.User.current()
        .set({ "uName": e.detail.value.uName })  // 设置并保存用户姓名
				.save()
				.then((user)=> {
          app.globalData.user['uName'] = e.detail.value.uName;
          this.data.iName.c = e.detail.value.uName;
          this.setData({ iName: this.data.iName})
			}).catch((error)=>{console.log(error)
				wx.showToast({title: '修改姓名出现问题,请重试。'})
			});
		}else{
			wx.showModal({
  			title: '姓名输入错误',
  			content: '姓名输入不能为空！'
      });
		}
  },
  getvcode: function(e) {							//向服务器请求验证码
		var phone = e.detail.value['inputmpn'];
		if ( phone && /^1\d{10}$/.test(phone) ) {                  //结束输入后验证手机号格式
			this.setData({phonen : phone})
			AV.User.current()
				.setMobilePhoneNumber(phone)  // 设置并保存手机号
				.save()
				.then(function(user) {
				AV.Cloud.run('vsmp',{ mbn:phone })       // 发送验证短信请求
				}).then(function(){
				wx.showToast({title: '请查看手机短信找到验证码'})
			}).catch((error)=>{
				wx.showToast({title: '手机号短信注册出现问题,换一个手机号再试试。'})
			});
		}else{
			wx.showModal({
			title: '手机号输入错误',
			content: '请重新输入正确的手机号！'
			});
			this.setData({phonen : ''});
		}
  },

  fpvcode: function (e) {                         //验证并绑定手机号
		var vcode = e.detail.value.inputvc;
		if( vcode && /\d{6}$/.test(vcode) ) {           //结束输入后检查验证码格式
			this.setData({vcoden : vcode})
			AV.Cloud.run('vSmsCode',{mbn:this.data.phonen,mcode:this.data.vcoden}).then( (mVerfied) => {              // 用户填写收到的短信验证码
				app.globalData.user.mobilePhoneNumber = this.data.phonen;
				app.globalData.user.mobilePhoneVerified = true;
				this.setData({
					user: app.globalData.user,
					activemobile : false
				});
			}).catch( (error)=>{                 //验证失败将旧手机号保存（若有）
				AV.User.current()
					.set({ "mobilePhoneNumber": app.globalData.user.mobilePhoneVerified ? app.globalData.user.mobilePhoneNumber : "",
                 "mobilePhoneVerified": app.globalData.user.mobilePhoneVerified ? true : false })
					.save()
			})
		}else{
			wx.showModal({
			title: '验证码输入错误',
			content: '请重新输入正确的验证码'
			});
			this.setData({vcoden : ''});
		}
  },

  registeredPartner: function(e) {                         //创建单位并申请负责人岗位
    var that = this;
    if (app.globalData.user.uName) {
		  var fSeatch = AV.Object.extend('partners');
      let rQuery = AV.Object.createWithoutData('userInit', '590b402d02f3eb0056fc8c4e')  //设定菜单为sessionuser
      AV.User.current()
        .set({"sjid":app.globalData.user.sjid, "userRolName": 'sessionuser', "userRol": rQuery } )  // 设置并保存单位ID
        .save()
        .then(function(user) {
          app.globalData.user = user.toJSON();
          fSeatch.set({'mobilePhoneNumber':app.globalData.user.mobilePhoneNumber,"userId":app.globalData.user.objectId, 'uName':app.globalData.user.uName, 'avatarUrl':app.globalData.user.avatarUrl,'nickName':app.globalData.user.nickName})
                 .save()
                 .then( ()=>{that.setData({user : app.globalData.user});
        });
      }).catch((error) => { console.log(error) });
		}else{
			wx.showToast({ title: '新建单位时出现问题,请重试。', duration: 7500});
		}
	}

})
