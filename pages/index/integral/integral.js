const request = require('../../../class/api/_request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loglist: [],
    topoint: 0,
    alert: false,
    user: '',
    image: [],
    zero: 0,
    code: '',
    users:[],
    store:[]
  },
  onLoad: function(options) {
    let that = this
    let id = wx.getStorageSync('user').id
    let user = wx.getStorageSync('user')
    console.log('user', user)
    let data = {
      user_id: id
    }
    let url = app.globalData.api + 'mall/MyUserpoints'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let result = res.data.data
        // let total = res.data.data.user.points
        // let logs = res.data.data.log
        that.setData({
          loglist: result.log,
          topoint: result.user.points,
          user: user
        })
      })
  },
  //领取积分
  Receive() {
    this.setData({
      alert: true
    })
  },
  //领取积分界面
  envelopes(e) {
    let index = e.currentTarget.dataset.index
    if (index == 0) { //用户

    } else { //商家活动

    }

    wx.navigateTo({
      url: '/pages/index/integral/envelopes/envelopes',
    })
  },
  onShow: function() {
    let that = this
    //活动入口图片
    let user = wx.getStorageSync('user')
    app.agriknow.HuoD().then(res => {
      console.log(' 活动入口图片 onload =>', res)
      let user = []
      let store = []
      let result = res.data.data
      for (let i in result) {
        if (result[i].comment == "用户邀请") {
          user.push(result[i].value)
        } else {
          if (result[i].comment == "商家邀请") {
            store.push(result[i].value)
          }
        }
        that.setData({
          image: res.data.data,
          users: user,
          store: store
          // mall: res.data.data.category,
          // shop: res.data.data.category[0].product
        })
      }
    }).catch(err => {
      console.log(err)
    })
    // 判断是不是商家
    app.agriknow.select(user.id).then(res => {
      console.log('判断是否商家', res)
      console.log('判断是不是商家 =>', res.data.data.status)
      let num = parseInt(res.data.data.status) //0 1
      that.setData({
        code: num
      })
    }).catch(err => {
      console.log(err)
    })






  }
})