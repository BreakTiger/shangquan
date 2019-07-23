var app = getApp()
// pages/register/forget/forget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hpUrl: app.globalData.hpUrl,
    zhengTrue: false,
    yanzheng: '',
    // huozheng: '',
    linPhone: '',
    linPassword: '',
    // 验证码
    yanzheng: '',
    ajxtrue: false,
    getText: '获取验证码',
    getChange: true,
    phone: ''
  },
  a() {
    wx.redirectTo({
      url: '/pages/mine/training/now/now',
    })
  },
  yanZhengInput: function(e) {
    var that = this;
    var yanzheng = e.detail.value;
    // var huozheng = this.data.huozheng
    console.log(e.detail.value)
    that.setData({
      yanzheng: yanzheng,
      zhengTrue: false,
    })
    if (yanzheng.length >= 4) {
      // if (yanzheng == huozheng) {
      that.setData({
        zhengTrue: true,
        // })
      })
    } else {
      // that.setData({
      // zhengTrue: false,
      // })
      wx.showModal({
        content: '输入验证码有误',
        showCancel: false,
        success: function(res) {}
      })
    }
  },
  yanzhengBtn: function() {
    // console.log(app.globalData.userId);
    var getChange = this.data.getChange
    var n = 59;
    var that = this;
    var phone = this.data.linPhone || that.data.phone
    var password = this.data.linPassword
    // console.log(phone)
    // console.log(password)
    var user = wx.getStorageSync('user');
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
    } else {
      if (getChange) {
        that.setData({
          getChange: false
        })
        var time = setInterval(function() {
          var str = '(' + n + ')' + '重新获取'
          that.setData({
            getText: str
          })
          if (n <= 0) {
            that.setData({
              getChange: true,
              getText: '重新获取'
            })
            clearInterval(time);
          }

          n--;
        }, 1000);
        let uid = wx.getStorageSync('user').id
        app.agriknow.phoneCode(phone, uid).then(res => {
          console.log('手机验证', res)
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              content: '非店铺绑定手机',
              showCancel: false
            })

          }
        }).catch(err => {
          console.log(err)
        })
      }
    }

  },
  // 表单判断
  blurPhoner: function(e) {
    var phone = e.detail.value;
    var that = this;
    this.setData({
      linPhone: phone
    })
    if (!(/^1[34578]\d{9}$/.test(phone))) {

      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }
  },
  phone_(phone) {
    var that = this;
    this.setData({
      linPhone: phone
    })
    if (!(/^1[34578]\d{9}$/.test(phone))) {

      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }
    console.log('ajax',that.data.ajxtrue)
  },
  // 登入表单提交
  formSubmitto: function(e) {
    console.log(e)
    var zhengTrue = this.data.zhengTrue;
    console.log('zhengTrue', this.data.zhengTrue)
    var that = this;
    var ajxtrue = this.data.ajxtrue;
    var phone = that.data.phone || e.detail.value.phone;
    console.log('phone', phone)
    var nchange = e.detail.value.nchange;
    console.log('phone', 'nchange', nchange)
    that.phone_(phone)
    console.log('ajxtrue', ajxtrue)
    if (ajxtrue == true) {
      let uid = wx.getStorageSync('user').id
      if (phone != '' && nchange != '') {
        if ((/^1[34578]\d{9}$/.test(phone))) {
          if (zhengTrue) {
            app.agriknow.Verification(uid, phone, nchange).then(res => {
              console.log('手机验证', res)
              if (res.data.code == 101004) {
                wx.showModal({
                  title: '提示',
                  content: '验证码错误',
                  showCancel: false
                })
              } else if (res.data.code == 200) {
                wx.showToast({
                  title: '验证成功',
                })
                setTimeout(function() {
                  wx.redirectTo({
                    url: '/pages/mine/training/now/now',
                  })
                }, 1500)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            wx.showModal({
              content: '输入验证码有误',
              showCancel: false,
              success: function(res) {}
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '手机号有误',
            showCancel: false,
            success: function(res) {}
          })
        }
      } else {
        wx.showToast({
          title: '请填充完整',
          icon: 'success',
          duration: 2000
        })
      }

    } else {
      if (phone == '') {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'success',
          duration: 2000
        })
      } else
      console.log('phone', phone)
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
    }


  },
  onLoad: function(options) {
    var that = this
    let myInfo = wx.getStorageSync('myInfo')
    let phone = myInfo[0].phone
    that.phone_(phone)
    // that.phone_();
    this.setData({
      phone:phone
    })
  }

})