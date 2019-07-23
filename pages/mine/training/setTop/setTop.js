import usual from '../../../../class/base/usual.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearArr: ["请选择", "1小时", "2小时", "3小时", "4小时", "5小时", "10小时", "20小时", "30小时", "40小时", "50小时"],
    yearIndex: 0,
    money: 0,
    shopData: [],
    text: '',
    sc_id:''
  },
  year: function(e) {
    let that = this
    console.log('length', that.data.shopData.length)
    console.log('yearIndex => ', e.detail.value)
    let yearIndex = e.detail.value
    this.setData({
      yearIndex: yearIndex
    })
    if (yearIndex == 6) {
      yearIndex = 10
    } else if (yearIndex == 7) {
      yearIndex = 20
    } else if (yearIndex == 8) {
      yearIndex = 30
    } else if (yearIndex == 9) {
      yearIndex = 40
    } else if (yearIndex == 10) {
      yearIndex = 50
    }
    console.log('year', yearIndex)
    let num = yearIndex * that.data.shopData.length
    console.log('num', num)
    that.price(num);
  },
  //计算价格
  price(month) {
    //价格 //1=轮播推广，2=产品推广，3=店铺推广 月数
    let that = this
    //产品推广和店铺推广   position传个0
    let length = that.data.shopData.length
    app.agriknow.money(2, month, 0).then(res => {
      console.log('计算价格', res)
      that.setData({
        money: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(options) {
    let that = this
    // console.log('options', options.json)
    let product = JSON.parse(options.json)
    console.log('product', product)
    usual.sum(product)
    let jiesuan = wx.getStorageSync('jiesuan', jiesuan)
    that.setData({
      shopData: product
    })
    app.agriknow.getText(34).then(res => {
      console.log('说明', res)
      that.setData({
        text: res.data.data.data
      })
    }).catch(err => {
      console.log(err)
    })
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        sc_id: res.data.data.sc_id
      })
      app.globalData.shop = res.data.data //店铺信息存入全局
    }).catch(err => {
      console.log(err)
    })
  },
  //支付
  toSubmit(e) {
    let that = this
    let val = e.detail.value
    console.log('val', val)
    let goods = that.data.shopData
    console.log('goods', goods)
    let uid = wx.getStorageSync('user').id
    let money = val.money
    let month = val.month
    if (month == 6) {
      month = 10
    } else if (month == 7) {
      month = 20
    } else if (month == 8) {
      month = 30
    } else if (month == 9) {
      month = 40
    } else if (month == 10) {
      month = 50
    }
    var formid = e.detail.formId
    let openid = wx.getStorageSync('user').weixin_openid
    if (val.month != '' && val.money != '' && that.data.yearIndex != 0) {
      console.log('month', month, 'goods', goods, 'money', money, 'uid', uid)
      if (that.data.sc_id == 2) {
        console.log('that.data.sc_id == 2')
        app.agriknow.addSpread_(month, goods, money, uid, 1).then(res => {
          console.log('搜索产品', res)
          if (res.data.code == 0) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            wx.showToast({
              title: '推广成功',
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/mine/training/training',
              })
            }, 1500)
          } else if (res.data.message == '大喇叭不足'){
            wx.showModal({
              title: '提示',
              content: '大喇叭不足',
              showCancel:false
            })
          } else{
            wx.showToast({
              title: '推广失败',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log('that.data.sc_id != 2')
        app.agriknow.addSpread(month, goods, money, uid).then(res => {
          console.log('搜索产品', res)
          if (res.data.code == 0) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            wx.showToast({
              title: '推广成功',
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/mine/training/training',
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '推广失败',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    } else {
      wx.showToast({
        title: '请填充完整',
        icon: 'success',
        duration: 1500
      })
    }

  },
  onShow: function() {

  }
})