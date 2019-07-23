var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({


  data: {
    text: '',
    nodes: [],
  },
  agree () {
    wx.navigateTo({
      url: '/pages/mine/collection/agree/agree',
    })
  },

  // onLoad: function (options) {
  //   var that = this
  //   let item = JSON.parse(options.jsonStr)
  //   console.log('text->', item)
  //   this.setData({
  //     text: item
  //   })
  // }
  admission(text) {
    // var text = e.currentTarget.dataset.text;
    let str = JSON.stringify(text);
    wx.navigateTo({
      url: '/pages/mine/collection/admission/admission?jsonStr=' + str,
    })
  },

  onLoad: function(options) {
    let that = this
    app.agriknow.admission().then(res => {
      console.log('onload.res =>', res)
      let text = res.data[0].value
      let img = res.data[1].value
      that.setData({
        text: text,
        img: img
      })
      let article = text
      WxParse.wxParse('article', 'html', article, that, 5);
      that.setData({
        nodes: article
      })
      // that.admission(text);
    }).catch(err => {
      console.log(err)
    })
  },
})