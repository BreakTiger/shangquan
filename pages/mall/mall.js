var app = getApp();
Page({


  data: {
    idx: 0,
    mall: [],
    shop: [],
    banner: [],
    three: [],
    banner_: [],
  },

  // 上面切换
  swichNav: function(e) {
    let that = this
    var cur = e.target.dataset.current;
    var index = e.target.dataset.index;
    console.log('index', index)
    let shop = that.data.mall[index].product
    if (!shop) {
      shop = ''
    }
    console.log('shop', shop, 'index', index)
    this.setData({
      idx: index,
      shop: shop
    })
  },

  //轮播图详情
  seeBanner(e) {
    console.log('e', e)
    let that = this
    let id = e.currentTarget.dataset.id
    app.agriknow.slider(id).then(res => {
      console.log('轮播详情', res.data.data.product)
      let product = res.data.data.product
      if (product.length > 0) {
        wx.navigateTo({
          url: '/pages/mall/seeBanner/seeBanner?id=' + id,
        })
      }else if(product.length == 0){

      }
    }).catch(err => {
      console.log(err)
    })
  },

  // 跳搜索页面
  search() {
    wx.navigateTo({
      url: '/pages/mall/search/search',
    })
  },

  //跳购物车页面
  shopCar() {
    wx.navigateTo({
      url: '/pages/mall/shopCar/shopCar',
    })
  },

  // 商品详情
  shopDetail(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    console.log('商品id', id)
    wx.navigateTo({
      url: '/pages/mall/shopDetail/shopDetail?id=' + id,
    })
  },

  //第一个轮播
  slider() {
    let that = this
    let area = wx.getStorageSync('area')
    // let area = app.globalData.area //地区全局数据
    console.log('area', area)
    let province = area[0].province //省
    let city = area[0].city // 城市
    let district = area[0].district //区
    // console.log('province', province, city, district)
    // 查询各版块轮播
    app.agriknow.getSliser(province, city, district, 8, 1).then(res => {
      console.log('查询各版块轮播上', res)
      that.setData({
        banner: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },


  //第二个轮播
  slider_() {
    let that = this
    let area = wx.getStorageSync('area')
    console.log('area', area)
    let province = area[0].province //省
    let city = area[0].city // 城市
    let district = area[0].district //区
    // console.log('province', province, city, district)
    // 查询各版块轮播
    app.agriknow.getSliser(province, city, district, 12, 1).then(res => {
      console.log('查询各版块轮播', res)
      that.setData({
        banner_: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },



  onLoad: function(options) {
    let that = this
    //百货页面查询商品
    app.agriknow.mall().then(res => {
      console.log(' 百货页面查询商品 onload =>', res)
      let idx = that.data.idx
      that.setData({
        mall: res.data.data.category,
        shop: res.data.data.category[idx].product
      })

    }).catch(err => {
      console.log(err)
    })
    // mallGoodlist  商品分类列表
    // app.agriknow.mallGoodlist().then(res => {
    //   console.log(' 商品分类列表 onload =>', res)
    //   // that.setData({
    //   //   mall: res.data.data.category,
    //   //   shop: res.data.data.category[0].product
    //   // })
    // }).catch(err => {
    //   console.log(err)
    // })
    that.getthree(); //查询三个列表
  },
  //查询三个列表
  getthree() {
    let that = this
    app.agriknow.mallbanner().then(res => {
      console.log('three', res)
      that.setData({
        three: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //-----------  下拉刷新 -----------
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.slider();
    this.onLoad();
    this.slider_();
  },
  onShow: function() {
    this.slider();
    this.slider_();
  }
})