const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../../qqmap-wx-jssdk.js');

var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});


Page({

  data: {
    list: [],
    lat: '',
    lon: '',
    distance: [],
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
  },

  listdetail(e) {
    let that = this
    // sc_id 1美食 3 生活服务  4百货
    let sc_id = e.currentTarget.dataset.id
    let id = e.currentTarget.dataset.itemid
    let user_id = e.currentTarget.dataset.user_id

    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })

    // if (sc_id == 1) {
    //   wx.navigateTo({
    //     url: '/pages/index/fastConsult/shop/shop?data=' + user_id,
    //   })
    // } else if (sc_id == 3) {
    //   wx.navigateTo({
    //     url: '/pages/index/fastConsult/shop/shop?data=' + user_id,
    //   })
    // } else if (sc_id == 4) {
    //   wx.navigateTo({
    //     url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    //   })
    // }

    
  },
  //关注 0取消 1关注
  follow(e) {
    let that = this
    let sid = e.currentTarget.dataset.sid
    console.log(e)
    that.follow_status(sid, 1);
  },
  //未关注
  _follow(e) {
    let that = this
    let sid = e.currentTarget.dataset.sid
    that.follow_status(sid, 0);
  },
  follow_status(sid, status) {
    let that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.seePeople(sid, uid, status).then(res => {
      console.log('关注', res)
      if (res.data.code == 200) {
        that.vipzone();
      }
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(options) {
    this.vipzone();
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


  // 会员专区数据
  vipzone: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    let area = wx.getStorageSync('area')
    let data = {
      page: 1,
      user_id: uid,
      lat1: area[0].lat,
      lng1: area[0].lng
    }
    let url = app.globalData.api + 'tcshop/store.member_area'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        let result = res.data.data
        console.log(result)
        that.setData({
          list: result
        })
      })

  },
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let uid = wx.getStorageSync('user').id
    let area = app.globalData.area
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    let data = {
      page: pageN,
      user_id: uid,
      lat1: area[0].lat,
      lng1: area[0].lng
    }
    let url = app.globalData.api + 'tcshop/store.member_area'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log('积分', res)
        let result = res.data.data
        if (result.length > 0) {
          pageN += 1;
          that.setData({
            pageN: pageN
          })
          setTimeout(function() {
            let item = that.data.list.concat(result)
            that.setData({
              list: item
            });
            console.log('pageN', pageN, '地区分页', item)
          }, 1000);
        } else {
          that.setData({
            pageTottomText: getApp().globalData.endText,
          });
        }


      })
  },

})