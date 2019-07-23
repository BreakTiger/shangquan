const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    activity: '',
    apply: [],
    comment: [],
    discuss: 0,
    joined: 0,
    values: ''
  },
  quxiao(e) {
    let that = this
    if (!e.detail.value) {
      that.setData({
        discuss: 0
      })
    }
  },
  act(e) {
    let id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
      })
    } else {
      console.log('我是个人', id)
    }
  },
  onLoad: function(options) {
    let that = this
    let id = options.aid
    that.setData({
      id: id
    })
    that.activity_detail()
  },

  // 活动详情
  activity_detail: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    // 活动ID
    let aid = that.data.id
    let data = {
      user_id: id,
      activity_id: aid
    }
    // console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/findactivitydetail'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('活动详情', res)
        let activity = res.data.data.activity
        let apply = res.data.data.apply
        let comment = res.data.data.comment
        console.log('活动详情：', activity)
        console.log('参与人：', apply)
        console.log('评论：', comment)
        that.setData({
          activity: activity,
          apply: apply,
          comment: comment
        })

      })
  },


  // 显示弹框
  textinput: function() {
    let that = this
    that.setData({
      discuss: 1
    })
  },

  // 收起弹框
  pack: function() {
    let that = this
    that.setData({
      discuss: 0
    })
  },


  // 立即参加
  join: function() {
    let that = this
    let aid = that.data.activity.id
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id,
      activity_id: aid
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/signupactivity'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          that.activity_detail()
        } else if (code == 1) {
          wx.showModal({
            title: '提示',
            content: '该活动已截至报名',
            showCancel: false
          })
        } else {
          wx.showToast({
            title: '失败',
          })
        }
      })

  },
  join_people(e) {
    // console.log('apply', this.data.apply)
    // let item = e.currentTarget.dataset.item
    let arr = JSON.stringify(this.data.apply)
    // console.log('item', item)
    wx.navigateTo({
      url: '/pages/share/shareDetail/join_people?json=' + arr,
    })
  },

  // 取消报名
  cancel: function() {
    let that = this
    let aid = that.data.activity.id
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id,
      activity_id: aid
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/cancelactivity'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          that.activity_detail()
        }
      })
  },


  // 发布说说
  formSubmit: function(e) {
    let that = this
    let aid = that.data.activity.id
    let id = wx.getStorageSync('user').id
    let val = e.detail.value.text
    let data = {
      user_id: id,
      activity_id: aid,
      content: val
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/useractivitycomment'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          that.activity_detail()
          that.setData({
            values: ''
          })
        } else {
          modals.showToast('您已评价过该活动,不可重复评价', 'none')
          that.setData({
            values: ''
          })
        }
      })
  },



  previewImage: function(e) {
    var that = this
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      current: "scene_img",
      urls: img.split(',')
      // urls必须是数组 不然会报错  
    })

  },




})