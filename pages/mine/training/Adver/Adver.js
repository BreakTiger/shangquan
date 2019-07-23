const app = getApp();
Page({


  data: {
    cueernt: [], //查询广告币充值套餐
    idx: 0,
    money: '',
    adv:'',
    num:''
  },
  num(e){
    console.log(e)
    let money = e.detail.value
    this.setData({
      money:money,
      adv:money,
      idx:'-1'
    })
  },
  curr(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let adv = e.currentTarget.dataset.adv
    let money = e.currentTarget.dataset.money
    // console.log( 'index' ,index)
    this.setData({
      idx: index,
      money: money,
      adv:adv,
      num:''
    })
  },
  // 充值支付
  pay(e) {
    let that = this
    let uid = wx.getStorageSync('user').id
    let money = that.data.money
    var formid = e.detail.formId
    console.log('formid' , formid)
    let sid = that.data.sid //店铺ID,充值广告币的话需要填， 如果充值余额的话就填0
    let num = that.data.adv //充值数量， 如果比例是1：1 就和money填成一致的，如果1：10就在money基础上*10
    console.log('money', money, 'num', num, 'sid', sid)
   // 2 充值类型,1充值余额,2充值广告币
    app.agriknow.payList(uid, money, 2, sid, num).then(res => { //生成充值订单
      console.log('充值结果', res)
      let openid = wx.getStorageSync('user').weixin_openid
      let text = '商小盟'
      let order_id = res.data.data.order_id
      money = res.data.data.money
      console.log('money', money, 'order_id', order_id)
      app.agriknow.pay(money, openid, order_id).then(res => { //支付
        console.log('充值结果', res)
        let json = res.data.data
        //微信支付
        wx.requestPayment({
          'appId': json.appId,
          'timeStamp': json.timeStamp,
          'nonceStr': json.nonceStr,
          'package': json.package,
          'signType': 'MD5',
          'paySign': json.paySign,
          'success': function(res) {
            console.log('支付成功', res)
            wx.showToast({
              title: '支付成功',
            })
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/mine/training/account/account',
              })
            }, 1500)
          },
          fail(res) {
            console.log('支付失败', res)
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })




  },
  onLoad: function(options) {
    // console.log('options', options.data)
    let shop = JSON.parse(options.data)
    // console.log('options', shop, 'shop.id', shop.id)
    var that = this
    app.agriknow.adverCueernt().then(res => {
      console.log('查询广告币充值套餐', res)
      that.setData({
        cueernt: res.data.data,
        money: res.data.data[0].money,
        sid: shop.id,
        adv: res.data.data[0].adv_coin
      })
    }).catch(err => {
      console.log(err)
    })
    console.log('getStorageSync,', wx.getStorageSync('user'))
  },

  onShow: function() {}
})