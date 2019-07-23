const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp();



Page({
  data: {
    selected: 0,
    tablist: ['全部', '待发货', '待收货', '退款售后', '已完成'],
    current: 'tab1',
    current_scroll: 'tab1',
    all: [],
    allList: '',
    order: []
  },

  onLoad: function() {
    let that = this
    that.allorder()
  },

  //tab框
  selected: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    // console.log(index)
    that.setData({
      selected: index
    })
    let order = that.data.order
    if (index == 0) { //全部
      that.setData({
        all: that.data.order.quanbu
      })
    } else if (index == 1) { //代发货
      if (order.daifahuo) {
        that.setData({
          all: order.daifahuo
        })
      } else {
        that.setData({
          all: []
        })
      }
    } else if (index == 2) { //待收货
      if (order.daishouhuo) {
        that.setData({
          all: order.daishouhuo
        })
      } else {
        that.setData({
          all: []
        })
      }
    } else if (index == 3) { //退款售后
      if (order.tuikuan) {
        that.setData({
          all: order.tuikuan
        })
      } else {
        that.setData({
          all: []
        })
      }
    } else if (index == 4) { //已完成
      if (order.yiwancheng) {
        that.setData({
          all: order.yiwancheng
        })
      } else {
        that.setData({
          all: []
        })
      }
    }
  },

  // 所有订单数据
  allorder: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    let url = app.globalData.api + 'mall/selectmyorder'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('所有的订单数据', res)
        if (res.data.message == "暂无订单") {
          that.setData({
            allList: true
          })
        } else {
          that.setData({
            allList: false
          })
        }
        let result = res.data.data
        // console.log(result)
        let all = result.quanbu
        let index = that.data.selected
        console.log(all)
        if (index == 0) {
          that.setData({
            all: all
          })
        }else if(index == 1){
          that.setData({
            all: result.daifahuo || []
          })
        }else if (index == 2){
          that.setData({
            all: result.daishouhuo || []
          })
        }else if(index == 3){
          that.setData({
            all: result.tuikuan || []
          })
        }else if(index == 4){
          that.setData({
            all: result.yiwancheng || []
          })
        }
        that.setData({
          order: result
        })
      })
  },

  // 支付
  payTap: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
    let money = item.money
    let open = wx.getStorageSync('auth').openid
    let id = item.order_sn
    let data = {
      total_fee: money,
      openid: open,
      out_trade_no: id
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
        setTimeout(function() {
          wx.showToast({
            title: '支付成功',
          })
          that.allorder()
        }, 1500)
      },
      'fail': function(res) {
        console.log(res)
        setTimeout(function() {
          modals.showToast('支付失败', 'loading')
        }, 1500)
      }

    })

  },

  // 取消订单删除
  cancelTap: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
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
          that.allorder()
        } else if (res.data.message == "该订单暂时无法删除") {
          wx.showModal({
            title: '提示',
            content: '该订单暂时无法删除',
            showCancel: false
          })
        }
      })
  },


  // 确认收货
  receive: function(e) {
    let that = this
    let id = e.currentTarget.dataset.item.id
    let order_sn = e.currentTarget.dataset.item.order_sn
    let data = {
      order_id: id,
      order_sn: order_sn
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
          that.allorder()
        } else {
          modals.showToast('收货失败，请稍后重试', 'none')
        }
      })

  },


  // 申请退款
  refund: function(e) {
    let that = this
    let data = JSON.stringify(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.item.product)
    wx.navigateTo({
      url: '/pages/mine/ordermain/refund/refund?data=' + data,
    })
  },


  // 立即评价
  evaluate: function(e) {
    let that = this
    let data = JSON.stringify(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/mine/ordermain/confirm/confirm?data=' + data
    })
  },


  // 进入订单详情
  ordermain: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let all = that.data.all
    let data = JSON.stringify(all[index])
    let url = '/pages/mine/ordermain/ordermain?data='
    modals.navigate(url, data)
  },

  onPullDownRefresh: function() {
    let that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    that.allorder()
  },

});