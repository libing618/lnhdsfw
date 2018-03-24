const AV = require('../../../libs/leancloud-storage.js')
var app = getApp()
Page({
    data: {
        topCategories: [],
        subCategories: [],
        highlight:['highlight','','']
    },
    onLoad: function(){
        this.getCategory(null);
        // hard code to read default category,maybe this is a recommend category later.
        var category = AV.Object.createWithoutData('xs_Category', '5a31fe08fe88c2006378551d');
       this.getCategory(category);
    },

    onShow: function (options) {
      this.sjid();
      this.channelid()
    },
    channelid: function () {
      var channelid = app.channelid
      console.log(channelid)
      if (channelid) {
        var channel = AV.User.current().attributes.channelid
        if (channel) { console.log(0) } else {
          this.setData({
            channelid: channelid
          })
          const user = AV.User.current();
          user.set({ channelid });
          user.save();
        }
      }
    },
    sjid: function () {
      var sjid = app.sjid
      console.log(sjid)
      if(sjid){
        var sj = AV.User.current().attributes.sjid
      if (sj) { console.log(0) } else {
        this.setData({
          sjid: sjid
        })
        const user = AV.User.current();
        user.set({ sjid });
        user.save();
      }
      }
    },

    tapTopCategory: function(e){
        // 拿到objectId，作为访问子类的参数
        var objectId = e.currentTarget.dataset.objectId;
        // 查询父级分类下的所有子类
        var parent = AV.Object.createWithoutData('xs_Category', objectId);
        this.getCategory(parent);
        // 设定高亮状态
        var index = parseInt(e.currentTarget.dataset.index);
        this.setHighlight(index);
        // get banner local


    },
    getCategory: function(parent){
        var that = this;
        var query = new AV.Query('xs_Category');
        // 查询顶级分类，设定查询条件parent为null
        query.equalTo('parent',parent);
        //query.ascending('index');
        query.ascending('createdAt');
        query.find().then(function (categories) {
            if (parent){
                that.setData({
                    subCategories: categories
                });
            }else{
                that.setData({
                    topCategories: categories
                });
            }
        }).catch(function(error) {
        });
    },
    setHighlight: function(index){
        var highlight = [];
        for (var i = 0; i < this.data.topCategories; i++) {
            highlight[i] = '';
        }
        highlight[index] = 'highlight';
        this.setData({
            highlight: highlight
        });
    },
    avatarTap: function(e){
        // 拿到objectId，作为访问子类的参数
        var objectId = e.currentTarget.dataset.objectId;
        wx.navigateTo({
            url: "../../../../../goods/list/list?categoryId="+objectId
        });
    },
    onShareAppMessage: function () {
      var sjid = AV.User.current().id;
      var channelid = AV.User.current().attributes.channelid
      // 用户点击右上角分享
      return {
        title: '分享的内容', // 分享标题
        path: '/pages/index/index?sjid=' + sjid + '&goodsid=' + goodsid + '&channelid=' + channelid // 分享路径
      }
    }
    
})