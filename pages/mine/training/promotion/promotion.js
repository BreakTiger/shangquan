var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["请选择", "1小时", "2小时", "3小时", "4小时", "5小时", "10小时", "20小时", "30小时", "40小时", "50小时"],
    arrIndex: 0,
    money: 0,
    text:''
  },
  bindPickerChange: function(e) {
    let that = this
    console.log('推广时间', e.detail.value)
    let arrIndex = e.detail.value
    this.setData({
      arrIndex: arrIndex
    })
    that.price();
  },
  //计算价格
  price() {
    let month = this.data.arrIndex
    //价格 //1=轮播推广，2=产品推广，3=店铺推广 月数
    let that = this
    // 产品推广和店铺推广   position传个0
    if (month == 6){
      month = 10
    }else if(month == 7){
      month = 20
    } else if (month == 8){
      month = 30
    }else if(month == 9){
      month = 40
    }else if(month == 10){
      month = 50
    }
    app.agriknow.money(3, month, 0).then(res => {
      // console.log('计算价格', res)
      that.setData({
        money: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  teformSubmit(e) {
    console.log('e', e)
    let that = this
    let val = e.detail.value
    let formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('formid', formid, uid, openid)
    console.log('form', val, ' app.globalData.shop.id ', app.globalData.shop.id)
    let shop = app.globalData.shop
    var arrIndex = that.data.arrIndex
    let sc_id = shop.sc_id
      if (that.data.arrIndex != 0 && val.money != '') {
        let store_id = app.globalData.shop.id //店铺id 店铺信息存的全局
        let month = val.time //推广（）月
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
        console.log('month', month)
        let money = val.money
        console.log('money', money)
        app.agriknow.shop_Extension(store_id, month, money).then(res => {
          console.log('店铺推广，', res)
          if (res.data.code == 0) {
            wx.showToast({
              title: '购买成功',
            })
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/mine/training/training',
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '大喇叭不足',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        wx.showToast({
          title: '请填充完整',
          icon: 'success',
          duration: 1500
        })
      }

  },

  onLoad: function(options) {
    var that = this
    app.agriknow.getText(34).then(res => {
      console.log('说明', res)
      that.setData({ text: res.data.data.data })
    }).catch(err => {
      console.log(err)
    })
  },

  onShow: function() {

  }

})