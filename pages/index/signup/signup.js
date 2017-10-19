const AV = require('../../../libs/leancloud-storage.js');
const unitFormat = require('../../../libs/procedureclass.js')[0];
var app = getApp()
Page({
  data:{
    user: app.globalData.user,
    sysheight: app.globalData.sysinfo.windowHeight-300,
    swcheck: true,
    iName: { gname: "uName", p: '真实姓名', t: "Name" },
    reqData: [
      { gname: "afamily", p: '单位类型', t: "arrsel", alist:unitFormat.afamily },
      { gname:"uName", p:'单位名称', t:"h3" }
    ],
    bsType: unitFormat.pSuccess,
    afamilys: unitFormat.afamily,
    aValue: app.uUnit,
    activeIndex: "0",
    crUnitDataId: '0'
	},

  editenable: function(e) {                         //点击条目进入编辑或选择操作
    this.setData({activeIndex: e.currentTarget.id });
  },

  onLoad: function () {
    var that = this;
    that.data.iName.c = app.globalData.user.uName;
    that.setData({		    		// 获得当前用户
      user: app.globalData.user,
      activeIndex: app.globalData.user.mobilePhoneVerified ? "1" : "0",
      cUnitInfo: that.data.cUnitInfo,
      iName: that.data.iName
    })
  },

	fswcheck: function(e){
		this.setData({ swcheck: !this.data.swcheck });
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

  makeunit: function(e) {                         //创建单位并邀请负责人注册
    var that = this;
    var reqUnitData = e.detail.value;
    var fSeatch = new AV.Query('reqUnit');
    fSeatch.equalTo('uName',reqUnitData.uName);
    fSeatch.find().then((results)=>{
      if (results.length==0){                      //申请单位名称无重复
        let unitRole = AV.Object.extend('reqUnit')  //新建单位
        unitRole.set('uName',reqUnitData.uName)
        unitRole.set('afamily', reqUnitData.afamily);
        unitRole.set('sUnit', app.uUnit.objectId);
        unitRole.save().then((rest)=>{
          that.data.crUnitDataId = rest.id;
          wx.showShareMenu({ withShareTicket: false })
        }).catch((error) => { wx.hideShareMenu();
          wx.showToast({ title: '新建单位时出现问题,请重试。', duration: 7500}) })
      }else{
        wx.showModal({
          title: '已存在同名单位',
          content: '选择取消进行核实修改，选择确定再次邀请单位负责人注册！',
          success: function(res) {
            if (res.confirm) {              //用户点击确定则申请加入该单位
              that.data.crUnitDataId = results[0].id;
              wx.showShareMenu({ withShareTicket: false })
            } else if (res.cancel) {        //用户点击取消
              that.data.reqData[1].c = '';
              that.setData({reqData: that.data.reqData});
              wx.hideShareMenu()
            }
          }
        })
      }
    }).catch(function(error) { console.log(error) });                                     //打印错误日志
  },

  onShareAppMessage: function(e) {                         //创建单位并邀请负责人注册
    var that = this;
    return {
      title: app.uUnit.uName+'请您注册单位信息', // 分享标题
      path: 'pages/index/f_Role/f_Role?ruId='+that.data.crUnitDataId // 分享路径
    }
  }

})
