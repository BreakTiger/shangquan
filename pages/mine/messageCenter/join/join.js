const request = require('../../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../../class/base/modal.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: '',
    uid: '',
    activity: '',
    apply: [],
    comment: [],
    values:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let aid = options.id
    console.log('活动ID:', aid)
    let uid = wx.getStorageSync('user').id
    console.log('用户ID：', uid)
    that.setData({
      aid: aid,
      uid: uid
    })
    that.activity_detail()
  },


  // 活动详情
  activity_detail: function() {
    let that = this
    let uid = that.data.uid
    let aid = that.data.aid
    let data = {
      user_id: uid,
      activity_id: aid
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'mall/findactivitydetail'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let activity = res.data.data.activity
        let apply = res.data.data.apply
        let comment = res.data.data.comment
        that.setData({
          activity: activity,
          apply: apply,
          comment: comment
        })
      })


  },





  //发起人
  peopleInfo() {
    // wx.navigateTo({
    //   url: '/pages/mine/messageCenter/peopleInfo/peopleInfo',
    // })
  },


  // 参与者
  participate(e) {
    let apply = this.data.apply
    let data = JSON.stringify(apply)
    wx.navigateTo({
      url: '/pages/mine/messageCenter/participate/participate?json=' + data,
    })
  },


  formSubmit(e) {
    let that = this
    let val = e.detail.value.name
    let aid = that.data.aid
    let uid = that.data.uid
    let data = {
      user_id: uid,
      activity_id: aid,
      content: val
    }
    console.log('请求数据', data)
    let url = app.globalData.api + 'mall/useractivitycomment'
    if (val == '') {
      modals.showToast('评论内容不能为空', 'none')
    } else {
      modals.loading()
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          modals.loaded()
          console.log(res)
          that.setData({
            values:''
          })
        })
      that.activity_detail()
    }
  },



})