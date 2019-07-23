const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp();

Page({


  data: {
    all: '',
    product: [],
    phone: '',
    youhui: '',
    store: '',
    sum:''
  },


  onLoad: function(options) {
    let that = this
    let all = JSON.parse(options.data)
    console.log(all)
    let pro = all.product

    // let allinfo = JSON.parse(options.data)
    // console.log('allinfo',allinfo)
    // let goodsinfo = allinfo.product
    // console.log(goodsinfo)

    that.setData({
      all: all,
      product: pro
    })
    that.storedata()
  },

  storedata: function() {
    let that = this
    let order = that.data.all
    let sid = order.store_id
    let data = {
      store_id: sid
    }
    // console.log(data)
    let url = app.globalData.api + 'mall/findselectstoreproduct'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          let store = res.data.data.store
          let phone = res.data.data.store.store_phone
          that.setData({
            store: store,
            phone: phone
          })
        }
      })
    that.calculate()
  },


  // 计算
  calculate: function() {
    let that = this
    // 获取实际支付
    let pay = that.data.all.money
    console.log('订单实际支付：', pay)

    let pro = that.data.product
    console.log(pro)
    let sum = 0
    for (let i = 0; i < pro.length; i++) {
      // 数量
      let num = pro[i].goods_num
      // 单价
      let aprice = pro[i].goods_price

      // 一种商品的总价
      let total = aprice * 1000 * num / 1000
      // console.log(total)
      sum += total
      console.log(sum)
      let sums = sum.toFixed(2)
      // console.log('未减扣的总价：', sums)
      // let youhui = sums - pay
      let youhui = Math.round((parseFloat(sums) - parseFloat(pay)) * 100) / 100
      console.log('优惠', youhui)
      that.setData({
        youhui: youhui,
        sum: sum
      })
    }
  },

  // 联系商家
  phonecall: function() {
    let that = this
    let phone = that.data.phone
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },


  // 取消订单
  cancelTap: function() {
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
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '取消成功',
          })
          setTimeout(function() {
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
  payTap: function() {
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
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let jons = res.data.data
        that.wxpay(jons)
      })
  },

  // 微信支付
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
        wx.showToast({
          title: '支付成功',
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }, 1500)
      },
      'fail': function(res) {
        console.log(res)
        modals.showToast('支付失败', 'loading')
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }, 1500)
      }
    })
  },


  // 确认收货
  receive: function() {
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
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('成功收货', 'none')
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        } else {
          modals.showToast('收获失败，请稍后重试', 'none')

        }
      })
  },

  // 申请退款
  refund: function() {
    let that = this
    let data = JSON.stringify(that.data.all)
    wx.navigateTo({
      url: '/pages/mine/ordermain/refund/refund?data=' + data,
    })
  },


  // 立即评价
  evaluate: function() {
    let that = this
    console.log(that.data.all)
    let data = JSON.stringify(that.data.all)
    wx.navigateTo({
      url: '/pages/mine/ordermain/confirm/confirm?data=' + data,
    })
  },

  // 删除
  del: function() {
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
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '删除成功',
          })
          setTimeout(function() {
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