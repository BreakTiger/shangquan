var app = getApp();
Page({


  data: {
    user: '',
    points_count: '',
    list: [],
    avatar: '',
    toInvitation: false,
    img:''
  },
  //取消遮罩
  cal_alert() {
    this.setData({
      toInvitation: false
    })
  },


  // 我的推广
  toInvitation() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var that = this
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
    that.setData({
      toInvitation: true
    })

  },
  //保存至相册
  saveImageToPhotosAlbum: function () {
    let that = this
    wx.downloadFile({
      url: that.data.img,
      success: function (res) {
        console.log('保存到相册', res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('保存成功', res)
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
            wx.showToast({
              title: '保存失败',
            })
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },

  //普通用户抽取红包
  join(e) {
    let that = this
    let uid = wx.getStorageSync('user').id
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    app.agriknow.envelopes(uid, id).then(res => {
      console.log('普通用户抽取红包', res)
      app.agriknow.myJoin(uid).then(res => {
        console.log('我的邀请', res)
        that.setData({
          list: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },

  onLoad: function(options) {
    let user = wx.getStorageSync('user')
    this.setData({
      user: user
    })
  },

  onShow: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.allP(uid).then(res => {
      console.log('查询我的金额', res)
      that.setData({
        points_count: parseInt(res.data.data.points_count)
      })
    }).catch(err => {
      console.log(err)
    })
    // app.agriknow.goJoin(uid).then(res => {
    //   console.log('查询积分列表', res)
    //   that.setData({
    //     list: res.data.data
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
    app.agriknow.myJoin(uid).then(res => {
      console.log('我的邀请', res)
      that.setData({
        list: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
    //判断是不是商家
    app.agriknow.select(uid).then(res => {
      console.log('判断是否商家', res)
      let num = parseInt(res.data.data.status) //0 1
      console.log('num', num)
      that.setData({
        code: num
      })
      if (num == 1) {
        // 查询点店铺详情
        app.agriknow.shopDeatil(uid).then(res => {
          console.log('查询点店铺详情', res)
          that.setData({
            shop: res.data.data,
            avatar: res.data.data.store_avatar,
            id: res.data.data.id
          })
          if (!res.data.data.store_avatar) {
            wx.showModal({
              title: '提示',
              content: '请上传店铺头像',
              showCancel: false
            })
          }
          app.globalData.shop = res.data.data //店铺信息存入全局
        }).catch(err => {
          console.log(err)
        })
      } else {
        let user = wx.getStorageSync('user')
        this.setData({
          avatar: user.avatar
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onShareAppMessage: function(res) {
    let users = wx.getStorageSync('user');
    console.log('form_uid=', users.id)
    if (res.from === 'button') {}
    return {
      title: '我发了3个百元红包，赶紧去抢，手慢无!',
      path: '/pages/index/index?form_uid=' + users.id,
      success: function(res) {}
    }
  }
})