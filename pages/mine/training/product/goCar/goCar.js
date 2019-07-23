var app = getApp();
import usual from '../../../../../class/base/usual.js'
Page({

  data: {
    shopData: [],
    showPro: true,
    jiesuan: 0.00
  },

  onLoad: function(options) {
    let that = this
    let store_id = app.globalData.shop.id
    //搜索产品
    app.agriknow.searchShop(store_id).then(res => {
      console.log('搜索产品', res.data.data)
      // usual.selectAll(res.data.data)
      usual.sum(res.data.data)
      let jiesuan = wx.getStorageSync('jiesuan', jiesuan)
      that.setData({
        jiesuan: jiesuan
      })
      that.setData({
        shopData: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //单选
  danxuan(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let shopData = that.data.shopData
    shopData[index].selected = !shopData[index].selected
    console.log(shopData[index])
    console.log('单选', shopData)
    usual.sum(shopData)
    let jiesuan = wx.getStorageSync('jiesuan', jiesuan)
    that.setData({
      jiesuan: jiesuan,
      shopData: shopData
    })
    console.log('that.data.shopData', that.data.shopData)
  },
  //结算订单
  topay() {
    let that = this
    console.log('shopData', that.data.shopData)
    let data = [];
    that.data.shopData.forEach(function(item) {
      if (item.selected == "true" || item.selected == true) data.push(item);
    })
    console.log('data',data)
    let str = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/mine/training/setTop/setTop?json=' + str,
    })
  },


  onShow: function() {

  }


})