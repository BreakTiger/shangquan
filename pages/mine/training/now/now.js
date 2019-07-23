var app = getApp()
// pages/register/forget/back.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hpUrl: app.globalData.hpUrl,
    phone: '',
    // 确认密码
    truePassword: '',
    userPassword: '',
    ajxpwd: false,
  },
  //输入密码
  userPasswordInput: function (e) {
    var that = this;

    this.setData({
      userPassword: e.detail.value
    })
    // console.log(e.detail.value.length)
    // console.log(e.detail.value);
    var value = e.detail.value
    var strkong = /^[0-9a-zA-Z]{0,25}$/g;
    if (strkong.test(value)) {
      that.setData({
        truePwd: true
      })
    } else {
      // console.log("cwoca")
      wx.showModal({
        title: '提示',
        content: '密码由0~25位由数字和26个英文字母混合而成',
        showCancel: false,
        success: function (res) {
          that.setData({
            truePwd: false
          })
        }

      })

    }

  },
  // ------------------------------
  // 确认密码
  truePasswordInput: function (e) {
    var that = this;
    this.setData({
      truePassword: e.detail.value
    })
    var userPassword = this.data.userPassword;
    var truePassword = this.data.truePassword;
    // console.log(userPassword)

    if (userPassword != '') {
      // truePassword.length == userPassword.length
      if (truePassword != '') {
        if (truePassword.length >= userPassword.length) {
          console.log(userPassword)
          console.log(truePassword)
          // conso
          if (userPassword == truePassword) {
            that.setData({
              ajxpwd: true
            })
          } else {
            that.setData({
              ajxpwd: false
            })
            wx.showToast({
              title: '确认密码不同',
              icon: 'success',
              duration: 1500
            })
          }
        }

      } else {
        wx.showToast({
          title: '请确认密码',
          icon: 'success',
          duration: 1500
        })
      }
    } else {
      wx.showToast({
        title: '请填写密码',
        icon: 'success',
        duration: 1500
      })
    }
    this.setData({
      truePassword: e.detail.value
    })
    // this.setData({
    //   password: e.detail.value
    // })
    // console.log(e.detail.value);
  },
  formSubmitback: function (e) {
    var phone = this.data.phone;
    var password = this.data.password
    var userPassword = this.data.userPassword;
    var truePassword = this.data.truePassword;
    var that = this;
    var lin = e.detail.value
    console.log('lin',lin)
    if (userPassword != '' && truePassword != '') {
      // console.log(this.data.ajxpwd)
      if (this.data.ajxpwd) {
        // console.log(phone)
        let uid = wx.getStorageSync('user').id
        app.agriknow.bindMobile(uid, truePassword).then(res => {
          console.log('修改密码', res)
        if(res.data.code == 200){
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/mine/training/account/account',
            })
          },1500)
        }else{
          wx.showToast({
            title: '修改失败',
          })
        }
        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '确认密码有误！',
          showCancel: false,
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请补充完整！',
        showCancel: false,
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phone = options.phone
    that.setData({
      phone: phone,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})