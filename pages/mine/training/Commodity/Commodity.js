var app = getApp();
Page({

  data: {
    shop: [],
    window: [],
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
    mianfeichuchuang: '',
    sc_id: '',
    ActiVity: []
  },
  //商品详情修改
  go_goods(e) {
    let shop = e.currentTarget.dataset.shop
    let _str = JSON.stringify(shop)
    wx.redirectTo({
      url: '/pages/mine/training/Commodity/goods/goods?shop=' + _str,
    })
  },
  go_ActiVity(e) {
    let shop = e.currentTarget.dataset.shop
    let _str = JSON.stringify(shop)
    wx.redirectTo({
      url: '/pages/mine/training/Commodity/go_ActiVity/go_ActiVity?shop=' + _str,
    })
  },
  // 购买橱窗
  buyWindow() {
    wx.redirectTo({
      url: '/pages/mine/training/buyWindow/buyWindow',
    })
  },
  //添加商品
  addShop() {
    var that = this
    var theSum = parseInt(that.data.window.number) + parseInt(that.data.mianfeichuchuang) //商品橱窗总和
    let yishiyong = parseInt(that.data.window.yishiyong)
    console.log('商品橱窗总和', theSum, '已使用的橱窗', yishiyong)
    if (theSum == yishiyong) {
      wx.showModal({
        title: '提示',
        content: '剩余橱窗不足请在上方添加!',
        showCancel: false
      })
    } else {
      wx.redirectTo({
        url: '/pages/mine/training/addShop/addShop',
      })
      // wx.navigateTo({
      //   url: '/pages/mine/training/addShop/addShop',
      // })
    }
  },
  //添加活动
  addactivity() {
    wx.navigateTo({
      url: '/pages/mine/training/addactivity/addactivity',
    })
  },
  //活动下架
  ActiVity_del(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    this.status_(id, 0);
  },
  //活动上架
  ActiVity_add(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    that.status_(id, 1);
  },
  //上架
  add(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    //改变状态  0下架 1上架
    that.status(id, 1);
  },
  //下架
  del(e) {
    let id = e.currentTarget.dataset.id
    console.log('id', id)
    //改变状态  0下架 1上架
    this.status(id, 0);
  },
  onLoad: function(options) {
    // var that = this
    // let uid = wx.getStorageSync('user').id
    // app.agriknow.getActiVity('', 1, uid).then(res => {
    //   console.log('查询我的活动列表', res)
    //   that.setData({
    //     ActiVity:res.data.data
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
  },
  //修改上架 下架状态
  status(id, status) {
    let that = this
    app.agriknow.down(id, status).then(res => {
      console.log('上下状态', res)
      if (res.data.code == 200) {
        that.see();
      }
    }).catch(err => {
      console.log(err)
    })
  },
  status_(id, status) {
    let that = this
    app.agriknow.down_(id, status).then(res => {
      console.log('上下状态', res)
      if (res.data.code == 200) {
        that.seeActiVity();
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //查看活动列表
  seeActiVity() {
    var that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.getActiVity('', 1, uid).then(res => {
      console.log('查询我的活动列表', res)
      that.setData({
        ActiVity: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    that.setData({
      shop: [],
      ActiVity: []
    })
    let uid = wx.getStorageSync('user').id
    that.see();
  },
  see() {
    let that = this
    // 查询点店铺详情
    let uid = wx.getStorageSync('user').id
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      var sc_id = res.data.data.sc_id
      let sid = res.data.data.id
      if (sc_id == 2) {
        that.seeActiVity(); //查看活动列表
      } else {
        //点击店铺进入商品列表
        app.agriknow.goods(sid, 1).then(res => {
          console.log('点击店铺进入商品列表 ', res)
          let result = null
          if (res.data.data) {
            result = res.data.data
          } else {
            result = []
          }
          that.setData({
            shop: res.data.data
            // shop:result
          })
        }).catch(err => {
          console.log(err)
        })
      }
      that.setData({
        shop: res.data.data,
        sc_id: sc_id
      })
      app.agriknow.getWindow(sid).then(res => {
        console.log('查询我的橱窗', res)
        that.setData({
          window: res.data.data,
          mianfeichuchuang: res.data.data.mianfeichuchuang
        })
      }).catch(err => {
        console.log(err)
      })
      // //点击店铺进入商品列表
      // app.agriknow.goods(sid, 1).then(res => {
      //   console.log('点击店铺进入商品列表 ', res)
      //   let result = null
      //   if (res.data.data) {
      //     result = res.data.data
      //   } else {
      //     result = []
      //   }
      //   that.setData({
      //     shop: res.data.data
      //     // shop:result
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
      console.log('sc_id', res.data.data.sc_id)
    }).catch(err => {})
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
    this.onShow();
  },
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let sid = app.globalData.shop.id
    let sc_id = that.data.sc_id
    if (sc_id == 2) {
      let uid = wx.getStorageSync('user').id
      app.agriknow.getActiVity('', pageN, uid).then(res => {
        console.log('查询我的活动列表', res)
        console.log('分页数据 pageN+', res)
        let result = res.data.data;
        if (result.length != 0) {
          pageN += 1;
          that.setData({
            pageN: pageN
          })
          setTimeout(function() {
            let item = that.data.ActiVity.concat(result)
            that.setData({
              ActiVity: item
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
    } else {
      app.agriknow.goods(sid, pageN).then(res => {
        console.log('分页数据 pageN+', res)
        let result = res.data.data;
        if (result.length != 0) {
          pageN += 1;
          that.setData({
            pageN: pageN
          })
          setTimeout(function() {
            let item = that.data.shop.concat(result)
            that.setData({
              shop: item
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
    }
  },
})