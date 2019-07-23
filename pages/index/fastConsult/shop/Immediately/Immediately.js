const request = require('../../../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../../../class/base/modal.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allgoods: [],
    name: '',
    phone: '',
    address: '',
    jifen: 0,
    sum: '',
    carinfo: [],
    free: '',
    coust:''
  },


  onLoad: function(options) {
    let that = this
    
    let allgoods = JSON.parse(options.data)
    console.log(allgoods)
    
    let sum = parseInt(options.sum)
    console.log('订单总价格：',sum)
    
    let free = parseInt(allgoods[0].distribution_fee) 
    console.log('个人邮费',free)

    let price = sum + free //邮费+订单总价 
    console.log('加上邮费后：', price)

    that.setData({
      allgoods: allgoods,
      sum: price,
      free: free
    })

    that.changeadds()
    that.car_detail()

  },

  // 选择地址
  address: function() {
    let that = this
    that.changeadds()
  },

  // 收货地址
  changeadds: function() {
    let that = this
    wx.chooseAddress({
      success: function(res) {
        // console.log(res)
        let name = res.userName
        let phone = res.telNumber
        let aa = []
        aa.push(res.provinceName)
        aa.push(res.cityName)
        aa.push(res.countyName)
        aa.push(res.detailInfo)
        let add = aa.join(',')
        // console.log(add)
        that.setData({
          name: name,
          phone: phone,
          address: add
        })
      }
    });
  },

  // 购物车详情
  car_detail: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let sid = that.data.allgoods[0].store_id
    console.log(sid)
    let data = {
      store_id: sid,
      user_id: id
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'tcshop/store.cart_detail'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        // console.log(res)
        let result = res.data.data
        console.log(result)
        let a = result.detail
        that.setData({
          carinfo: result
        })
        that.point()
      })
  },

  // 积分
  point: function() {
    let that = this
    let list = that.data.allgoods
    console.log(list)
    let sums = 0
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      console.log(item)
      let pid = item.product_sn
      let num = item.num
      let price = item.yuanjia
      let id = wx.getStorageSync('user').id
      let data = {
        user_id: id,
        activity_id: pid,
        price: price,
        num: num,
        type: 2
      }
      console.log(data)
      let url = app.globalData.api + 'tcshop/store.points_pay'
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          let result = res.data.data
          console.log('结果：', result)

          // 会员折扣
          let coust = result.member_zhekou
          console.log('会员折扣:', coust)
          that.setData({
            coust: coust
          })

          //用户个人积分
          let person = result.user_score
          console.log('可抵扣的现金', person)

          // 购买商品所有的积分
          let ps = result.product_score  //单个商品所需要的积分
          sums += ps //所有商品需要的总积分
          sum = sums  //所有商品所能可口的积分抵扣金额

          console.log('商品需要的总积分', sums)

          if (person >= sums) {
            that.setData({
              jifen: sum
            })
          }

        })
    }
  },

  //删除购物车数据
  create: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let item = that.data.allgoods
    let sid = item[0].store_id
    let data = {
      user_id: id,
      store_id: sid
    }
    console.log(data)
    let url = app.globalData.api + 'tcshop/store.cart_del'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 200) {
          that.created()
        }
      })
  },


  // 创建订单
  created: function() {
    let that = this
    
    let id = wx.getStorageSync('user').id
    
    let sum = that.data.sum 
    console.log('总价格：', sum)

    let jifen = that.data.jifen

    // let pay = sum - jifen
    
    let address = that.data.address
    
    let name = that.data.name
    
    let phone = that.data.phone
    
    let car = JSON.stringify(that.data.carinfo)
    
    console.log('购物车信息：', car)
    
    let data = {
      user_id: id,
      allprice: sum,
      address: address,
      carts: car,
      phone: phone,
      name: name,
      points: jifen,
      seller_coin: 0,
      types: 2
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/buyshopcart'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let result = res.data.data
        let money = result.money
        let number = result.order_number
        console.log(money, number)
        that.pay(money, number)
      })

  },

  // 支付
  pay: function(money, number) {
    let that = this
    let open = wx.getStorageSync('auth').openid
    
    let zmoney = parseInt(money)
    console.log('总价：', zmoney)
    
    let coust = that.data.coust
    console.log('会员折扣：', coust)

    let jifen = that.data.jifen
    console.log('积分：', jifen)

    let moneys = zmoney - jifen - coust
    console.log('计算后', moneys)
    if (moneys<0){
      let moneys = 0
      console.log('计算后', moneys)
    }

    let data = {
      total_fee: moneys,
      openid: open,
      out_trade_no: number
    }

    console.log('请求数据：', data)
    let url = app.globalData.api + 'pay/pay'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let josn = res.data.data
        that.wxpay(josn)
      })
  },

  // 微信支付
  wxpay: function(josn) {
    wx.requestPayment({
      'appId': josn.appId,
      'nonceStr': josn.nonceStr,
      'package': josn.package,
      'paySign': josn.paySign,
      'signType': josn.signType,
      'timeStamp': josn.timeStamp,
      success: function(res) {
       
        //成功后,跳转至商品详情
        setTimeout(function() {
          wx.showToast({
            title: '支付成功',
          })
        }, 1500)
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
      'fail': function(res) {
        console.log(res)
        //失败
        setTimeout(function() {
          modals.showToast('支付失败', 'loading')
        }, 1500)
        wx.switchTab({
          url: '/pages/index/index',
        })
      }

    })
  },

})