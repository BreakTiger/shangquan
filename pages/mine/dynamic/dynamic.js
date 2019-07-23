const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../../qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: '2KDBZ-QW4WJ-BU4FA-KIJQR-IA4E5-KMFU5'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    distance: []
  },


  onLoad: function(options) {
    let that = this
    that.carelist()

  },

  // 睡眠函数
  sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  },


  carelist: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let area = wx.getStorageSync('area')
    let data = {
      user_id: id,
      lat1: area[0].lat,
      lng1: area[0].lng
    }
    modals.loading()
    let url = app.globalData.api + 'tcshop/store.follow_list'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('生活服务',res)
        let result = res.data.data
        that.setData({
          list: result
        })
        modals.loaded()
        // let aa = []
        // for (let i = 0; i < result.length; i++) {
        //   // console.log(result[i])
        //   let lat = result[i].lat
        //   let lon = result[i].lon
        //   // console.log('lat:', lat, 'lon:', lon)
        //   qqmapsdk.calculateDistance({
        //     to: [{
        //       latitude: lon,
        //       longitude: lat
        //     }],
        //     success: function(res) {
        //       // console.log(res);
        //       let dis = res.result.elements[0].distance
        //       // console.log(dis)
        //       aa.push(dis)
        //       // console.log(aa)
        //       that.setData({
        //         distance: aa
        //       })

        //     },
        //     fail: function(res) {
        //       console.log(res);
        //     }
        //   });
        //   that.sleep(200)
        // }

      })
  },


  cancel: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let id = wx.getStorageSync('user').id
    let sid = item.id
    let data = {
      store_id: sid,
      user_id: id,
      status: 0
    }
    let url = app.globalData.api + 'tcshop/store.store_follow'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 200) {
          that.carelist()
        }
      })
  },


  getin: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    let data = JSON.stringify(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.item.id
    // wx.navigateTo({
    //   url: '/pages/index/fastConsult/shop/shop?data=' + data,
    // })
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })
  },

})