const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../../qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});

Page({

  data: {
    types: '',
    city: '',
    shoplist: [],
    sex: 0,
    distance: [],
    top: [],
    down1: [],
    down2: []

  },

  onLoad: function(options) {
    let that = this
    let id = options.id
    let area = wx.getStorageSync('area')
    let city = area[0].city
    that.setData({
      types: id,
      city: city
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

  // 美食（上）
  topadvertising: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    // console.log(areas)
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 3,
      up: 1
    }
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('美食上', res)
        that.setData({
          top: res.data.data
        })
      })

    that.downadvertising1()
  },

  //美食（下1）
  downadvertising1: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    // console.log(areas)
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 4,
      up: 2
    }
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('美食下1', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          // console.log(result)
          that.setData({
            down1: result
          })
          that.downadvertising2()
        }

      })
  },


  //美食（下2）
  downadvertising2: function() {
    let that = this
    let areas = wx.getStorageSync('area')
    // console.log(areas)
    let province = areas[0].province
    let city = areas[0].city
    let district = areas[0].district
    let data = {
      province: province,
      city: city,
      county: district,
      position: 9,
      up: 3
    }
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('美食下2', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          that.setData({
            down2: result
          })
          that.shopList()
        }
      })
  },

  // 店铺列表
  shopList: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    let id = parseInt(that.data.types)
    let area = wx.getStorageSync('area')
    // console.log('area', area)
    let data = {
      user_id: uid,
      type: id,
      page: 1,
      city: area[0].district,
      lat1: area[0].lat,
      lng1: area[0].lng
    }
    // console.log('请求数据', data)
    modals.loading();
    let url = app.globalData.api + 'tcshop/store.store_list'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        let list = res.data.data
        console.log('店铺数据', list)
        that.setData({
          shoplist: list
        })


        // let aa = []
        // for (let i = 0; i < list.length; i++) {

        //   // console.log()
        //   let lat = list[i].lon
        //   let lon = list[i].lat
        //   console.log('lat:', lat, 'lon:', lon)
        //   qqmapsdk.calculateDistance({
        //     to: [{
        //       latitude: lat,
        //       longitude: lon
        //     }],
        //     success: function(res) {
        //       console.log('成功：', res);
        //       let dis = (res.result.elements[0].distance) / 1000
        //       // console.log(dis)
        //       aa.push(dis)
        //       console.log(aa)
        //       that.setData({
        //         distance: aa
        //       })
        //     },
        //     fail: function(res) {
        //       console.log('失败：', res);
        //     },
        //     complete: function(res) {
        //       // console.log(res);
        //     }
        //   });
        //   that.sleep(500)

        // }

      })

  },

  // 关注
  attentions: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let sid = item.id
    let id = wx.getStorageSync('user').id
    let data = {
      store_id: sid,
      user_id: id,
      status: 1
    }
    console.log(data)
    let url = app.globalData.api + 'tcshop/store.store_follow'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('关注：', res.data)
        let code = res.data.code
        //刷新，重新调用店铺列表的方法
        if (code == 200) {
          that.shopList()
        }
      })

  },

  // 取消关注
  cancelattentions: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
    let sid = item.id
    let id = wx.getStorageSync('user').id
    let data = {
      store_id: sid,
      user_id: id,
      status: 0
    }
    console.log(data)
    let url = app.globalData.api + 'tcshop/store.store_follow'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('取消关注', res.data)
        let code = res.data.code
        //刷新，重新调用店铺列表的方法
        if (code == 200) {
          that.shopList()
        }

      })
  },


  // 进入店铺详情
  shop: function(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })
  },

  shop1: function(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/mall/shopDetail/shopDetail?id=' + id,
    })
  },


  bigimg: function(e) {
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

  bigimgs: function(e) {
    let that = this
    let id = e.currentTarget.dataset.img.id
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



  //----------- 下拉刷新 -----------
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