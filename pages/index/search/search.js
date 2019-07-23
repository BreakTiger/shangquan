const request = require('../../../class/api/_request.js')
import modals from '../../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../../qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});

Page({


  data: {
    keyword: '',
    list: [],
    idx: '',
    distance: [],
    lablelist: [],
    loglist: []
  },

  onLoad: function() {
    let that = this
    that.hotlable()
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


  // 热门搜索
  hotlable: function() {
    let that = this
    let area = app.globalData.area
    console.log(area)
    let province = area[0].province
    let city = area[0].city
    let district = area[0].district
    let areas = wx.getStorageSync('area')
    let data = {
      province: province,
      city: city,
      county: district,
      lat1: areas[0].lat,
      lng1: areas[0].lng
    }
    console.log(data)
    let url = app.globalData.api + 'mall/selecthotsousuo'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let result = res.data.data
        that.setData({
          lablelist: result
        })
      })
  },


  // 输入的关键字
  search_detail: function(e) {
    let that = this
    let val = e.detail.value
    // console.log(e.detail.value)
    that.setData({
      keyword: val
    })
  },


  // 搜索
  tosearch: function() {
    let that = this
    let key = that.data.keyword
    if (key == '') {
      modals.showToast('请输入搜索内容', 'none')
    } else {
      let areas = wx.getStorageSync('area')
      let area = app.globalData.area
      console.log(area)
      let province = area[0].province
      let city = area[0].city
      let district = area[0].district
      let data = {
        province: province,
        city: city,
        county: district,
        key: key,
        lat1: areas[0].lat,
        lng1: areas[0].lng
      }
      console.log(data)
      let url = app.globalData.api + 'mall/selectstore'
      modals.loading()
      request.sendRequest(url, 'get', data, {})
        .then(function(res) {
          modals.loaded()
          console.log('搜索',res)
          let result = res.data.data
          console.log(result)
          let code = res.data.code
          if (code == 0) {
            that.setData({
              list: result
            })

            
            // let aa = []
            // for (let i = 0; i < result.length; i++) {
            //   let lat = result[i].lon
            //   let lon = result[i].lat
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
            //         distance: aa
            //       })

            //     },
            //     fail: function(res) {
            //       console.log(res);
            //     },
            //     complete: function(res) {
            //       // console.log(res);
            //     }
            //   });

            //   that.sleep(400)

            // }



          }

          // 搜索历史
          let word = key
          console.log('ket:', key)
          let log = that.data.loglist
          if (log.includes(word)) {

          } else {
            log.push(word)
            wx.setStorageSync('loglist', log)
          }

          that.onShow()





        })
    }
  },


  // 进入店铺详情
  getin: function(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })
  },


  // 点击热门标签
  lotSelect: function(e) {
    let that = this
    let word = e.currentTarget.dataset.item.name
    console.log(word)
    let index = e.currentTarget.dataset.index;
    that.setData({
      keyword: word,
      idx: index
    })
    that.tosearch()
  },

  // 点击历史记录
  history: function(e) {
    let that = this
    let word = e.currentTarget.dataset.item
    console.log(word)
    that.setData({
      keyword: word
    })
    that.tosearch()
  },


  // 删除历史记录
  delTap: function() {
    let that = this;
    wx.removeStorage({
      key: 'loglist',
      success: function(res) {
        console.log(res)
        modals.showToast('删除成功', 'none')
        //刷新页面
        that.onShow()
      },
    })
  },


  onShow: function() {
    console.log("aaaaaaaaaaaa")
    let that = this
    let zi = wx.getStorageSync('loglist')
    console.log('bbbbbbb', zi)
    if (zi) {
      that.setData({
        loglist: zi
      })
    } else {
      that.setData({
        loglist: []
      })
    }
  }

})