var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
  },
  goBanner() {
    // wx.navigateTo({
    //   url: '/pages/mine/training/slider/slider',
    // })
    wx.navigateTo({
      url: '/pages/mine/training/payBanner/payBanner',
    })
  },
  goBannerBox(e) {
    // console.log(e)
    let slider_id = e.currentTarget.dataset.slider_id
    wx.navigateTo({
      url: '/pages/mine/training/bannerBox/bannerBox?slider_id=' + slider_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onShow: function() {
    let that = this
    //查询我的店铺轮播推广
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    let sid = null;
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data
      })
      let sid = res.data.data.id
      app.agriknow.getBanner(sid).then(res => {
        console.log(' 查询我的店铺轮播推广 onload =>', res)
        that.setData({
          banner: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
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
  }


})