const app = getApp();
import modals from '../../../../class/base/modal.js'
Page({
  data: {
    current: 'tab1',
    current_scroll: 'tab1',
    selected: 0,
    // 10 未支付   20  已支付  30 已发货   40 已完成  50 退款  60 退款成功
    list: ['全部', '待发货', '已发货', '已完成', '退款'],
    quanbu: [], //全部订单
    daifahuo: [],
    yiwancheng: [], //已完成
    tuikuan: [], //退款
  },
  //tab框
  selected: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    // console.log('tab框',index)
    that.setData({
      selected: index
    })
    if (index == 0) { //全部
      console.log('全部index == 0')
      // let quanbu = that.data.quanbu
      // that.setData({
      //   quanbu: quanbu
      // })
      that.allList();
    } else if (index == 1) { //已支付
      let daifahuo = that.data.daifahuo
      if (daifahuo == undefined || '') {
        daifahuo = ''
        that.setData({
          quanbu: daifahuo
        })
      } else {
        that.setData({
          quanbu: daifahuo
        })
      }

    } else if (index == 2) { //已发货
      let yifahuo = that.data.yifahuo
      if (yifahuo == undefined || '') {
        yifahuo = ''
        that.setData({
          quanbu: yifahuo
        })
      } else {
        that.setData({
          quanbu: yifahuo
        })
      }
      // that.allList();
    } else if (index == 3) { //已完成
      let yiwancheng = that.data.yiwancheng
      if (yiwancheng == undefined || '') {
        yiwancheng = ''
        that.setData({
          quanbu: yiwancheng
        })
      } else {
        that.setData({
          quanbu: yiwancheng
        })
      }
    } else if (index == 4) { //退款
      let tuikuan = that.data.tuikuan
      if (tuikuan == undefined || '') {
        tuikuan = ''
        that.setData({
          quanbu: tuikuan
        })
      } else {
        that.setData({
          quanbu: tuikuan
        })
      }
    }
  },
  //查看店铺所有订单
  allList() {
    let that = this
    let sid = app.globalData.shop.id
    console.log('app.globalData.shop', app.globalData.shop)
    app.agriknow.seeList(sid).then(res => {
      console.log('查询所有订单', res)
      let index = that.data.selected
      if (index == 0) {
        that.setData({
          quanbu: res.data.data.quanbu || [],
        })
      } else if (index == 1) {
        that.setData({
          quanbu: res.data.data.daifahuo || [],
        })
      } else if (index == 2) {
        that.setData({
          quanbu: res.data.data.yifahuo || [],
        })
      } else if (index == 3) {
        that.setData({
          quanbu: res.data.data.yiwancheng || []
        })
      }else if(index == 4){
        quanbu: res.data.data.tuikuan || []
      }
      that.setData({
        // quanbu: res.data.data.quanbu || [],
        daifahuo: res.data.data.daifahuo || [],
        yiwancheng: res.data.data.yiwancheng || [],
        yifahuo: res.data.data.yifahuo || [],
        tuikuan: res.data.data.tuikuan || []
      })
    }).catch(err => {
      console.log(err)
    })
  },
  //订单详情
  order(e) {
    let data = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/mine/training/Order/_Order/_Order?data=' + data,
    })
  },
  onLoad: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    // app.agriknow.shopDeatil(uid).then(res => {
    //   console.log('查询点店铺详情', res)
    //   that.setData({
    //     shop: res.data.data
    //   })
    //   app.globalData.shop = res.data.data
    // }).catch(err => {
    //   console.log(err)
    // })
    that.allList(); //查询所有订单

  },
  //发货
  deliver(e) {
    // console.log(e)
    let that = this
    let oid = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '/pages/mine/training/Order/deliver/deliver?oid=' + oid,
    })
    // wx.navigateTo({
    //   url: '/pages/mine/training/Order/deliver/deliver?oid=' + oid,
    // })
    //跳转页面
    // ordermain() {
    //   wx.navigateTo({
    //     url: '/pages/mine/ordermain/ordermain',
    //   })
    // },
  },
  //拒绝退款
  agree_(e) {
    let that = this
    let oid = e.currentTarget.dataset.id
    let text = '拒绝退款'
    console.log('订单id', oid)
    wx.showModal({
      title: '提示',
      content: '确认拒绝退款？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.agriknow.refuse(oid, text).then(res => {
            console.log('拒绝退款', res)
            if (res.data.code == 0) {
              wx.showToast({
                title: '拒绝退款成功',
              })
              that.allList();
            } else {
              wx.showToast({
                title: '失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //同意退款
  refuse_(e) {
    let that = this
    let oid = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认退款？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log('订单id', oid)
          app.agriknow.agree(oid).then(res => {
            console.log('同意退款', res)
            if (res.data.code == 0) {
              wx.showToast({
                title: '确认退款成功',
              })
              that.allList();
            } else {
              wx.showToast({
                title: '失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.onLoad();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }
});