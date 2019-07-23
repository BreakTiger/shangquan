var app = getApp();
Page({


  data: {
    date: '2018-09-08',
    turnover:'',
    order:[]
  },
  bindDateChange: function(e) {
    let that = this
    console.log('时间选择', e.detail.value)
    console.log(e)
    let date = e.detail.value
    this.setData({
      date: e.detail.value
    })
    console.log(date[0])
    var strs = new Array(); //定义一数组
    strs = date.split("-"); //字符分割
    console.log('strs', strs)
    let year = strs[0]
    let month = strs[1]
    let day = strs[2]
    console.log('年月日', year, month, day)
    that.money(year, month, day);
  },

  onLoad: function(options) {
    let that = this
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear(); //年
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    // console.log("当前时间：" + Y  + '-' + M + '-'  + D);
    let time = Y + '-' + M + '-' + D
    that.setData({
      date: time
    })
    that.money(Y, M, D);
  },
  //获取营业额
  money(year, month, day) {
    let that = this
    let store_id = app.globalData.shop.id
    app.agriknow.shop_money(store_id, year,month, day).then(res => {
      console.log('获取营业额', res)
      that.setData({
        turnover: res.data.data.turnover,
        order: res.data.data.order
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //跳转统计图
  full(){
    wx.navigateTo({
      url: '/pages/mine/training/turnover/full/full',
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }
})