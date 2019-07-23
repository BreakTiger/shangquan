const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    arrIndex: 0,
  },
  // 快递选择
  bindPickerChange: function(e) {
    console.log('快递选择', e.detail.value)
    this.setData({
      arrIndex: e.detail.value
    })
  },
  // form表单提交
  teformSubmit(e) {
    let val = e.detail.value
    console.log('form', val)
    let uid = wx.getStorageSync('user').id
    let price = val.price
    let cid = val.courier_id
    console.log('price', price)
    if (val.courier_id != '' && val.price != '') {
      app.agriknow.conf_courier(uid, cid, price).then(res => {
        console.log('表单提交', res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '添加成功',
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/mine/training/training',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '添加失败',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //查询配送方式
    app.agriknow.seeCourier().then(res => {
      console.log('查询配送方式 res =>', res.data.data)
      let result = res.data.data
      that.setData({
        array: result
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})