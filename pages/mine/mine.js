import modals from '../../class/base/modal.js'
import Tips from '../../class/utils/Tips.js';

const request = require('../../class/api/_request.js')


const app = getApp();
Page({



  data: {
    userInfo: {},

    list: [{
        url: '/img/img/oride.png',
        title: '我的订单',
        path: '/pages/mine/orderList/orderList'
      },
      {
        url: '/img/img/wodeyuding@2x.png',
        title: '我的预定',
        path: '/pages/mine/reserve/reserve'
      },
      {
        url: '/img/img/wodehuodong@2x.png',
        title: '我的活动',
        path: '/pages/mine/messageCenter/messageCenter'
      },
      {
        url: '/img/img/wodejifen@2x.png',
        title: '我的奖励金',
        path: '/pages/mine/myDistribution/myDistribution',
        isInFo: true
      },
      {
        url: '/img/img/guanzhudianpu@2x.png',
        title: '关注店铺',
        path: '/pages/mine/dynamic/dynamic'
      },
      {
        url: '/img/img/shangjiaruzhu@2x.png',
        title: '商家入驻',
        // path: '/pages/mine/collection/collection',
        // path: '/pages/mine/collection/admission/admission',
        path: '/pages/mine/collection/agree/agree',
        none: 0
      },
      {
        url: '/img/img/wodedianpu@2x.png',
        title: '我的店铺',
        path: '/pages/mine/training/training',
        none: 1
      }
    ],

    list_send: [{
        url: '/img/img/oride.png',
        title: '我的订单',
        path: '/pages/mine/orderList/orderList'
      },
      {
        url: '/img/img/wodeyuding@2x.png',
        title: '我的预定',
        path: '/pages/mine/reserve/reserve'
      },
      {
        url: '/img/img/wodehuodong@2x.png',
        title: '我的活动',
        path: '/pages/mine/messageCenter/messageCenter'
      },
      {
        url: '/img/img/wodejifen@2x.png',
        title: '我的奖励金',
        path: '/pages/mine/myDistribution/myDistribution',
        isInFo: true
      }
    ],
    points: 0, //积分
    toInvitation: false,
    winHeight: 0,
    img: '',
    grade_name: '', //会员等级
    grade: '', //享受的折扣
  },

  // -------- 点击图片放大 保存 -------
  previewImage1: function(e) {
    var that = this
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: that.data.img.split(',')
      // 需要预览的图片http链接 使用split把字符串转数组。不然会报错 
    })
  },

  //取消遮罩
  cal_alert() {
    this.setData({
      toInvitation: false
    })
  },



  //保存至相册
  saveImageToPhotosAlbum: function() {
    let that = this
    wx.downloadFile({
      url: that.data.img,
      success: function(res) {
        console.log('保存到相册', res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log('保存成功', res)
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function(res) {
            console.log(res)
            console.log('fail')
            wx.showToast({
              title: '保存失败',
            })
          }
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  },


  //导航跳转
  toNext(e) {
    let that = this
    let path = e.currentTarget.dataset.path;
    let index = e.currentTarget.dataset.index
    // if(index == 0){
      // app.router.redirect(path)
    // }else{
      app.router.nav(path)
    // }
  },

  userInfo() {
    wx.navigateTo({
      url: '/pages/mine/modify/modify',
    })
  },

  //我的推广
  toInvitation() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.token().then(res => {
      console.log('获取用户token', res)
      let token = res.data.data.access_token
      //获取用户二维码
      app.agriknow.postCode(token, uid).then(res => {
        console.log('二维码', res)
        that.setData({
          img: res.data.data
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
    that.setData({
      toInvitation: true
    })

    // wx.navigateTo({
    //   url: '/pages/mine/toInvitation/toInvitation',
    // })
  },

  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },



  onShow: function() {
    let that = this;
    app.authApi.check();
    let user = wx.getStorageSync('user')
    // console.log('缓存user', user)
    this.setData({
      userInfo: user
    })
    //查询积分明细
    app.agriknow.integral(user.id).then(res => {
      console.log(' 查询积分明细 =>', res)
      that.setData({
        points: res.data.data.user.points
      })
    }).catch(err => {
      console.log(err)
    })
    // if (user.mobile_verify == 1) {
    //   let path = '/pages/mine/collection/shop/shop'
    //   var url = 'list[6].path'
    //   this.setData({
    //     [url]: path
    //   })
    // }
    //查询用户信息
    app.agriknow.getUser(user.id).then(res => {
      console.log(' 查询用户信息 =>', res)
      that.setData({
        lv: res.data.data.grade_name,
        grade: res.data.data.grade_bili
      })
    }).catch(err => {
      console.log(err)
    })

    // 判断是不是商家
    app.agriknow.select(user.id).then(res => {
      console.log('判断是否商家', res)
      console.log('判断是不是商家 =>', res.data.data.status)
      let num = parseInt(res.data.data.status) //0 1
      let status = null
      if (num == 0) {
        status = 1
      } else {
        status = 0
      }
      that.setData({
        'list[5].none': num,
        'list[6].none': status
      })
    }).catch(err => {
      console.log(err)
    })

    that.appsession()
  },

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
        }
      })
  },




})