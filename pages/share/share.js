const request = require('../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../class/base/modal.js'
const app = getApp();

Page({


  data: {
    activity_list: [],
    userid: '',
    swiperCurrent: 0,
    permissions: '',
    list: [],
    img: ''
  },

  previewImage: function(e) {
    var that = this
    let item = e.currentTarget.dataset.item
    wx.previewImage({
      current: "scene_img",
      urls: item.split(',')
    })
  },
  onLoad: function(options) {
    let that = this
    let id = wx.getStorageSync('user').id
    that.setData({
      userid: id
    })

    that.advertising()

  },
  store(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
      })
    } else {
      console.log('我是个人', id)
    }
  },
  // 同城互动
  advertising: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    // console.log('地区数据：', areas[0])
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 6,
      up: 1
    }
    // console.log(data)
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('同城互动', res)
        let result = res.data.data
        that.setData({
          activity_list: result
        })
      })
    // console.log(province, city, district)


    that.activitylist()
  },


  // 活动列表
  activitylist: function() {
    let that = this
    let id = that.data.userid
    let areas = wx.getStorageSync('area')
    let district = areas[0].district
    // console.log(district)
    let data = {
      user_id: id,
      city: district
    }
    let url = app.globalData.api + 'mall/activitylist'
    modals.loading();
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('活动列表',res)
        modals.loaded()
        let list = res.data.data
        // console.log('活动数据：', list)
        that.setData({
          list: list
        })
        that.power()
      })
  },


  // 发帖权限
  power: function() {
    let that = this
    // 获取用户ID
    let id = that.data.userid
    let data = {
      user_id: id
    }
    // console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/IfUserIsStore'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let status = res.data.data.status
        // console.log(status)
        that.setData({
          permissions: status
        })
      })
  },


  // 参加活动
  apply: function(e) {
    console.log('参加活动')
    let that = this
    let id = that.data.userid
    let aid = e.currentTarget.dataset.item.id
    let data = {
      user_id: id,
      activity_id: aid
    }
    // console.log('请求数据：', data)
    modals.loading()
    let url = app.globalData.api + 'mall/signupactivity'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '报名成功',
          })
          that.activitylist()
          // setTimeout(() => {

          // }, 100);
          modals.loaded()
        } else if (code == 1) {
          wx.showModal({
            title: '提示',
            content: '报名失败，请稍后刷新重试',
            showCancel: false
          })
          modals.loaded()
        }

      })
  },

  // 取消活动
  cancel: function(e) {
    let that = this
    let id = that.data.userid
    let aid = e.currentTarget.dataset.item.id
    let data = {
      user_id: id,
      activity_id: aid
    }
    // console.log('请求数据：', data)
    modals.loading()
    let url = app.globalData.api + 'mall/cancelactivity'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          wx.showToast({
            title: '取消成功',
          })
          that.activitylist()
          modals.loaded()
        } else {
          wx.showToast({
            title: '取消失败',
          })
          modals.loaded()
        }

      })
  },


  // 轮播图指示点
  changDot: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  // 进入发帖
  postmessage: function(e) {
    wx.navigateTo({
      url: '/pages/share/release/release'
    })
  },

  // 进入活动详情
  share: function(e) {
    let aid = e.currentTarget.dataset.item.id
    // console.log('活动ID', aid)
    let url = '/pages/share/shareDetail/shareDetail?aid='
    modals.navigate(url, aid)
  },

  swiper_detail: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    app.agriknow.slider(id).then(res => {
      console.log('轮播详情', res.data.data.product.length)
      let product = res.data.data.product
      if (product.length != 0) {
        wx.navigateTo({
          url: '/pages/mall/seeBanner/seeBanner?id=' + id,
        })
      } else {

      }
    }).catch(err => {
      console.log(err)
    })
  },

  //-----------  下拉刷新 -----------
  onPullDownRefresh: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
    this.onLoad();
  },




})