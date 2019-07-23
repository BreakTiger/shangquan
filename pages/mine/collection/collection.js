var app = getApp();
Page({


  data: {
    text: '',
    img: ''
  },
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
      that.admission(text);
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {}
})