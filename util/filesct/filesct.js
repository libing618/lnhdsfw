//文件选择pages
const cOpenFile=['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
Page({                //打开本地保存文件列表，选择小程序能打开的文件并将文件路径存入调用页面
  data:{
    files: {}
  },
  reqField: '',
  prevPage: {},

  onLoad:function(options){
    var that = this;
    that.reqField = 'vData.'+options.reqName;
    let pages = getCurrentPages();                //获取当前页面路由栈的信息
    that.prevPage = pages[pages.length - 2];        //上个页面
    if (that.prevPage.data.selectd>=0) {
      that.reqField += '['+that.prevPage.data.selectd+'].c';
    };
    wx.getSavedFileList({
      success: function(res) {
        let index,filetype;
        var sFiles=res.fileList.map((fileList)=>{
          index = fileList.filePath.indexOf(".");                   //得到"."在第几位
          filetype = fileList.filePath.substring(index+1);          //得到后缀
          if ( cOpenFile.indexOf(filetype)>=0 ){
            return {"fType":filetype,"fName":fileList.filePath,"fLen":fileList.filePath.size/1024}
          }
        })
        that.setData({files: sFiles});
      }
    })
  },

  openfile:function(e){                         //打开文件进行查看
    var i = parseInt(e.target.dataset.i);
    wx.openDocument({
      filePath: this.data.files[i].fName
    });
  },

  sfChange:function(e){                //选择文件
    let reqset={};
    reqset[this.reqField]=e.detail.value;
    prevPage.setData(reqset);
    wx.navigateBack({ delta: 1 });
  }

})
