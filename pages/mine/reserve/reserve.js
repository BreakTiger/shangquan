const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

Page({


  data: {
    selected: 0,
    list: ['全部', '待付款', '待使用', '已取消', '已完成'], //tab
    book: [],
    act: ''
  },

  onLoad: function(options) {
    let that = this
    that.predetermine()
  },

  //tab框切换
  selected: function(e) {
    let that = this

    let index = e.currentTarget.dataset.index

    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1
      })
    } else if (index == 2) {
      that.setData({
        selected: 2
      })
    } else if (index == 3) {
      that.setData({
        selected: 3
      })
    } else {
      that.setData({
        selected: 4
      })
    }
    that.predetermine()
  },

  // 预定列表
  predetermine: function() {
    let that = this
    let tab = that.data.selected
    console.log(tab)
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id,
      type: tab
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'tcshop/store.activity_order_list'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let result = res.data.data
        console.log(result, 'length', result.length)
        if (result) {
          that.setData({
            act: false
          })
        } else {
          that.setData({
            act: true
          })
        }
        that.setData({
          book: result
        })
      })


  },

  // 付款
  payment: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
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
        that.predetermine()
      },
      'fail': function(res) {
        console.log(res)
        modals.showToast('支付失败', 'loading')
      }

    })
  },

  // 取消预定
  cencal: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
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
          that.predetermine()
        }
      })
  },

  // 进入详情页面
  getIn: function(e) {
    let that = this
    let data = JSON.stringify(e.currentTarget.dataset.item)
    // console.log(data)
    wx.navigateTo({
      url: '/pages/mine/reserve/cancel/cancel?data=' + data,
    })

  },


  // 立即评价
  comment: function(e) {
    let that = this
    let data = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/mine/reserve/comment/comment?data=' + data,
    })
  },


  deltap: function(e) {
    let that = this
    console.log(e)
    let item = e.currentTarget.dataset.item
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
          that.predetermine()
        }
      })

  },



  // 立即使用
  usetap: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let id = item.id
    console.log(id)
    let data = {
      order_id: id
    }
    let url = app.globalData.api + 'mall/myordershouhuo'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('使用成功', 'none')
          that.predetermine()
        } else if (res.data.message = "该订单无法设为已收货"){
          wx.showModal({
            title: '提示',
            content: '该订单无法设为已收货,请稍微重试',
            showCancel:false
          })
        }
      })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.predetermine()
  }




})