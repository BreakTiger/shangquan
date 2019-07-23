var app = getApp();
Page({


  data: {
    other: [],
    shop: [],
    product: []
  },
  onLoad: function(options) {
    let that = this
    let sid = options.id
    app.agriknow.slider(sid).then(res => {
      console.log('轮播详情', res.data.data.product)
      that.setData({
        product: res.data.data.product
      })
    }).catch(err => {
      console.log(err)
    })
  },
  look_(e) {
    console.log('e', e)
    let that = this
    let type_ = e.currentTarget.dataset.type //方式 //1是店铺 2是商品 3入驻 4活动
    let id = e.currentTarget.dataset.product_id //商品id
    console.log('type_', type_)
    if (type_ == 1) {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
      })
    } else if (type_ == 2) {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/shopDetail?id=' + id,
      })
    } else if (type_ == 3) {
      wx.navigateTo({
        url: '/pages/mine/collection/agree/agree',
      })
    } else if (type_ == 4) {
      wx.navigateTo({
        url: '/pages/index/integral/integral'
      })
    }
  },
  look(e) {
    let id = e.currentTarget.dataset.product_id
    let sid = e.currentTarget.dataset.id
    let type_ = e.currentTarget.dataset.type
    console.log('sid', sid)
    console.log('type_', type_)
    if (type_ == 4) { //
      // console.log('我是美食id', sid)
      // wx.navigateTo({
      //   url: '/pages/index/fastConsult/shop/shop?data=' + sid,
      // })
      console.log('我是百货', id)
      wx.navigateTo({
        url: '/pages/mall/shopDetail/shopDetail?id=' + id,
      })
    } else {
      console.log('我是美食id', sid)
      wx.navigateTo({
        url: '/pages/index/fastConsult/shop/shop?data=' + sid,
      })
    }
  },
  onShow: function() {

  }
})