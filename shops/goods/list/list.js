const AV = require('../../../../libs/leancloud-storage.js')
var app = getApp()
// 使用function初始化array，相比var initSubMenuDisplay = [] 既避免的引用复制的，同时方式更灵活，将来可以是多种方式实现，个数也不定的
function initSubMenuDisplay() {
	return ['hidden', 'hidden', 'hidden'];
}

//定义初始化数据，用于运行时保存
var initSubMenuHighLight = [
		['','','','',''],
		['',''],
		['','','']
	];

Page({
	data:{
		subMenuDisplay:initSubMenuDisplay(),
		subMenuHighLight:initSubMenuHighLight,
		goods: []
	},
	onLoad: function(options){
		var categoryId = options.categoryId;
		// 生成Category对象
    var category = AV.Object.createWithoutData('xs_Category', categoryId);
        this.getGoods(category);
	},
	getGoods: function(category){
		var that = this;
    var query = new AV.Query('xs_Goods');
        // 查询顶级分类，设定查询条件parent为null
        query.equalTo('category',category);
		query.descending('updatedAt');
        query.find().then(function (goods) {
            that.setData({
                goods: goods
            });
        }).catch(function(error) {
        });
	},
	tapGoods: function(e) {
		var objectId = e.currentTarget.dataset.objectId;
		wx.navigateTo({
			url:"../../../../../../detail/detail?objectId="+objectId
		});
	},
	tapMainMenu: function(e) {
//		获取当前显示的一级菜单标识
		var index = parseInt(e.currentTarget.dataset.index);
		// 生成数组，全为hidden的，只对当前的进行显示
		var newSubMenuDisplay = initSubMenuDisplay();
//		如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
		if(this.data.subMenuDisplay[index] == 'hidden') {
			newSubMenuDisplay[index] = 'show';
		} else {
			newSubMenuDisplay[index] = 'hidden';
		}
		// 设置为新的数组
		this.setData({
			subMenuDisplay: newSubMenuDisplay
		});
	},
	tapSubMenu: function(e) {
		// 隐藏所有一级菜单
		this.setData({
			subMenuDisplay: initSubMenuDisplay()
		});
		// 处理二级菜单，首先获取当前显示的二级菜单标识
		var indexArray = e.currentTarget.dataset.index.split('-');
		// 初始化状态
		// var newSubMenuHighLight = initSubMenuHighLight;
		for (var i = 0; i < initSubMenuHighLight.length; i++) {
			// 如果点中的是一级菜单，则先清空状态，即非高亮模式，然后再高亮点中的二级菜单；如果不是当前菜单，而不理会。经过这样处理就能保留其他菜单的高亮状态
			if (indexArray[0] == i) {
				for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
					// 实现清空
					initSubMenuHighLight[i][j] = '';
				}
				// 将当前菜单的二级菜单设置回去
			}
		}

		// 与一级菜单不同，这里不需要判断当前状态，只需要点击就给class赋予highlight即可
		initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
		// 设置为新的数组
		this.setData({
			subMenuHighLight: initSubMenuHighLight
		});
	},
  onShareAppMessage: function (goodsId) {
    var sjid = AV.User.current().id;
    // 用户点击右上角分享
    return {
      title: '行者户外装备库', // 分享标题
      path: '/pages/goods/list/list?sjid=' + sjid// 分享路径
    }
  },
  onShow: function () {
    this.sjid();
    this.channelid();
  },
  channelid: function () {
    var channel = AV.User.current().attributes.channelid
    var channelid = app.channelid
    if (channelid) {
      if (channel) {} else {
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
    var sj = AV.User.current().attributes.sjid
    var sjid = app.sjid
    if (sjid) {
      if (sj) {} else {
        this.setData({
          sjid: sjid
        })
        const user = AV.User.current();
        user.set({ sjid });
        user.save();
      }
    }
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
});