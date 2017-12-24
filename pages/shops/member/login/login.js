const AV = require('../../../../libs/leancloud-storage.js');
const { User } = require('../../../../libs/leancloud-storage.js');
var app = getApp()
var minTime = 0
var currentTime = minTime 
Page({
	data:{
    choice: ['美国', '中国', '巴西', '日本'],
    company: '请选择单位',
		time: currentTime,
		user: {},
		okmpn : "（无绑定手机号）",
		swcheck : true,
		phonen: '',
		vcoden: '',
		yzb: "验\u3000\u3000\u3000证",           //u3000在在js中插入全角空格，&#3000;这种形式在在wxml中不转义
    tk: "\u3000\u3000请仔细阅读下列文字，其包含有关您的权利及义务之重要信息以及可能适用于您的限制及排除条款。\n\u3000\u3000本文件包含适用于您购买山西行者户外用品有限公司产品的现行条款及条件。您确认您完全理解这些条款及条件的含义，并且，在您于本网站发出任何产品订购信息时已同意完全接受这些条款及条件并受其约束\n一、定义\n \u3000\u30001．“行者户外”，指山西行者户外用品有限公司。\n \u3000\u30002．“产品”，指在本网站列为供选购项目，并且客户在订购信息中指明并经山西行者户外用品有限公司公司接受的、成为合同标的产品及其配套产品。\n \u3000\u30003．“客户”，指通过本网站选购产品并下达了订购信息的人。\n \u3000\u30004．“合同”，指包含这些山西行者户外用品有限公司与客户相互同意的关于山西行者户外用品有限公司销售产品和客户购买产品的条款及条件的合同。\n二、销售及购买\n \u3000\u3000山西行者户外用品有限公司销售产品及客户购买产品均应依据合同。\n三、合同成立\n \u3000\u30001．本站的信息只能适用于中国大陆地区（不包括中华人民共和国香港特别行政区、澳门特别行政区以及台湾地区）（下称“中国大陆地区”）的年满18周岁的居民希望在中国大陆地区内交货的山西行者户外用品有限公司产品买卖交易。\n \u3000\u30002．针对所有由客户于本站发出的订购信息，山西行者户外用品有限公司有权自行决定是否接受。在山西行者户外用品有限公司另行通过网站以外的包括邮件及电话等方式向客户发出接受客户发出的订购信息的通知时，此“产品销售条款及条件”即构成合同。除非山西行者户外用品有限公司通过网站以外的方式通知客户接受该订购信息，否则不存在有关该产品买卖的有约束力的合同。\n \u3000\u30003．客户保证其签署和履行合同系合法的，并已取得为此目的而必须取得的所有同意和授权。 \n四、价格及支付\n \u3000\u30001．产品的价格以及运输费用（以下简称“货款”）以客户发出订购信息当山西行者户外用品有限公司网站列明的价格以及费用为准。价格不包括按当时中国法律因合同交易而可能课征的所有中国税金。\n \u3000\u30002．客户的支付方式为线上支付，包含支付宝，微信，银行转账。\n \u3000\u30003．线上支付，客户应于下单后后，立即将货款转到山西行者户外用品有限公司指定的帐户。除非另有规定，山西行者户外用品有限公司只有在收到客户货款后才向客户交货。因汇款发生的所有银行费用及邮寄费用应由客户承担。在收到合同项下客户所订购产品的全部货款前，山西行者户外用品有限公司没有发送产品的义务。\n五、交货\n \u3000\u30001．山西行者户外用品有限公司将尽力安排将产品运至客户在订购信息里指定的位于中国大陆地区的交货地点。山西行者户外用品有限公司有权自行决定选择信誉良好的承运人及合适的运输方式。山西行者户外用品有限公司或其承运人有权在交货之前，为证明和确认客户身份和地址，要求客户出示身份证、护照等证件和\或签署可能必需的文件；若客户拒绝该要求或客户出示的证件与订购信息中的信息不符，山西行者户外用品有限公司或其承运人有权拒绝交货，同时山西行者户外用品有限公司有权解除合同。\n \u3000\u30002．山西行者户外用品有限公司通知的任何交货日期均仅为预计日期，该交货日期并不构成合同的一个条款。在任何情形之下山西行者户外用品有限公司均无需就延迟或未交付产品所引起的客户费用增加、利润或商誉损失或其他任何特别的、或然的、直接或间接的或附随的损失承担任何责任。\n \u3000\u30003．山西行者户外用品有限公司有权以其认为合适的任何次序进行分批交货。在分批交货的方式之下，每一批产品均应视为一个独立合同项下的标的物；山西行者户外用品有限公司在任何一批或几批产品方面的违约行为均不影响其关于此前已交付的产品或尚未交付的产品之合同的效力。如山西行者户外用品有限公司向客户发出其将不能就某一批产品交货的通知，也并不影响客户已接受其已收取之产品批次的效力，但山西行者户外用品有限公司将向客户退还已付货款中不能交付产品部分的价款。\n \u3000\u30004．如产品已为客户备妥而客户未履行收货义务，或客户未提交交货所需的准确指示、文件、证件、认可或授权，山西行者户外用品有限公司有权在书面通知客户后将产品储存或委托他人储存。自储存开始之时，产品的毁损、灭失等风险转移至客户，并且应被视为已完成交货，客户应向山西行者户外用品有限公司支付其违约行为引起的所有成本及费用（包括但不限于仓储及保险费用）。\n六、接受\n \u3000\u3000在交货当时，客户应检验产品有无瑕疵。除非客户在交货当时提出异议，产品应被视为符合合同规定并已在良好状态下被客户接受。\n七、所有权及遗失或毁损的风险　\n \u3000\u30001．产品的所有权将在合同成立时转移至客户，但产品遗失或毁损的风险将在产品被实际交付(包括视为交付)至客户在订购信息上注明的中国大陆地区的交货地点时转移至客户。即使在产品的所有权转移至客户后，有关软件产品的一切知识产权仍应属于有关许可人。\n\u3000\u30002．尽管有前款规定，不论因何种原因而导致合同解除时，产品的所有权于该合同解除时即自动从客户处转移至山西行者户外用品有限公司。　\n八、免费热线电话支持\n \u3000\u30001．在保修期内，山西行者户外用品有限公司对用户提供免费电话技术支持（“技术支持”）。该技术支持将按照山西行者户外用品有限公司即时有效的条款及条件为用户解答有关产品的任何问题，但不包括任何第三方软件产品有关的问题。随附产品提供的山西行者户外用品有限公司应用软件产品及操作系统有关的技术支持亦将按照本条款免费提供给用户。\n \u3000\u30002．山西行者户外用品有限公司产品的免费技术支持热线电话号码是：0351-4222223。山西行者户外用品有限公司将在每天上午9点30分至晚上7点30分，365天为您提供服务。山西行者户外用品有限公司在不通知用户的情况下可变更服务时间。"
	},

  onLoad:function(){
    this.setData({		    		// 获得当前用户
      user: app.globalData.user,
    })
  },

	enablepn: function(e) {                         //“同意条款”选择
		this.setData({eninputm : true})
	},

	fpvcode: function () {                         //验证并绑定手机号
		 var mobilePhoneNumber = this.data.phonen;
	     var scode = this.data.vcoden;
	  AV.Cloud.run('validate',{
                              code:scode,
                              mbn: mobilePhoneNumber
      }).then(function(data){
		if( data==0 ) {
			const user = User.current();
			user.set({mobilePhoneNumber});
			user.save().then(function (todo) {
				wx.showModal({
				title: '手机号验证成功'
			});
			}, function (error) {
				wx.showModal({
				title: '手机号已经注册',
				content: '请重新输入正确的手机号'
			});
			});
			
		}else
		 {
			wx.showModal({
				title: '验证码输入错误',
				content: '请重新输入手机号'
			});
		 }
		 
	  })
	},

	inputmpn: function(e) {                         //结束输入后验证手机号格式
		var phone = e.detail.value;
		if( phone && /^1\d{10}$/.test(phone) ) {
			this.setData({phonen : phone})
		}else
		{
			wx.showModal({
				title: '手机号输入错误',
				content: '请重新输入正确的手机号'+phone
			});
			this.setData({phonen : ''});
		}
	},

	getvcode: function(e) {							//向服务器请求验证码
		var sphone = this.data.phonen;
		var interval = null;
		if(currentTime <= 0){  
		AV.Cloud.run('weinit',{mbn:sphone}).then(function (data){     //
			console.log(sphone)
			console.log(result)
			data.save().then(function(res){
				wx.showToast({'title': '手机号验证成功'});
			});
			}).catch(function(error){
				console.log(error)
			})
		var that = this
		currentTime = 60
		interval = setInterval(function(){  
			 currentTime-- 
			 that.setData({  
				 time : currentTime  
				 }) 
		}, 1000) 
		 }else{	
			 wx.showModal({
				title: '短信已发到您的手机，请'+currentTime+'s后重试!',
			});	 
		}
	},

	inputvc: function(e) {                         //结束输入后检查验证码格式
		var vcode = e.detail.value;
		if( vcode && /\d{6}$/.test(vcode) ) {
			this.setData({vcoden : vcode})
		}else
		{
			wx.showModal({
				title: '验证码输入错误',
				content: '请重新输入正确的验证码'
			});
			this.setData({vcoden : ''});
		}
	},

	fswcheck: function(e) {                         //“同意条款”选择
		this.setData({swcheck : !this.data.swcheck})
	},


   company: function (e) {
     var choice = this.data.choice
     var company = choice[e.detail.value]; 
     this.setData({
       company: company
     })
     const user = User.current();
     user.set({ company });
     user.save();
   }
})