const app = getApp();
import Tips from '../../../class/utils/Tips.js';
const WeValidator = require('../../../vendor/we-validator.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeout: false,
    seconds: 60,
    mobile: ''
  },
  validator: {},
  onReady: function() {
    this.validator = new WeValidator({
      rules: {
        mobile: {
          required: true,
          mobile: true
        }
      },
      messages: {
        mobile: {
          required: '手机号不能为空',
          mobile: '手机号格式错误'
        }
      }
    });
  },
  formSubmit(e) {
    let phone = e.detail.value.mobile;
    let verifycode = e.detail.value.verifycode;

    if (!this.validator.checkData({
        mobile: phone
      })) return;

    app.authApi.bindMobile(phone, verifycode).then(res => {
      if (res == true) {
        app.authApi.syncUserInfo();
        Tips.toast('绑定成功', function() {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        });
      } else {
        Tips.toast('绑定失败');
      }
    }).catch(function(error) {
      Tips.toast(error.message);
    });
  },

  checkMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  sendVerifyCode: function(e) {
    let that = this;

    let mobile = this.data.mobile

    if (!this.validator.checkData({
        mobile: mobile
      })) return;
    app.authApi.sendVerifyCode(mobile).then(res => {
      if (res == false) {
        Tips.toast('该手机已经被绑定', null, 'none');
      }
    });
    this.setData({
      timeout: true
    })
    let timerId = setInterval(function() {
      var seconds = that.data.seconds - 1;
      that.setData({
        seconds: seconds
      })
      if (seconds <= 0) {
        clearInterval(timerId)
        that.setData({
          timeout: false,
          seconds: 60
        })
      }
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.authApi.check();
  }
})