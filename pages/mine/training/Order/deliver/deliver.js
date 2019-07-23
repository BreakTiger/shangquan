var app = getApp();
Page({

  data: {
    oid: '',
  },
  teformSubmit(e) {
    let that = this
    let val = e.detail.value
    if (val.courier_company != '' && val.shipping_code != '') {
      let oid = that.data.oid
      let courier_company = val.courier_company
      let shipping_code = val.shipping_code
      console.log('oid', oid, courier_company, shipping_code)
      //店铺设置订单发货
      app.agriknow.storesetorderfahuo(oid, courier_company, shipping_code).then(res => {
        console.log('店铺设置订单发货', res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '成功',
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/mine/training/Order/Order',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '失败',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '请填充完整',
        icon: 'success',
        duration: 1500
      })
    }
  },

  onLoad: function(options) {
    let that = this
    // console.log('opt', options)
    let oid = options.oid
    this.setData({
      oid: oid
    })
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        sc_id: res.data.data.sc_id
      })
      app.globalData.shop = res.data.data //店铺信息存入全局
    }).catch(err => {
      console.log(err)
    })

  },

  onShow: function() {

  }

})