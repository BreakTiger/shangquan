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
    now_city: '',
    lables: [],
    city: []
  },


  onLoad: function(options) {
    let that = this
    let area = wx.getStorageSync('area')
    let add = area[0].city
    let  index = add.indexOf('市')
    let now = add.substring(0,index)
    that.setData({
      now_city: now
    })
    
    that.choose()
  },

  // 选择城市
  choose: function() {
    let that = this
    let data = {}
    let url = app.globalData.api + 'mall/opencity.list'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let result = res.data.data
        that.setData({
          lables: result
        })
        let aa = []
        for (var i = 0; i < result.length; i++) {
          console.log(result[i])
          let add = result[i].city
          let index = add.indexOf('市')
          let city = add.substring(0, index)
          aa.push(city)
          console.log(aa)
          that.setData({
            city: aa
          })
        }
      })
  },


  // 重新选择城市，并定位

  resetcity: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let citylist = that.data.lables
    // console.log(citylist)
    let item = citylist[index]
    console.log(item)
    let province = item.province
    let city = item.city
    let county = item.county
    that.setData({
      now_city: city
    })
    let area = []
    area.push({
      "province": province,
      "district": county,
      "city": city
    });
    app.globalData.area = area
    wx.setStorageSync('area', area)

    wx.switchTab({
      url: '/pages/index/index'
    })

  }
})