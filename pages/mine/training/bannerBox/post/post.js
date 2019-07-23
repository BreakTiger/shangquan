var app = getApp();
// const request = require('../../../../class/api/_request.js')
Page({


  data: {
    banner : [],
  },
  //上线产品
  bindPickerChange: function (e) {
    console.log('上线产品', e.detail.value)
    this.setData({
      shopindex: e.detail.value
    })

  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    let item = JSON.parse(options.item)
    console.log('item', item)
    that.setData({
      banner : item
    })
    //getOnline 查询本店铺上线产品
    let store_id = app.globalData.shop.id
    app.agriknow.getOnline(store_id).then(res => {
      console.log('查询本店铺上线产品', res)
      that.setData({
        shop: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })

  },
  teformSubmit(e) {
    let val = e.detail.value
    let that = this
    console.log('val', val)
    let other_id = that.data.banner.id
    let title = val.title
    let content = val.content
    if (val.title != '' && val.content != '' ) {
      app.agriknow.modify(other_id, title, content).then(res => {
        console.log('表单提交结果', res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/mine/training/training',
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
  onShow: function () {
    console.log(app.globalData.shop)
  },



})