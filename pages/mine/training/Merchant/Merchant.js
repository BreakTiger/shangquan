var app = getApp();
Page({


  data: {
    money:'',
    money_:''
  },
  money(){
    let money = this.data.money
    this.setData({ money_ : money})
  },
  submit(e) {
    let that = this
    let val = e.detail.value
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('val', val)
    let sid = app.globalData.shop.id
    let num = val.num
    if (val.num != '') {
      app.agriknow.exchangeadvcoin(sid, num).then(res => {
          console.log('兑换结果', res)
        if(res.data.code == 0){
          //formid 收集
          app.agriknow.formId(formid, openid, uid).then(res => {
            console.log('fromid收集', res)
          }).catch(err => {
            console.log(err)
          })
          wx.showToast({
            title: '兑换成功',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/mine/training/account/account',
            })
          },1500)
        }else{
          wx.showToast({
            title: '兑换失败',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '请填写完整',
      })
    }
  },
  onLoad: function(options) {
    let data = options.data
    this.setData({ money : parseInt(data)})
  }
})