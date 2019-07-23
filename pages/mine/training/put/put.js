var app = getApp();
Page({


  data: {
    myInfo: [],
    info: '',
    money: '',
    money_: '',
    alert: false,
    message:''
  },
  //忘记密码
  pwd() {
    wx.redirectTo({
      url: '/pages/mine/training/pwd/pwd',
    })
  },
  money() {
    let money = this.data.money
    this.setData({
      money_: money
    })
  },
  tosubmit(e) {
    let that = this
    let val = e.detail.value
    var formid = e.detail.formId
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('val', val)
    let uid = wx.getStorageSync('user').id
    if (val.money > 0) {
      if (val.money != '' && val.name != '' && val.username != '' && val.password != '') {
        let money = val.money
        let name = val.name
        let username = val.username
        let password = val.password
        app.agriknow.getmoney(uid, money, username, name, password).then(res => {
          console.log(' 提现 =>', res)
          //formid 收集
          app.agriknow.formId(formid, openid, uid).then(res => {
            console.log('fromid收集', res)
          }).catch(err => {
            console.log(err)
          })
          if (res.data.code == 0) {
            wx.showToast({
              title: '提现成功',
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/mine/training/account/account',
              })
            }, 1500)
          } else if (res.data.code == 1) {
            // wx.showModal({
            //   title: '提示',
            //   content: '可提现余额不足',
            //   showCancel: false
            // })
            that.setData({ message: res.data.message})
            that.setData({
              alert: true
            })
            setTimeout(function() {
              that.setData({
                alert: false
              })
            }, 1500)
          }

        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showToast({
          title: '请填充完整',
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '提现价格大于0',
        showCancel: false
      })
    }
  },
  onLoad: function(options) {
    let that = this
    console.log('options', options)
    let money = options.data
    let myInfo = wx.getStorageSync('myInfo')
    this.setData({
      myInfo: myInfo,
      money: parseInt(money)
    })
    //信息
    app.agriknow.info().then(res => {
      console.log('提现提示语', res)
      that.setData({
        info: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {

  }
})