// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {

//   },
//   getUserInfo: function(e) {
//     let detail = e.detail;
//     Tips.loading();
//     const rawUser = detail;
//     app.authApi.getCode()
//       .then(code => app.authApi.login(code))
//       .then(auth => app.authApi.saveAuthInfo(auth))
//       .then(() => app.authApi.decryptUserInfo(rawUser.encryptedData, rawUser.iv))
//       .then(user => app.authApi.saveUserInfo(user))
//       .then(() => {
//         Tips.loaded();
//         Tips.toast('授权成功', () => {
//           wx.reLaunch({
//             url: '/pages/index/index'
//           })
//         });
//       }).catch((err) => {
//         console.log(err)
//         Tips.loaded();
//         Tips.error('授权失败');
//       }).finally(() => {
//         Tips.loaded();
//       });
//   }
// })
const request = require('../../class/api/_request.js')
import modals from '../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../qqmap-wx-jssdk.js');
import Tips from '../../class/utils/Tips.js';

import getCity from '../../class/api/getCity.js';

var qqmapsdk = new QQMapWX({
  key: '2KDBZ-QW4WJ-BU4FA-KIJQR-IA4E5-KMFU5'
});


Page({


  data: {
    appstatus: '',
    province: '',
    city: '',
    district: '',
    navigations: '',
    top: [],
    swiperCurrent: 0,
    down: [],
    shoplist: [],
    distance: [],
    alert: 1,
    status: '',
    shop: [],
    if_: false
  },
  //确认授权
  getUserInfo: function(e) {
    let detail = e.detail;
    Tips.loading();
    const rawUser = detail;
    console.log('rawUser', rawUser)
    // let info = rawUser.rawData.toString()
    // console.log('deail', info)
    app.authApi.getCode()
      .then(code => app.authApi.login(code))
      .then(auth => app.authApi.saveAuthInfo(auth))
      .then(() => app.authApi.decryptUserInfo(rawUser.encryptedData, rawUser.iv))
      .then(user => app.authApi.saveUserInfo(user))
      .then(() => {
        Tips.loaded();
        Tips.toast('授权成功', () => {
          if (app.globalData.Scavenging) {
            let id = app.globalData.Scavenging
            wx.navigateTo({
              url: '/pages/mall/shopDetail/mall/mall?json=' + id,
            })
          } else {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        });
      }).catch((err) => {
        console.log(err)
        Tips.loaded();
        Tips.error('授权失败');
      }).finally(() => {
        Tips.loaded();
      });
  },

  onLoad: function(options) {
    let that = this
    let form_id = wx.getStorageSync('form_id')
    console.log('分享店铺二维码进来的参数', form_id)
    // app.authApi.check();

    that.loadNavigations();
    // that.appsession()
    that.toget()
  },


  toget: function() {
    let that = this
    wx.getLocation({

      success: function(res) {
        // 经纬度
        let lat = res.latitude
        let lon = res.longitude

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lon
          },
          success: function(res) {
            console.log(res)
            let province = res.result.address_component.province
            let city = res.result.address_component.city
            let district = res.result.address_component.district
            console.log(province, city, district)
            that.setData({
              province: province,
              city: city,
              district: district
            });

            let area = []

            area.push({
              "province": province,
              "district": district,
              "city": city
            })

            console.log(area)
            app.globalData.area = area //设置全局
            wx.setStorageSync('area', area) //设置缓存
          }
        })
      },
      fail: function(res) {
        console.log(res)
        console.log('定位失败', res)
        wx.showToast({
          title: '定位失败',
        })
      }
    })
    that.appsession()

  },


  // 状态
  appsession: function() {
    let that = this
    let data = {}
    let url = app.globalData.api + 'tcshop/store.appsession'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 200) {
          let appstatus = res.data.data.status
          console.log(appstatus)

          that.setData({
            appstatus: appstatus
          })
          wx.setStorageSync(appstatus, 'status')

          that.pointstatus()

        }
      })

  },


  // 导航
  loadNavigations: function() {
    let that = this
    app.mallApi.navigation().then(data => {
      that.setData({
        navigations: data
      })
    });

  },


  // logo导航跳转
  nav: function(e) {
    let that = this
    let path = e.currentTarget.dataset.item.path
    let index = e.currentTarget.dataset.index
    let tab = e.currentTarget.dataset.item.is_tabbar
    let id = e.currentTarget.dataset.item.id

    // 判断
    if (tab == 1) { //tab页面跳转
      app.router.switchTab(path)
    } else { //频道页面跳转
      if (index == 0) { //美食频道
        let path_ = path + '?id=' + id
        app.router.nav(path_)
      } else if (index == 1) {
        let path_ = path
        app.router.nav(path_)
      } else if (index == 2) { //生活服务
        let path_ = path + '?id=' + id
        app.router.nav(path_)
      } else {
        app.router.nav(path)
      }
    }
  },


  // 积分领取的状态
  pointstatus: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'tcshop/store.index_points_status'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let status = res.data.data
        console.log('状态', status)
        that.setData({
          status: status
        })
      })
    that.topadvertising()
  },


  // 第一个轮播图
  topadvertising: function() {
    let that = this
    let area = wx.getStorageSync('area')
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      position: 1
    }
    console.log('1:', data)
    let url = app.globalData.api + 'mall/selectplateslider'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log('第一个轮播图', res)
        let result = res.data.data
        console.log(result)
        that.setData({
          top: result
        })
      }).catch((err) => {
        console.log(err)
      })
    that.downadvertising()

  },


  // 轮播图下标
  changDot: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },


  // 第二个轮播图
  downadvertising: function() {
    let that = this
    let area = wx.getStorageSync('area')
    console.log(area)
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    console.log(provinces, citys, districts)
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      position: 2
    }
    console.log(data)
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('第二个轮播图', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          console.log(result)
          that.setData({
            down: result
          })
          that.store()
        }
      }).catch((err) => {
        console.log(err)
      })

  },


  // 推荐店铺
  store: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let area = wx.getStorageSync('area')
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      user_id: id
    }
    console.log(data)
    let url = app.globalData.api + 'mall/homepromotionstore'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        let code = res.data.code
        if (code == 0) {
          console.log('首页店铺', res)
          let result = res.data.data
          console.log(result)
          that.setData({
            shoplist: result
          })
          // 计算距离
          let aa = []
          for (let i = 0; i < result.length; i++) {
            // console.log(result[i])
            let lat = result[i].lat
            let lon = result[i].lon
            // console.log('lat:', lat, 'lon:', lon)
            qqmapsdk.calculateDistance({
              to: [{
                latitude: lon,
                longitude: lat
              }],
              success: function(res) {
                let dis = parseInt(res.result.elements[0].distance)
                let disance = dis / 1000
                aa.push(disance)
                console.log('aa', aa)
                that.setData({
                  distance: aa
                })
              },
              fail: function(res) {
                console.log(res);
              }
            });
          }
          that.allgoods()
        }

      })
  },

  // 百货
  allgoods: function() {
    let that = this
    let data = {}
    modals.loading()
    let url = app.globalData.api + 'mall/selectbaihuo'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log('百货', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data.category[0].product
          that.setData({
            shop: result
          })
        }
      })

  },


  // 关注店铺
  attentions: function(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    console.log(item)
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
        if (code == 200) {
          that.store()
        }

      })

  },


  // 取消关注店铺
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
        if (code == 200) {
          that.store()
        }
      })
  },



  // 进入店铺详情
  getin: function(e) {
    let that = this
    let data = e.currentTarget.dataset.item.user_id
    let id = e.currentTarget.dataset.item.id
    let sc_id = e.currentTarget.dataset.item.sc_id
    console.log(data)
    if (sc_id == 4) {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/fastConsult/shop/shop?data=' + data,
      })
    }
  },

  // 进入百货
  shopDetail: function(e) {
    let id = e.currentTarget.dataset.id
    console.log('商品id', id)
    wx.navigateTo({
      url: '/pages/mall/shopDetail/shopDetail?id=' + id,
    })
  },


  // 进入轮播图的详情
  swiperTap_(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mall/seeBanner/seeBanner?id=' + id,
    })
  },

  swiperTap(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mall/seeBanner/seeBanner?id=' + id,
    })
  },

  // 关闭按钮
  back: function() {
    var that = this
    that.setData({
      alert: 0
    })
  },

  // 领取积分
  getTap: function(e) {
    let that = this
    var formid = e.detail.formId
    let openid = wx.getStorageSync('user').weixin_openid
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    let url = app.globalData.api + 'tcshop/store.lingqujifen'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 200) {

          //formid 收集
          // app.agriknow.formId(formid, openid, id).then(res => {
          // console.log('fromid收集', res)
          // app.globalData.shop = res.data.data //店铺信息存入缓存
          // }).catch(err => {
          // console.log(err)
          // })

          modals.showToast('积分领取成功')
          that.setData({
            alert: 0
          })
        } else if (code == 701005) {
          modals.showToast('您已领取过积分', 'none')
          that.setData({
            alert: 0
          })
        }
      })
  },

  // 进入搜索页面
  search: function() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },


  // 进入页面定位
  location: function(e) {
    // wx.navigateTo({
    // url: '/pages/index/location/location',
    // })
  },

  onShow: function() {
    let that = this
    let area = wx.getStorageSync('area')
    console.log(area)
    // 判断
    if (area) {
      that.setData({
        province: area[0].province,
        city: area[0].city,
        district: area[0].district
      })
    } else {
      that.toget();
    }
  },

  onShareAppMessage: function(res) {
    let users = wx.getStorageSync('user');
    if (res.from === 'button') {}
    return {
      title: '商小盟',
      path: '/pages/index/index?from_uid=' + users.id,
      success: function(res) {}
    }
  }




})