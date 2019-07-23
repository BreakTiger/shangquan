const app = getApp();
import Tips from '../../../../class/utils/Tips.js';
var WxParse = require('../../../wxParse/wxParse.js');
const WeValidator = require('../../../../vendor/we-validator.js');
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');
import getCity from "../../../../class/api/getCity.js"
var qqmapsdk = new QQMapWX({
  key: '2KDBZ-QW4WJ-BU4FA-KIJQR-IA4E5-KMFU5'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: '',
    time: '09:00',
    time1: '22:00',
    list: [],
    index1: 0,
    shop: [],
    code: null, // 0关闭 1开始 2 审核
    address: '',
    store_lng: '',
    store_lat: '',
    _selected: 1,
    toInvitation: false,
    nodes: [],
    paihang: '',
    displaya: true,
    img: ''
  },
  currency() {
    let that = this
    if (that.data._selected == 0) {
      that.setData({
        _selected: 1
      })
    } else {
      that.setData({
        _selected: 0
      })
    }
  },
  //取消遮罩
  cal_alert() {
    this.setData({
      paihang: false
    })
  },
  // 取消遮罩
  quxiao() {
    this.setData({
      // paihang: 0
      paihang: false
    })
  },
  //遮罩动效
  hideview() {
    var that = this
    let paihang = that.data.paihang
    that.setData({
      // paihang: !paihang
      paihang: true
    })
  },
  //协议
  current() {
    this.setData({
      paihang: true
    })
  },
  bindchange3: function(e) {
    console.log('经营类型=>', e, e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  // 删除照片 &&
  imgDelete1: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 上传图片 &&&
  addPic1: function(e) {
    var imgbox = this.data.imgbox;
    console.log('imgbox', imgbox)
    var picid = e.currentTarget.dataset.pic;
    console.log(picid)
    var that = this;
    // var n = 0;
    // if (1 > imgbox.length > 0) {
    //   n = 9 - imgbox.length;
    // } else if (imgbox.length == 9) {
    //   n = 1;
    // }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (9 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);

        } else {
          imgbox[picid] = tempFilePaths[0];
        }
        that.setData({
          imgbox: imgbox
        });
        console.log('imgbox', that.data.imgbox)
      }
    })
  },
  fill() {
    wx.navigateTo({
      url: '/pages/mine/collection/fill/fill',
    })
  },
  bindTimeChange: function(e) {
    console.log('起始时间', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindTimeChange1: function(e) {
    console.log('终止时间', e.detail.value)
    this.setData({
      time1: e.detail.value
    })
  },
  toformSubmit(e) {
    let that = this
    let val = e.detail.value
    console.log('val', val)
    // console.log('val.sc_name .id', val.sc_id)
    let time = that.data.time + '-' + that.data.time1
    let password = val.password
    let lat = that.data.store_lat
    let lon = that.data.store_lng
    console.log('lat', lat, 'lon', lon)
    console.log('time', time)
    console.log('password', password, lat, lon, 'val.password', val.password, 'val.password1', val.password1)
    if (that.data._selected == 1) {
      if (val.password == val.password1) {
        if (val.store_name != '' && val.store_user_name != '' && val.address != '' && val.sc_id != '' && val.password != '' && that.data.imgbox.length != 0) {
          var formid = e.detail.formId
          let openid = wx.getStorageSync('user').weixin_openid
          let sname = val.store_name
          let uname = val.store_user_name
          let sid = val.sc_id
          let area = val.address
          let uid = wx.getStorageSync('user').id
          app.agriknow.join_admission(sname, uname, sid, time, area, uid, password, lat, lon).then(res => {
            console.log('form表单=> res', res)
            if (res.data.code == 200) { //请求成功
              //上传图片
              wx.uploadFile({
                url: 'https://circle.didu86.com/tcshop/store.store_apply_img',
                filePath: that.data.imgbox[0],
                name: 'files',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                formData: {
                  user_id: uid,
                  type: 3
                },
                success: function(res) {
                  console.log('图片上传成功', res)
                  if (res.statusCode == 200) {
                    //formid 收集
                    app.agriknow.formId(formid, openid, uid).then(res => {
                      console.log('fromid收集', res)
                    }).catch(err => {
                      console.log(err)
                    })
                    wx.showToast({
                      title: '提交成功',
                    })
                    setTimeout(function() {
                      wx.switchTab({
                        url: '/pages/mine/mine',
                      })
                    }, 1500)
                  } else {
                    wx.showToast({
                      title: '上传失败',
                    })
                  }
                },
                fail: function() {
                  console.log('图片上传失败')
                }
              })
            } else {
              wx.showToast({
                title: '失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.showToast({
            title: '请填充完整',
            icon: 'success',
            duration: 1500
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '两次密码不一致',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请同意入驻协议',
        showCancel: false
      })
    }

  },
  onLoad: function(options) {
    var that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.admission().then(res => {
      console.log('onload.res =>', res)
      let text = res.data[0].value
      let img = res.data[1].value
      // that.setData({
      //   text: text,
      //   img: res
      // })
      let article = text
      WxParse.wxParse('article', 'html', article, that, 5);
      that.setData({
        nodes: article
      })
      // that.admission(text);
    }).catch(err => {
      console.log(err)
    })
    app.agriknow.BusinessType().then(res => {
      // console.log('经营类型', res.data)
      that.setData({
        list: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      let code = null
      if (res.data.code == 601004) {
        code = 0
      } else {
        code = 1
      }
      that.setData({
        code: code,
        shop: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
    // 商家入驻审核中图片
    app.agriknow.getImg().then(res => {
      console.log('商家入驻审核中图片', res.data.data.data)
      that.setData({
        img: res.data.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },

  //获取地理
  area() {
    var that = this
    that.choosearea();
    // that.getUserLocation();
  },

  //详细地址地区
  choosearea() {
    let that = this
    wx.chooseLocation({
      success: function(res) {
        console.log('位置', res);
        let latitude = res.latitude;
        let longitude = res.longitude;
        console.log('lat:', latitude)
        console.log('lon:', longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log("获取区域", res)
            let address = res.result.address;
            let store_lng = res.result.location.lng;
            let store_lat = res.result.location.lat
            that.setData({
              address: address,
              store_lng: store_lng,
              store_lat: store_lat
            })
            console.log('that.data.store_lng', that.data.store_lng, 'store_lat', that.data.store_lat, 'qu', that.data.address)
          }
        })
        let region1 = res.address;
        that.setData({
          region1: region1
        })
      },
      fail: function(res) {
        Tips.alert('请授权地理位置')

      },
    })
  }
})