var app = getApp();
Page({


  data: {
    //tab框
    selected: 0,
    list: ['余额', '商基金', '大喇叭'],
    money: [], //查询我的余额明细
    sid: '',
    adver: [],
    arr: [],
    seller_coin: '', //商户币
    adv_coin: '', //广告币
    moneyList: [],
    alert: false, //弹框样式
    loginPhone: '',
    balance: 0,
    phone: ''
  },
  cancel() {
    this.setData({
      alert: false
    })
  },
  // 提现
  put(e) {
    let that = this
    let myInfo = wx.getStorageSync('myInfo')
    console.log('myInfo', myInfo)
    if (myInfo) {
      let balance = e.currentTarget.dataset.balance
      wx.redirectTo({
        url: '/pages/mine/training/put/put?data=' + balance,
      })
    } else {
      that.setData({
        alert: true
      })
    }
  },
  // 登录手机验证
  loginPhone(e) {
    let phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        loginPhone: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 1000
        })
      }
    } else {
      this.setData({
        loginPhone: true
      })
    }
  },
  //添加微信号 手机号
  addUser(e) {
    let that = this
    let val = e.detail.value
    console.log('val', val)
    let phone = val.phone
      if (val.wechat != '' && val.phone != '') {
        let myInfo = []
        let wechat = val.wechat
        let phone = val.phone
        myInfo.push({
          "wechat": wechat,
          "phone": phone
        })
        console.log('myInfo', myInfo)
        wx.removeStorageSync('myInfo')
        // app.globalData.myInfo = area //设置全局
        wx.setStorageSync('myInfo', myInfo);
        wx.showToast({
          title: '保存成功',
        })
        // that.put();
        that.setData({
          alert: false
        })
      } else {
        wx.showToast({
          title: '请填充完整',
        })
      }
  },
  //tab框
  selected(e) {
    let that = this
    let uid = wx.getStorageSync('user').id
    let sid = that.data.sid
    let index = e.currentTarget.dataset.index
    console.log('index', index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else if (index == 1) { //商户币
      that.setData({
        selected: 1
      })
      // 查询商户币明细
      app.agriknow.seeMerchant(uid, sid).then(res => {
        console.log('查询商户币明细', res)
        that.setData({
          adver: res.data.data.log
        })
      }).catch(err => {
        console.log(err)
      })
    } else { //广告币
      that.setData({
        selected: 2
      })
      //查询广告币明细
      app.agriknow.seeAdver(uid, sid).then(res => {
        console.log('查询广告币明细', res)
        that.setData({
          arr: res.data.data.log
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  // 商户
  Merchant(e) {
    let seller_coin = e.currentTarget.dataset.seller_coin
    wx.navigateTo({
      url: '/pages/mine/training/Merchant/Merchant?data=' + seller_coin,
    })
  },
  // 广告
  Advertisement(e) {
    // console.log(e)
    let shop = JSON.stringify(e.currentTarget.dataset.shop)
    // console.log('shop',shop)
    wx.navigateTo({
      url: '/pages/mine/training/Adver/Adver?data=' + shop
    })
  },
  onLoad: function(options) {
    let that = this
    let uid = wx.getStorageSync('user').id
    //查询我的余额明细
    app.agriknow.seeMoney(uid).then(res => {
      console.log('查询我的余额明细', res)
      that.setData({
        money: res.data.data.user,
        balance: res.data.data.user.balance,
        moneyList: res.data.data.log
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data,
        sid: res.data.data.id,
        seller_coin: res.data.data.seller_coin,
        adv_coin: res.data.data.adv_coin,
        phone: wx.getStorageSync('user').mobile
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //-----------  下拉刷新 -----------
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.onLoad();
    this.onShow();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }
})