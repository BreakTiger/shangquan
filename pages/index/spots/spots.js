var app = getApp();
var QQMapWX = require('../../../qqmap-wx-jssdk.js');


var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});
Page({


  data: {
    outlist: [],
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
    shop: [],
    length: '',
    mall: [],
    phone: '',
    toInvitation: false,
    lot: false,
    few: true,
    user_id: ''
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
    // wx.navigateTo({
    //   url: '/pages/mall/shopDetail/mall/ecdoe/ecode?id=' + id,
    // })
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
  //地图
  area: function(e) {
    let lon = e.currentTarget.dataset.lon
    let lat = e.currentTarget.dataset.lat
    console.log(lon, lat)
    wx.navigateTo({
      url: '/pages/index/fastConsult/shop/stroelocation/stroelocation?lat=' + lat + '&&lon=' + lon,
    })
  },

  // -------- 点击图片放大 保存 -------
  previewImage1: function(e) {
    var that = this
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: that.data.shareTempFilePath.split(',')
      // 需要预览的图片http链接 使用split把字符串转数组。不然会报错 
    })
  },

  cal_alert() {
    this.setData({
      toInvitation: false
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

  onLoad: function(options) {
    var that = this
    console.log('options', options)
    let shopId = options.json //店铺id
    let uid = wx.getStorageSync('user').id



    // app.agriknow.shopDeatil(uid).then(res => {
    //   console.log('查询点店铺详情', res)
    //   app.globalData.shop = res.data.data //店铺信息存入全局
    console.log('shopId', shopId)
    app.agriknow.getShop_Product(shopId).then(res => {
      console.log(' 进入店铺 onload =>', res)
      let summary = res.data.data.store.summary
      let length;
      if (!summary) {
        length = 0
      } else {
        length = res.data.data.store.summary.split("").length;
      }
      console.log('length', length)
      console.log('res.data.data.store.store_phone', res.data.data.store.store_phone)
      that.setData({
        shop: res.data.data,
        mall: res.data.data.store,
        phone: res.data.data.store.store_phone,
        length: length,
      })
      var user_id = res.data.data.store.user_id
      that.setData({
        user_id: user_id
      })
      app.agriknow.getActiVity('', 1, user_id).then(res => {
        console.log('查询我的活动列表', res)
        that.setData({
          outlist: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
    // }).catch(err => {
    //   console.log(err)
    // })

  },

  // 进入活动详情
  activity: function(e) {
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let id = item.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/index/caseShare/activity/activity?id=' + id
    })
  },

  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.onLoad();
  },
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let uid = that.data.user_id
    app.agriknow.getActiVity('', pageN, uid).then(res => {
      console.log('查询我的活动列表', res)
      console.log('分页数据 pageN+', res)
      let result = res.data.data;
      if (result.length != 0) {
        pageN += 1;
        that.setData({
          pageN: pageN
        })
        setTimeout(function() {
          let item = that.data.outlist.concat(result)
          that.setData({
            outlist: item
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
  }
})