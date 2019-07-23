const request = require('../../class/api/_request.js')
import modals from '../../class/base/modal.js'
const app = getApp();

var QQMapWX = require('../../qqmap-wx-jssdk.js');
import Tips from '../../class/utils/Tips.js';

import getCity from '../../class/api/getCity.js';

var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
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
    alert: 0,
    status: '',
    shop: [],
    IMG: '',
    i: 0,
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    score: [],
    lat: '',
    lng: '',
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
  },


  onLoad: function(options) {
    let that = this
    console.log('options', options)
    app.globalData.Scavenging = options.scene
    if (options.form_uid) {
      console.log('用户转发')
      let form_uid = options.form_uid //分享传入的id
      wx.setStorageSync('form_uid', form_uid)
      console.log('from_uid', form_uid)
    } else if (options.scene) { //options.scene 存在
      let scene = options.scene //扫码参数
      console.log('扫描二维码', scene)
      var opsId = scene.slice(2);
      console.log('opsId 截取下划线后面的数据', opsId)
      wx.setStorageSync('form_uid', opsId)
      var first = scene.substring(0, 1); //截取字符串第一位
      console.log('first', first)
      if (first == 's') { //跳转店铺详情页面
        wx.navigateTo({
          url: '/pages/mall/shopDetail/mall/mall?json=' + scene,
        })
      } else if (first == 'u') {
        console.log('我是用户二维码')
      }

    }

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);

    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        })
      },
    })

    app.authApi.check();
    that.loadNavigations();
    that.toget()
  },


  imageLoad: function(e) {
    let that = this
    let wid = e.detail.width
    let hei = e.detail.height
    let ratio = wid / hei
    let viewWidth = 500
    let viewHeight = 500 / ratio
    that.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
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

  //定位
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
            console.log('定位', res);
            let province = res.result.address_component.province
            let city = res.result.address_component.city
            let district = res.result.address_component.district
            let lat = res.result.location.lat
            let lng = res.result.location.lng
            console.log('lat', lat, 'lng', lng)
            console.log(province, city, district)
            that.setData({
              province: province,
              city: city,
              district: district,
              lat: lat,
              lng: lng
            })

            let area = []
            area.push({
              "province": province,
              "district": district,
              "city": city,
              "lat": lat,
              "lng": lng
            })
            app.globalData.area = area //设置全局
            wx.setStorageSync('area', area)
          },
          fail: function(res) {
            console.log(res);
            wx.showToast({
              title: '定位失败',
            })
          },
          complete: function(res) {
            console.log(res);
          }
        });
        that.appsession()
      },
    })
  },


  //小程序审核状态
  appsession: function() {
    let that = this
    let data = {}
    let url = app.globalData.api + 'tcshop/store.appsession'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let code = res.data.code
        if (code == 200) {
          let appstatus = res.data.data.status
          // console.log(appstatus)
          that.setData({
            appstatus: appstatus
          })
          that.pointstatus()
        }
      })
  },


  // 积分领取的状态
  pointstatus: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    // console.log(data)
    let url = app.globalData.api + 'tcshop/store.index_points_status'
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log('积分领取的状态', res)
        let code = res.data.code
        if (code == 200) {
          let status = res.data.data
          console.log('状态', status)
          that.setData({
            status: status
          })
          // 判断
          if (status == 1) { //已领取
            that.topadvertising()
          } else {
            that.setData({
              alert: 1
            })
            that.picture()
          }
        }
      })
  },


  // 积分领取得配置图片
  picture: function() {
    let that = this
    let data = {
      id: 22
    }
    let url = app.globalData.api + 'tcshop/store.config_img'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 200) {
          let IMG = res.data.data.data
          console.log(IMG)
          that.setData({
            IMG: IMG
          })
          that.topadvertising()
        }
      })
  },


  // 首页上
  topadvertising: function() {
    let that = this
    let area = app.globalData.area
    console.log(area)
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      position: 1,
      up: 1
    }
    // console.log('1:', data)
    let url = app.globalData.api + 'mall/selectplateslider'
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log('首页上：', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          // console.log(result)
          that.setData({
            top: result
          })
          that.downadvertising()
        }
      }).catch((err) => {
        console.log(err)
      })
  },


  // 轮播图下标
  changDot: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },


  // 首页下
  downadvertising: function() {
    let that = this
    let area = app.globalData.area
    // console.log(area)
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    // console.log(provinces, citys, districts)
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      position: 2,
      up: 1
    }
    // console.log(data)
    let url = app.globalData.api + 'mall/selectplateslider'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        console.log('首页下：', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data
          // console.log(result)
          that.setData({
            down: result
          })
          that.store()
        }
      })
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


  // 推荐店铺
  store: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let area = app.globalData.area
    console.log(area)
    let provinces = area[0].province
    let citys = area[0].city
    let districts = area[0].district
    let data = {
      province: provinces,
      city: citys,
      county: districts,
      user_id: id,
      lat1: that.data.lat,
      lng1: that.data.lng
    }
    // console.log(data)
    modals.loading()
    let url = app.globalData.api + 'mall/homepromotionstore'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        let code = res.data.code
        if (code == 0) {
          // console.log('首页店铺', res)
          let result = res.data.data
          console.log('店铺：', result)

          that.setData({
            shoplist: result
          })
        }

        that.allgoods()

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
        // console.log('百货', res)
        let code = res.data.code
        if (code == 0) {
          let result = res.data.data.category[0].product
          that.setData({
            shop: result
          })
        }
      })
  },


  // 进入店铺详情
  getin: function(e) {
    console.log('e', e)
    let sc_id = e.currentTarget.dataset.item.sc_id
    console.log('sc_id', sc_id)
    let id = e.currentTarget.dataset.item.id
    if (sc_id == 2) {
      wx.navigateTo({
        url: '/pages/index/spots/spots?json=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/mall/shopDetail/mall/mall?json=' + id,
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

  swiperTap(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    app.agriknow.slider(id).then(res => {
      console.log('轮播详情', res.data.data.product.length)
      let product = res.data.data.product
      if (product.length != 0) {
        wx.navigateTo({
          url: '/pages/mall/seeBanner/seeBanner?id=' + id,
        })
      } else if (product.length == 0) {

      }
    }).catch(err => {
      console.log(err)
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

  // --- 下拉刷新
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
    this.store();
  },

  onShow: function() {
    let that = this
    // let area = app.globalData.area
    // console.log(area)
    // // 判断
    // if (area) {
    //   that.setData({
    //     province: area[0].province,
    //     city: area[0].city,
    //     district: area[0].district
    //   })
    // } else {
    //   that.toget();
    // }

    // that.toget()
  },

  onShareAppMessage: function(res) {
    let users = wx.getStorageSync('user');
    console.log('form_uid=', users.id)
    if (res.from === 'button') {}
    return {
      title: '商小盟',
      path: '/pages/index/index?form_uid=' + users.id,
      success: function(res) {}
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {
  //   let that = this
  //   this.setData({
  //     pageTottomText: ''
  //   });
  //   let pageN = this.data.pageN;
  //   console.log('pageN', pageN)
  //   that.setData({
  //     pageTottomText: getApp().globalData.addText,
  //   });
  //   let id = wx.getStorageSync('user').id
  //   let area = app.globalData.area
  //   let provinces = area[0].province
  //   let citys = area[0].city
  //   let districts = area[0].district
  //   let data = {
  //     province: provinces,
  //     city: citys,
  //     county: districts,
  //     user_id: id,
  //     lat1: that.data.lat,
  //     lng1: that.data.lng
  //   }
  //   let url = app.globalData.api + 'mall/homepromotionstore'
  //   request.sendRequest(url, 'post', data, {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     })
  //     .then(function(res) {
  //       let result = res.data.data
  //       if (result.length > 0) {
  //         pageN += 1;
  //         that.setData({
  //           pageN: pageN
  //         })
  //         setTimeout(function() {
  //           let item = that.data.shoplist.concat(result)
  //           that.setData({
  //             shoplist: item
  //           });
  //           console.log('pageN', pageN, '地区分页', item)
  //         }, 1000);
  //       } else {
  //         that.setData({
  //           pageTottomText: getApp().globalData.endText,
  //         });
  //       }

  //     })
  // },

})