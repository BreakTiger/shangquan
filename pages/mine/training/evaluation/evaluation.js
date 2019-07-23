var app = getApp();
Page({


  data: {
    mycomment: [],
    count: '',
    avg: '',
    mall: [],
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
  },
  onLoad: function(options) {
    let that = this
    let sid = app.globalData.shop.id
    app.agriknow.myComment(sid, 1).then(res => {
      console.log('我的评论', res.data)
      that.setData({
        mycomment: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  onShow: function() {
    var that = this
    let sid = app.globalData.shop.id
    console.log('sid', sid)
    app.agriknow.getF(sid, 1).then(res => {
      console.log('积分', res)
      let avg = Math.ceil(res.data.data.avg)
      console.log('avg', avg)
      that.setData({
        count: res.data.data.count,
        avg: parseInt(avg),
        mall: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function(e) {
    var that = this
    let img = e.currentTarget.dataset.urls;
    console.log('图片数据', img)
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: img.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    // let item = this.data.teacherData;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let sid = app.globalData.shop.id
    app.agriknow.myComment(sid, pageN).then(res => {
      console.log('分页数据 pageN+', res)
      let result = res.data.data;
      if (result.length != 0) {
        pageN += 1;
        that.setData({
          pageN: pageN
        })
        setTimeout(function() {
          let item = that.data.mycomment.concat(result)
          that.setData({
            mycomment: item
          });
          console.log('pageN', pageN, '地区分页', item)
        }, 1000);
      } else {
        that.setData({
          pageTottomText: getApp().globalData.endText,
        });
      }
    }).catch(err => {
      console.log(err)
    })


  },
})