var app = getApp();
Page({


  data: {
    allinfo: {},
    imgbox: '',
    alert: false,
    shipping_fee: '',
    pay: 0,
    goodsPrice: 0,
    num: '',
    concession: 0,
    zhekou: '',
    points: 0,
    code: '',
    sc_id: ''
  },

  onLoad: function(options) {
    let that = this
    // console.log('option',options)
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        sc_id: res.data.data.sc_id
      })
      console.log('sc_id', res.data.data.sc_id)
      app.globalData.shop = res.data.data //店铺信息存入全局
    }).catch(err => {
      console.log(err)
    })
    let allinfo = JSON.parse(options.data)
    console.log('所有订单的信息', allinfo)
    //------------------------------------------
    /**
     * 活动景点
     * 
     */
    let identity_number = allinfo.identity_number
    if (identity_number) {
      that.setData({
        code: true
      })
    } else {
      that.setData({
        code: false
      })
    }

    //--------------------------------------------
    let shipping_fee = parseInt(allinfo.shipping_fee)
    that.setData({
      allinfo: allinfo,
      shipping_fee: shipping_fee
    })
    console.log('oid', that.data.allinfo.id)
    let points = parseInt(that.data.allinfo.points)
    //计算实际支付
    let pay = 0
    let product = allinfo.product
    let pay_all = 0
    let num = 0
    for (let i in product) {
      pay = product[i].pay_price * 1000 * product[i].goods_num / 1000
      num += product[i].goods_num
      that.setData({
        pay: pay,
        num: num
      })
      console.log('pay', pay)
      pay_all += that.data.pay
      console.log('pay_all', pay_all)
      pay = 0
    }
    let zhekou = allinfo.record[0].is_member_zhekou * that.data.num
    //计算总共支付
    let goodsPrice = 0
    let goodAll = 0
    for (let i in product) {
      goodsPrice = product[i].goods_price * 1000 * product[i].goods_num / 1000
      that.setData({
        goodsPrice: goodsPrice
      })
      console.log('goodsPrice', goodsPrice)
      goodAll += that.data.goodsPrice
      console.log('goodAll', goodAll)
      goodsPrice = 0
    }
    that.setData({
      pay_all: pay_all,
      goodAll: goodAll,
      zhekou: zhekou,
      points: points
    })
    console.log('that.data.goodAll', that.data.goodAll, 'that.data.pay_all', that.data.pay_all)
    // let concession = that.data.goodAll - that.data.pay_all
    let concession = Math.round((parseFloat(that.data.goodAll) - parseFloat(that.data.pay_all)) * 100) / 100
    that.setData({
      concession: concession
    })
  },
  canceled(e) {
    let oid = e.currentTarget.dataset.id
    console.log('oid', oid)
    wx.navigateTo({
      url: '/pages/mine/training/Order/deliver/deliver?oid=' + oid,
    })
  },
  //拒绝退款
  refund() {
    // wx.navigateTo({
    //   url: '/pages/mine/ordermain/refund/refund',
    // })
    let that = this
    let oid = that.data.allinfo.id
    let text = '拒绝退款'
    console.log('订单id', oid)
    wx.showModal({
      title: '提示',
      content: '确认拒绝退款？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.agriknow.refuse(oid, text).then(res => {
            console.log('拒绝退款', res)
            if (res.data.code == 0) {
              wx.showToast({
                title: '拒绝退款成功',
              })
              wx.redirectTo({
                url: '/pages/mine/training/Order/Order',
              })
            } else {
              wx.showToast({
                title: '失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //拨打买家电话
  phone() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '拨打买家电话？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.makePhoneCall({
            phoneNumber: that.data.allinfo.phone //需要拨打的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //同意退款
  confirm() {
    // wx.navigateTo({
    //   url: '/pages/mine/ordermain/confirm/confirm',
    // })
    let that = this
    let oid = that.data.allinfo.id
    console.log('同意退款订单id', oid)
    wx.showModal({
      title: '提示',
      content: '确认退款？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.agriknow.agree(oid).then(res => {
            console.log('同意退款', res)
            if (res.data.code == 0) {
              wx.showToast({
                title: '确认退款成功',
              })
              wx.redirectTo({
                url: '/pages/mine/training/Order/Order',
              })
            } else {
              wx.showToast({
                title: '失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }



})