var app = getApp();
Page({


  data: {
    shareTempFilePath: ''
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function (e) {
    var that = this
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: that.data.shareTempFilePath.split(',')
      // 需要预览的图片http链接 使用split把字符串转数组。不然会报错 
    })
  },
  //保存至相册
  saveImageToPhotosAlbum: function() {
    let that = this
    wx.downloadFile({
      url: that.data.shareTempFilePath,
      success: function(res) {
        console.log('保存到相册', res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log('保存成功', res)
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function(res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  },
  onLoad: function(options) {
    let that = this
    // console.log(options)
    let id = options.id
    app.agriknow.token().then(res => {
      console.log('获取用户token', res)
      let token = res.data.data.access_token
      //获取用户二维码
      app.agriknow.ecode(token, id).then(res => {
        console.log('二维码', res)
        that.setData({
          shareTempFilePath: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {

  }
})