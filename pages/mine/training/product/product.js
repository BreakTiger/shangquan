var app = getApp();
Page({


  data: {
    pro: [],
  },
  setTop() {
    wx.navigateTo({
      url: '/pages/mine/training/setTop/setTop',
    })
  },
  //--添加置顶产品
  goCar() {
    let that = this
    let shop = app.globalData.shop
    console.log('shop', shop)
    let sc_id = shop.sc_id
    // if (sc_id == 4 || sc_id == 2) {
      wx.navigateTo({
        url: '/pages/mine/training/product/goCar/goCar',
      })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '暂无权限',
    //     showCancel: false, //是否显示取消按钮
    //   })
    // }
  },
  //查看我的推广产品
  seeAll() {
    let that = this
    let sid = app.globalData.shop.id
    app.agriknow.getpro(sid).then(res => {
      console.log(' 查看我的推广产品', res)
      that.setData({
        pro: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(options) {
    this.seeAll();
  },

  onShow: function() {

  }

})