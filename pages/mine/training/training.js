import modals from '../../../class/base/modal.js'
var app = getApp();
Page({


  data: {
    shop: [],
    img: '/img/img/add_pic@2x.png'
  },
  navTab(e) {
    let url;
    let selectindex = e.currentTarget.dataset.selectindex;
    let sid = e.currentTarget.dataset.sc_id
    console.log('sid', sid)
    console.log('selectIndex', selectindex)
    if (selectindex == 1) {
      url = "./product/product"
    } else if (selectindex == 2) {
      url = "./Commodity/Commodity"
    } else if (selectindex == 3) {
      url = "./Order/Order"
    } else if (selectindex == 4) {
      url = "./evaluation/evaluation"
    } else if (selectindex == 5) {
      url = "./promotion/promotion"
    } else if (selectindex == 6) {
      url = "./banner/banner?json=" + sid
    } else if (selectindex == 7) {
      // url = "./advertisement/advertisement"
      url = './advertisement/payAdver/payAdver'
    } else if (selectindex == 8) {
      url = "./wechat/wechat"
    } else {
      url = "./media/media"
    }
    if (url) {
      modals.navigate(url)
    }
  },
  goShopDetail() {
    let url = "/pages/mine/training/shopInfo/shopInfo"
    modals.navigate(url)
  },
  // 营业额
  turnover() {
    let url = "/pages/mine/training/turnover/turnover"
    modals.navigate(url)
  },
  // 我的账户
  account() {
    let url = "/pages/mine/training/account/account"
    modals.navigate(url)
  },
  seeShop() {
    let id = this.data.shop.id
    // if (this.data.shop.sc_id == 2) {
    //   wx.navigateTo({
    //     url: '/pages/index/spots/spots',
    //   })
    // } else {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
      })
    // wx.navigateTo({
    //   url: '/pages/mine/training/seeShop/seeShop',
    // })
  },
  ruturn() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  onLoad: function(options) {},
  onShow: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    let that = this
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data
      })
      app.globalData.shop = res.data.data //店铺信息存入全局
    }).catch(err => {
      console.log(err)
    })
  }
})