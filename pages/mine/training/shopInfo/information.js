var app = getApp();
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');
import getCity from "../../../../class/api/getCity.js"
const request = require('../../../../class/api/_request.js')
import Tips from '../../../../class/utils/Tips.js';
var qqmapsdk = new QQMapWX({
  key: '2KDBZ-QW4WJ-BU4FA-KIJQR-IA4E5-KMFU5'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox1: '',
    date: '请输入时间',
    time: "09:00",
    time1: "22:00",
    invoice: ["否", "是"],
    inIndex: 0,
    imgbox2: '',
    imgbox3: '',
    img: '/img/img/add_pic@2x.png',
    list: [],
    index1: 0,
    shop: [],
    arr: '',
    user: '',
    business_img: '',
    address: '',
    store_lng: '',
    store_lat: ''
  },
  //时间
  bindDateChange: function(e) {
    console.log('时间的选择', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //经营类型
  bindchange3: function(e) {
    console.log('经营类型=>', e, e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  //经营时间
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
  // 是否开发票
  bindPickerChange: function(e) {
    console.log('是否开发票', e.detail.value)
    this.setData({
      inIndex: e.detail.value
    })
  },
  // 头像修改函数
  headImg: function() {
    let that = this;
    // wx.showModal({
    //   title: '提示',
    //   content: '确定要修改头像吗',
    //   success: function(res) {
    //     if (res.confirm) {
    // that.headUpdate()
    //     } else if (res.cancel) {}
    //   }
    // })
  },
  headUpdate: function() {
    let imgbox1 = []
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        imgbox1 = tempFilePaths[0];
        that.setData({
          imgbox1: imgbox1
        })
        console.log('that.data.imgbox1', that.data.imgbox1)
      }
    })
  },
  //上传营业执照
  // 删除照片 &&
  imgDelete1: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox2;
    imgbox.splice(index, 1)
    that.setData({
      imgbox2: imgbox
    });
  },
  // 上传图片 &&&
  addPic1: function(e) {
    var imgbox = this.data.imgbox2;
    console.log(imgbox)
    var picid = e.currentTarget.dataset.pic;
    console.log(picid)
    var that = this;
    // var n = 9;
    // if (9 > imgbox.length > 0) {
    //   n = 9 - imgbox.length;
    // } else if (imgbox.length == 9) {
    //   n = 1;
    // },
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
          imgbox2: imgbox
        });
        console.log('imgbox2', that.data.imgbox2)
      }
    })
  },

  // 上传背景
  background() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        // imgbox3 = tempFilePaths[0];
        that.setData({
          imgbox3: tempFilePaths[0]
        })
        console.log('imgbox3', that.data.imgbox3)
      }
    })
  },
  teformSubmit(e) {
    let that = this
    let val = e.detail.value
    console.log('form=>', val)
    let store_name = val.store_name
    let store_user_name = that.data.shop.store_user_name
    let sc_id = that.data.shop.sc_id
    let time = val.time + '-' + val.time1
    let address = val.area
    let uid = wx.getStorageSync('user').id
    let invoice = val.is_invoice
    // let summary = val.summary
    let summary = '店铺简介'
    console.log('time', time)
    let lat = that.data.store_lat
    let lon = that.data.store_lng
    console.log('lat', lat, 'lon', lon)
    let data = {
      store_name: store_name,
      store_user_name: store_user_name,
      sc_id: sc_id,
      business_time: time,
      address: address,
      user_id: uid,
      is_invoice: invoice,
      summary: summary,
      lat: lat,
      lon: lon
    }
    console.log('data', data)
    if (val.store_name != '' && val.time != '' && val.time1 != '' && val.mobile != '' && val.area != '' && val.is_invoice != ''  && that.data.imgbox1 != '' && that.data.imgbox3 != '') {
      let url = 'https://circle.didu86.com/tcshop/store.store_apply'
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log('form表单提交code',res.data.code)
          console.log('提交成功', res)
          if (res.data.code == 200) {
            //上传头像
            let img1 = that.data.imgbox1
            console.log('img1', img1)
            that.upload(img1, 1);
            //上传店铺横幅
            // let img2 = that.data.imgbox3
            // console.log('img2', img2)
            // that.upload(img2, 2)
            //上传营业执照
            if (!that.data.imgbox2) {
              console.log('我没有选择营业执照')
              that.hidden();
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function() {
                wx.redirectTo({
                  url: '/pages/mine/training/training',
                })
              }, 1500)
            } else {
              console.log('选择了营业执照')
              let img3 = that.data.imgbox2[0]
              console.log('img3', img3)
              that.upload(img3, 3)
              that.hidden();
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/mine/training/training',
                })
              }, 1500)
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '提交失败',
              showCancel: true
            })
          }
        }, function(err) {
          console.log(err);
        });
    } else {
      wx.showToast({
        title: '请填充完整',
        icon: 'success',
        duration: 1500
      })
    }
  },
  //上传图片
  upload(img, type_) {
    let uid = wx.getStorageSync('user').id
    wx.uploadFile({
      url: 'https://circle.didu86.com/tcshop/store.store_apply_img',
      filePath: img,
      name: 'files',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      formData: {
        user_id: uid,
        type: type_
      },
      success: function(res) {
        console.log('图片上传成功', res)
      },
      fail: function(res) {
        console.log('图片上传失败')
      }
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
        console.log(latitude)
        console.log(longitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log("获取区域", res)
            let address = res.result.address;
            let store_lng = res.result.location.lat;
            let store_lat = res.result.location.lng
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

  },
  getUserLocation: function() {
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude

        console.log('获取经纬度', latitude, longitude)
        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)


        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  //根据经纬度在地图上显示
  openLocation: function(e) {
    var value = e.detail.value
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude)
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log(res)
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let district = res.result.ad_info.district
        let city = res.result.ad_info.city
        let address = res.result.address_component.street_number
        console.log(province)
        console.log(district)
        console.log(city)
        console.log(address)
        console.log(latitude)
        console.log(longitude)
        that.setData({
          province: province,
          district: district,
          city: city,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
        wx.setStorageSync('area', province + '-' + city + '-' + district + '-' + address)
        // wx.setStorageSync('area','浙江省-杭州市-江干区')

        console.log(district, city, address)
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        //console.log(res);
      }
    });
  },
  onLoad: function(options) {
    console.log('imgbox1', this.data.imgbox1)
    var that = this
    let user = wx.getStorageSync('user')
    app.agriknow.BusinessType().then(res => {
      console.log('经营类型', res.data)
      let list = res.data
      that.setData({
        list: res.data,
        user: user
      })
      that.hidden();
    }).catch(err => {
      console.log(err)
    })
  },
  list() {
    let that = this
    let list = that.data.list
    for (var i = 0; i < list.length; i++)
      if (list[i].id == that.data.shop.sc_id) {
        let arr = list[i].sc_name
        console.log('arr', arr)
        that.setData({
          arr: arr
        })
      }
  },
  hidden() {
    var that = this
    //查询店铺详情
    let uid = wx.getStorageSync('user').id
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询店铺详情', res)
      let result = res.data.data
      let inIndex = 0;
      if (result.is_invoice == 0) {
        inIndex = 0
      } else if (result.is_invoice == 1) {
        inIndex = 1
      }
      that.setData({
        shop: res.data.data,
        time: res.data.data.star_time,
        time1: res.data.data.end_time,
        business_img: res.data.data.business_img,
        imgbox1: res.data.data.store_avatar,
        imgbox3: res.data.data.store_banner,
        inIndex: inIndex,
        store_lat: result.lat || 0,
        store_lng: result.lon || 0,
        address: res.data.data.address || ''
      })
      console.log('res.data.data.star_time', res.data.data.star_time, 'res.data.data.end_time', res.data.data.end_time, )
      console.log('imgbox3', that.data.imgbox3)
      that.list();
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {}
})