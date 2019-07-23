var app = getApp();
Page({

  data: {
    idx: 0,
    indexid: 0,
    search: [],
    search: [],
  },
  lotSelect(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      idx: index
    })
  },
  select(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      indexid: index
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
  wxSearchConfirm: function(e) {
    let that = this
    console.log('搜索框', e)
    var key = e.detail.value;
    //搜索
    app.agriknow.mallSearch(key).then(res => {
      console.log('搜索', res.data)
      that.setData({
        search : res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  onLoad: function(options) {

  },

  onShow: function() {

  }

})