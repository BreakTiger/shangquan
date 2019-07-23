const app = getApp();
Page({


  data: {
    lot: false,
    few: true,
    shop: [],
    phone: '',
    avg_cores: '',
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
    length: '',
    ellipsis: true, // 文字是否收起，默认收起
    shareTempFilePath: '',
    toInvitation: false
  },
  cal_alert() {
    this.setData({ toInvitation: false})
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

  ellipsis: function() {
    var value = !this.data.ellipsis;
    this.setData({
      ellipsis: value
    })
  },
  // 查看更多
  few_() {
    this.setData({
      lot: true,
      few: false
    })
  },
  // 收起
  lot_() {
    this.setData({
      lot: false,
      few: true
    })
  },
  //拨打电话
  phone() {
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phone //需要拨打的电话号码
    })
  },
  onLoad: function(options) {
    let that = this
    //点击店铺进入店铺详情
    // console.log('wx.getStorageSync(user)', wx.getStorageSync('user'))
    let uid = wx.getStorageSync('user').id
    let phone = wx.getStorageSync('user').mobile
    app.agriknow.getShopDetail(uid).then(res => {
      console.log('点击店铺进入店铺详情', res.data.data)
      let avg_cores = Math.ceil(res.data.data.avg_cores)
      let allShop = res.data.data.summary
      let length = allShop.split("").length;
      console.log('length', length)
      that.setData({
        shop: res.data.data,
        phone: phone,
        avg_cores: avg_cores,
        length: length
      })
    }).catch(err => {
      console.log(err)
    })
    // 商品列表
    let sid = app.globalData.shop.id
    app.agriknow.getShop_(sid, 1).then(res => {
      console.log('店铺商品', res)
      that.setData({
        mall: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  // 返回我的店铺
  return_() {
    wx.navigateTo({
      url: '/pages/mine/training/training',
    })
  },
  area(e) {
    let lon = e.currentTarget.dataset.lon
    let lat = e.currentTarget.dataset.lat
    console.log('lon', lon, lat)
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/map/map?lon=' + lon + "&&lat=" + lat,
    })
  },
  onShow: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    // let item = this.data.teacherData;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let sid = app.globalData.shop.id
    app.agriknow.getShop_(sid, pageN).then(res => {
      console.log('分页数据 pageN+', res)
      let result = res.data.data;
      if (result.length != 0) {
        pageN += 1;
        that.setData({
          pageN: pageN
        })
        setTimeout(function() {
          let item = that.data.mall.concat(result)
          that.setData({
            mall: item
          });
          console.log('pageN', pageN, '地区分页', item)
        }, 1000);
      } else {
        that.setData({
          pageTottomText: getApp().globalData.endText,
        });
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //店铺二维码
  ecode(e) {
    var that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      toInvitation: true
    })
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
    // let id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/mine/training/mall/ecdoe/ecode?id=' + id,
    // })
  },

})