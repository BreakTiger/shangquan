const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp()


Page({


  data: {
    id: '',
    selected: true,
    selected1: false,
    mine: [],
    join: []
  },



  onLoad: function(options) {
    let that = this
    let id = wx.getStorageSync('user').id
    // console.log(id)
    that.setData({
      id: id
    })
    that.campaign()
  },



  // 1.参加的活动
  selected: function(e) {
    let that = this
    that.setData({
      selected1: false,
      selected: true
    })
    that.campaign()
  },


  // 查询参加的活动的内容列表
  campaign: function() {
    let that = this
    let id = that.data.id
    let data = {
      user_id: id
    }
    console.log('请求数据：', id)
    let url = app.globalData.api + 'mall/selectuseractivityjoin'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let join = res.data.data
        if (join != '用户暂时没有参加活动') {
          that.setData({
            join: join
          })
        }

      })
  },


  // 发布的活动
  selected1: function(e) {
    let that = this
    that.setData({
      selected: false,
      selected1: true
    })
    that.release()
  },


  // 查询我发布的活动
  release: function() {
    let that = this
    let id = that.data.id
    let data = {
      user_id: id
    }
    console.log('请求数据：', id)
    let url = app.globalData.api + 'mall/selectuseractivityrelease'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let mine = res.data.data
        console.log('我发布的活动：', mine)
        that.setData({
          mine: mine
        })
      })

  },


  // 进入活动详情
  joinDetail: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    let id = e.currentTarget.dataset.item.id
    console.log('活动ID：', id)
    wx.navigateTo({
      url: '/pages/mine/messageCenter/join/join?id=' + id
    })
  },




})