const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    topoint:'',

    loglist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    let url = app.globalData.api + 'mall/MyUserpoints'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let result = res.data.data
        // let total = res.data.data.user.points
        // let logs = res.data.data.log
        that.setData({
          loglist: result.log,
          topoint: result.user.points
        })
      })

  },






})