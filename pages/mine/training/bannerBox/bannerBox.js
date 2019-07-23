var app = getApp();
Page({


  data: {
    slider: '',
  },
  payBanner() {
    wx.navigateTo({
      url: '/pages/mine/training/payBanner/payBanner',
    })
  },
  // 添加商品图
  addShop(e) {
    let oid = e.currentTarget.dataset.oid
    wx.navigateTo({
      url: '/pages/mine/training/bannerBox/addShop/addShop?oid=' + oid,
    })
  },
  //修改轮播图
  _post(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/mine/training/bannerBox/post/post?item=' + JSON.stringify(item),
    })
  },
  //删除
  close(e) {
    console.log(e)
    let that = this
    let pid = e.currentTarget.dataset.id
    console.log('pid', pid)
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.detele(pid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除
  detele(product_id) {
    let that = this
    app.agriknow.deletesliderproduct(product_id).then(res => {
      console.log(' 删除结果', res)
      if (res.data.code == 0) {
        that.slider();
        wx.showToast({
          title: '删除成功',
        })
      } else {
        wx.showToast({
          title: '删除失败',
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      slider_id: options.slider_id
    })
    if (options.slider_id) {
      that.slider(); //查询推广轮播内容
    }
  },

  //查询推广轮播内容
  slider() {
    let that = this
    let slider_id = that.data.slider_id //轮播id
    app.agriknow.slider(slider_id).then(res => {
      console.log('查询推广轮播内容', res)
      that.setData({
        slider: res.data.data.other,
        content: res.data.data.product
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {}
})