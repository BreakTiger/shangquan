var app = getApp();
Page({


  data: {
    shareTempFilePath: '',
    //tab框
    selected: 0,
    list: ['我的邀请', '店铺邀请'],
    img: '',
    winHeight: '',
  },
  //tab框
  selected(e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1
      })
      let uid = wx.getStorageSync('user').id
      // 查询点店铺详情
      app.agriknow.shopDeatil(uid).then(res => {
        console.log('查询点店铺详情', res)
        if (res.data.data.store_avatar) {
          let id = res.data.data.id
          // app.globalData.shop = res.data.data //店铺信息存入缓存
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
        } else {
          wx.showModal({
            title: '提示',
            content: '请先完善店铺信息',
            showCancel: false
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 2000)
        }

      }).catch(err => {
        console.log(err)
      })
    }
  },

  // -------- 点击图片放大 保存 -------
  previewImage: function(e) {
    var that = this
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: that.data.shareTempFilePath.split(',')
      // 需要预览的图片http链接 使用split把字符串转数组。不然会报错 
    })
  },
  // -------- 点击图片放大 保存 -------
  previewImage1: function(e) {
    var that = this
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: that.data.img.split(',')
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
            wx.showToast({
              title: '保存失败',
            })
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  },
  saveImageToPhotosAlbum1: function() {
    console.log('保存到相册 我的邀请')
    let that = this
    wx.downloadFile({
      url: that.data.img,
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
            wx.showToast({
              title: '保存失败',
            })
          }
        })
      },
      fail: function() {
        console.log('fail')
        wx.showToast({
          title: '保存失败',
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
    let uid = wx.getStorageSync('user').id
    app.agriknow.token().then(res => {
      console.log('获取用户token', res)
      let token = res.data.data.access_token
      //获取用户二维码
      app.agriknow.postCode(token, uid).then(res => {
        console.log('二维码', res)
        that.setData({
          img: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  }
})