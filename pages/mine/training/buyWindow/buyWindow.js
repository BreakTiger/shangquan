var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: ["请选择", "1个", "2个", "3个", "4个", "5个", "6个", "7个", "8个", "9个", "10个", "11个", "12个", "13个", "14个", "15个"],
    numIndex: 0,
    time: ["请选择", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "7个月", "8个月", "9个月", "10个月", "11个月", "12个月"],
    timeindex: 0,
    price: 0,
    text: '',
    shop: []
  },
  num: function(e) {
    let that = this
    console.log('时间', e.detail.value)
    let numIndex = e.detail.value
    this.setData({
      numIndex: numIndex
    })
    //计算橱窗价格
    let num = numIndex
    // let time = e.detail.value
    let sid = that.data.shop.id
    app.agriknow.windowPrice(sid, num).then(res => {
      console.log('计算橱窗价格', res.data)
      that.setData({
        price: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  num1: function(e) {
    let that = this
    console.log('件数', e.detail.value)
    this.setData({
      timeindex: e.detail.value
    })
    //计算橱窗价格
    let num = that.data.numIndex
    let time = e.detail.value
    app.agriknow.windowPrice(time, num).then(res => {
      console.log('计算橱窗价格', res.data)
      that.setData({
        price: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })

  },
  toSubmit(e) {
    let that = this
    let val = e.detail.value
    let sid = app.globalData.shop.id
    let num = val.num
    let month = val.month
    let money = val.money
    console.log('val', val)
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    if (that.data.numIndex != 0 && money != 0) {
      app.agriknow.pay_window(sid, num, money).then(res => {
        console.log('购买橱窗', res)
        //formid 收集
        app.agriknow.formId(formid, openid, uid).then(res => {
          console.log('fromid收集', res)
        }).catch(err => {
          console.log(err)
        })
        if (res.data.code == 200) {
          wx.showToast({
            title: '购买成功',
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/mine/training/Commodity/Commodity',
            })
          }, 1500)
        } else if (res.data.message == "广告币不足") {
          wx.showToast({
            title: '广告币不足',
          })
        } else {
          wx.showToast({
            title: '购买失败',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '填充完整',
      })
    }

  },
  onLoad: function(options) {
    let that = this
    app.agriknow.getText(34).then(res => {
      console.log('说明', res)
      that.setData({
        text: res.data.data.data
      })
    }).catch(err => {
      console.log(err)
    })
    let uid = wx.getStorageSync('user').id
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data
      })


    }).catch(err => {})
  }

})