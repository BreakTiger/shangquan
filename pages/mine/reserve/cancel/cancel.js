const request = require('../../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../../class/base/modal.js'
const app = getApp();


Page({


  data: {
    all: '',
    phone: ''
  },


  onLoad: function(options) {
    let that = this
    let item = JSON.parse(options.data)
    console.log(item)
    that.setData({
      all: item
    })

    that.storedata()

  },

  storedata: function() {
    let that = this
    let all = that.data.all
    let sid = all.store_id
    let data = {
      store_id: sid
    }
    let url = app.globalData.api + 'mall/findselectstoreproduct'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let code = res.data.code
        if (code == 0) {
          let phone = res.data.data.store.store_phone
          that.setData({
            phone: phone
          })
        }
      })
  },

  phonecall: function() {
    let that = this
    let phone = that.data.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  // 支付
  paybtn: function(e) {
    let that = this
    let item = that.data.all
    console.log(item)
    let aprice = item.pay_price
    let openid = wx.getStorageSync('auth').openid
    let numbers = item.order_sn
    let data = {
      total_fee: aprice,
      openid: openid,
      out_trade_no: numbers
    }
    console.log(data)
    let url = app.globalData.api + 'pay/pay'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let jons = res.data.data
        that.wxpay(jons)
      })

  },

  wxpay: function(jons) {
    let that = this
    wx.requestPayment({
      'appId': jons.appId,
      'nonceStr': jons.nonceStr,
      'package': jons.package,
      'paySign': jons.paySign,
      'signType': jons.signType,
      'timeStamp': jons.timeStamp,
      success: function(res) {
        setTimeout(function() {
          wx.showToast({
            title: '支付成功',
          })
        }, 1500)
        wx.redirectTo({
          url: '/pages/mine/reserve/reserve',
        })
      },
      'fail': function(res) {
        console.log(res)
        setTimeout(function() {
          modals.showToast('支付失败', 'loading')
        }, 1500)
      }

    })
  },

  // 取消预定
  cancel: function(e) {
    let that = this
    let item = that.data.all
    console.log(item)
    let oid = item.id
    let data = {
      order_id: oid,
      tuihuo_yuanyin: '',
    }
    console.log(data)
    let url = app.globalData.api + 'mall/myordertuikuan'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('取消成功', 'none')
          wx.redirectTo({
            url: '/pages/mine/reserve/reserve',
          })
        }
      })

  },

  // 立即评价
  comment: function(e) {
    let that = this
    // console.log(that.data.all)
    let data = JSON.stringify(that.data.all)
    wx.navigateTo({
      url: '/pages/mine/reserve/comment/comment?data=' + data,
    })
  },

  // 立即使用
  usetap: function(e) {
    let that = this
    let item = that.data.all
    let id = item.id
    let data = {
      order_id: id
    }
    modals.loading()
    let url = app.globalData.api + 'mall/myordershouhuo'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('使用成功', 'none')
          wx.redirectTo({
            url: '/pages/mine/reserve/reserve',
          })
        }
      })
  },

  // 删除
  deltap: function(e) {
    let that = this
    let item = that.data.all
    let id = item.id
    let data = {
      order_id: id
    }
    let url = app.globalData.api + 'mall/deleteorder'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('删除成功', 'none')
          wx.redirectTo({
            url: '/pages/mine/reserve/reserve',
          })
        }
      })
  }


})