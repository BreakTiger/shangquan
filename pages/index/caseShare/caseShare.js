const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../../qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    district: '',
    outlist: [],
    top: [],
    down1: [],
    down2: [],
    status: '',
    disance: []
  },


  onLoad: function(options) {
    let that = this
    let area = wx.getStorageSync('area')
    console.log(area)
    let city = area[0].city
    let district = area[0].district
    that.setData({
      city: city,
      district: district
    })
    that.topadvertising()
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

  // 景点上
  topadvertising: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 5,
      up: 1
    }
    // console.log(data)
    modals.loading()
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        let result = res.data.data
        console.log('景点上：', result)
        that.setData({
          top: result
        })
        that.downadvertising1()
      })
  },

  // 景点下1
  downadvertising1: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 13,
      up: 2
    }
    // console.log(data)
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('景点下1', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          that.setData({
            down1: result
          })
          that.downadvertising2()
        }
      })
  },

  // 景点2
  downadvertising2: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 14,
      up: 3
    }
    // console.log(data)
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('景点下2', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          that.setData({
            down2: result
          })
          modals.loaded()
          that.outside()
        }
      })
  },


  // 进入轮播图详情
  getActivity(e) {
    let that = this
    let id = e.currentTarget.dataset.item.id
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


  getenter: function(e) {
    let that = this
    let id = e.currentTarget.dataset.item.id
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



  // 户外活动列表
  outside: function() {
    let that = this
    let district = that.data.district
    let area = wx.getStorageSync('area')
    // console.log(district)
    let data = {
      page: 1,
      city: district,
      lat1: area[0].lat,
      lng1: area[0].lng
    }
    // console.log('请求数据：', data)
    modals.loading()
    let url = app.globalData.api + 'tcshop/store.activity_list'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let result = res.data.data
        console.log('景点列表', result)
        that.setData({
          outlist: result
        })
        modals.loaded()

        // let aa = []
        // for (let i = 0; i < result.length; i++) {
        //   let lat = result[i].lat
        //   let lon = result[i].lon
        //   console.log('lat:', lat, 'lon:', lon)
        //   qqmapsdk.calculateDistance({
        //     to: [{
        //       latitude: lat,
        //       longitude: lon
        //     }],
        //     success: function(res) {
        //       console.log(res);
        //       let dis = (res.result.elements[0].distance) / 1000
        //       aa.push(dis)
        //       console.log(aa)
        //       that.setData({
        //         disance: aa
        //       })
        //     },
        //     fail: function(res) {
        //       console.log(res);
        //     },
        //     complete: function(res) {
        //       // console.log(res);
        //     }
        //   });
        //   that.sleep(200)

        // }


      })
  },


  // 进入活动详情
  activity: function(e) {
    let item = e.currentTarget.dataset.item
    console.log('活动详情', item)
    let id = item.id
    let is_invoice = item.is_invoice
    // console.log(id)
    wx.navigateTo({
      url: '/pages/index/caseShare/activity/activity?id=' + id + "&is_invoice=" + is_invoice
    })
  },


  postmessage: function() {
    wx.navigateTo({
      url: '/pages/index/caseShare/publish/publish'
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
    this.topadvertising();
  },











  
})