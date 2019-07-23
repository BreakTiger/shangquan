const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: ''
  },

  onLoad: function (options) {
    let that = this
    let allinfo = JSON.parse(options.data)
    console.log(allinfo)
    that.setData({
      all: allinfo
    })
  },


  // 取消订单
  cancelTap: function () {
    let that = this
    let item = that.data.all
    // console.log(item)
    let id = item.id
    let data = {
      order_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'mall/deleteorder'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '取消成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/mine/orderList/orderList',
            })
          }, 1500)
        } else {
          modals.showToast('取消失败，请稍后重试', 'none')
        }
      })
  },

  // 立即支付
  payTap: function () {
    let that = this
    let item = that.data.all
    let money = item.money
    let open = wx.getStorageSync('auth').openid
    let number = item.order_sn
    let data = {
      total_fee: money,
      openid: open,
      out_trade_no: number
    }
    console.log(data)
    let url = app.globalData.api + 'pay/pay'
    modals.loading()
    request.sendRequest(url, 'post', data, {
      "Content-Type": "application/x-www-form-urlencoded"
    })
      .then(function (res) {
        modals.loaded()
        console.log(res)
        let jons = res.data.data
        that.wxpay(jons)
      })
  },

  // 微信支付
  wxpay: function (jons) {
    let that = this
    wx.requestPayment({
      'appId': jons.appId,
      'nonceStr': jons.nonceStr,
      'package': jons.package,
      'paySign': jons.paySign,
      'signType': jons.signType,
      'timeStamp': jons.timeStamp,
      success: function (res) {
        wx.showToast({
          title: '支付成功',
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }, 1500)
      },
      'fail': function (res) {
        console.log(res)
        modals.showToast('支付失败', 'loading')
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }, 1500)
      }
    })
  },

  // 取消订单
  cancelTap: function () {
    let that = this
    let item = that.data.all
    let id = item.id
    let data = {
      order_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'mall/deleteorder'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }

      })
  },


  // 确认收货
  receive: function () {
    let that = this
    let item = that.data.all
    let id = item.id
    let data = {
      order_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'mall/myordershouhuo'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('成功收货', 'none')
          that.allorder()
        } else {
          modals.showToast('收获失败，请稍后重试', 'none')
        }
      })

  },



  // 申请退款
  refund: function () {
    let that = this
    // console.log(that.data.all.product)
    let data = JSON.stringify(that.data.all)
    wx.navigateTo({
      url: '/pages/mine/ordermain/refund/refund?data=' + data,
    })
  },




  // 立即评价
  evaluate: function () {
    wx.navigateTo({
      url: '/pages/mine/ordermain/confirm/confirm',
    })
  },

  // 删除
  del: function () {
    let that = this
    let item = that.data.all
    // console.log(item)
    let id = item.id
    let data = {
      order_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'mall/deleteorder'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '取消成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/mine/orderList/orderList',
            })
          }, 1500)
        } else {
          modals.showToast('删除失败，请稍后重试', 'none')
        }
      })
  }


})