var qParser = require('../qParser/qParser');

Page({
  onLoad: function(options){
    var that = this;
    var html = '<p class="asd" style="background: #efefef;">如图，已知<em title="heihei">△ABC</em>是等腰直角三角形且AB>AC=BC<img src="http://www.zybang.com" style="width: 100px; height: 20px;" alt="test"><br title="test"/>求此三角形面积</p>';
    var json = qParser(html);
    that.setData({
        qParserData: json
    });
  },
  onReady: function(){
    // 页面渲染完成
  },
  onShow: function(){
    // 页面显示
  },
  onHide: function(){
    // 页面隐藏
  },
  onUnload: function(){
    // 页面关闭
  }
})