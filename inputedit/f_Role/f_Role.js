// pages/f_Role/f_Role.js单位信息编辑
const AV = require('../../../libs/leancloud-storage.js');
const weImp = require('../../../libs/weimport.js');
var app = getApp()
var uniteditPage = {
  data: {
    pNo: 0,                       //流程的序号
    targetId: '0',              //流程申请表的ID
    dObjectId: '0',             //已建数据的ID作为修改标志，0则为新建
    vData: {},                 //编辑值的对象
    unEdit: false,           //新建信息页面,可以提交和保存
    reqData: []
  },

  onLoad: function(options) {
    var that = this;
    if (app.globalData.user.mobilePhoneVerified){       //注册用户才可以创建单位
      let reqData = require('../../../model/procedureclass.js')[0].pSuccess;
      wx.setNavigationBarTitle({  title: app.uUnit.nick+'的信息',  })
      if (options.ruId) {
        AV.Query('reqUnit').get(options.ruId).then(reqUnit=>{
          let reqUnitData = reqUnit.toJSON();
          let crUnit = new AV.ACL();
          crUnit.setWriteAccess(AV.User.current(), true)     // 当前用户是该角色的创建者，因此具备对该角色的写权限
          crUnit.setPublicReadAccess(true);
          crUnit.setPublicWriteAccess(false);
          let unitRole = new AV.Role(app.globalData.user.objectId,crUnit);   //用创建人的ID作ROLE的名称
          unitRole.getUsers().add(AV.User.current());
          unitRole.set('uName',reqUnitData.uName)
          unitRole.set('afamily', reqUnitData.afamily);
          unitRole.set('sUnit', reqUnitData.sUnit);
          unitRole.set('unitUsers',[{"objectId":app.globalData.user.objectId, "userRolName":'admin', 'uName':app.globalData.user.uName, 'avatarUrl':app.globalData.user.avatarUrl,'nickName':app.globalData.user.nickName}] );
          unitRole.save().then((res)=>{
            app.uUnit = res.toJSON();
            let rQuery = AV.Object.createWithoutData('userInit', '598353adfe88c200571b8636')  //设定菜单为applyAdmin
            AV.User.current()
              .set({ "unit": app.uUnit.objectId, "userRolName": 'admin', "userRol": rQuery })  // 设置并保存单位ID
      				.save()
      				.then(function(user) {
                weImp.initData(that,that.data.reqData, app.aData[0][app.uUnit.objectId]);
              }).catch((error) => { console.log(error)
              wx.showToast({title: '修改用户单位信息出现问题,请重试。'})
            });
          }).catch(console.error);
        })
      } else {
        new AV.Query.doCloudQuery('select dObject,cInstance from sengpi where unitId="' + app.uUnit.objectId + '" and dProcedure=0').then((datas) => {
          if (datas.results.length > 0) {
            var spdata = datas.results[0].toJSON();
            var resPageData = {};
            resPageData.targetId = spdata.objectId;
            resPageData.dObjectId = spdata.dObjectId
            resPageData.vData = spdata.dObject;
            resPageData.unEdit = spdata.cInstance==0 ? false : true;        //页面在流程起点能提交和保存
            resPageData.vData.aGeoPoint = new AV.GeoPoint(that.data.vData.aGeoPoint);
            that.setData(resPageData) ;
          } else {wx.showToast({title: '用户单位信息出现问题,请联系客服人员。'})}
        }).catch( console.error )
      };
    } else {
      wx.navigateTo({url:'util/login/login'});
    }
  }
};

uniteditPage.fSubmit = weImp.fSubmit;
uniteditPage.data.reqData.forEach(upSuccess=>{
  let functionName = 'i_'+upSuccess.t;             //每个输入类型定义的字段长度大于2则存在对应处理过程
  if (functionName.length>4) { uniteditPage[functionName] = weImp[functionName] };
})

Page(uniteditPage)
