var app = getApp();
Page({


  data: {
    isChecked1: ''
  },
  onLoad: function(options) {
    let isChecked1 = app.globalData.isChecked1 
    this.setData({
      isChecked1: isChecked1
    })
  },
  switchChange: function(e) {
    var that = this
    let _type = e.detail.value //默认开店
    console.log('是否开店', _type)
    if (_type == true) { //1.开店
      that._switch(1);
      that.setData({
        isChecked1: true
      })
      app.globalData.isChecked1 = _type
      wx.showToast({
        title: '已开店',
      })
    } else { //false 0.关闭店铺
      that._switch(0);
      wx.showToast({
        title: '已关闭',
      })
      that.setData({
        isChecked1: false
      })
      app.globalData.isChecked1 = _type
    }
  },
  _switch(num) {
    let uid = wx.getStorageSync('user').id
    app.agriknow.setUp(uid, num).then(res => {
      console.log('.res =>', res)
    }).catch(err => {
      console.log(err)
    })
  },
  information() {
    wx.navigateTo({
      url: '/pages/mine/training/shopInfo/information',
    })
  },
  distribution() {
    wx.navigateTo({
      url: '/pages/mine/training/shopInfo/distribution',
    })
  }
})