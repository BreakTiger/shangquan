const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
var app = getApp();
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');
import getCity from "../../../../class/api/getCity.js"
import Tips from '../../../../class/utils/Tips.js';
var qqmapsdk = new QQMapWX({
  key: '2KDBZ-QW4WJ-BU4FA-KIJQR-IA4E5-KMFU5'
});


Page({

  data: {
    specifications: false,
    arr: [],
    vipIndex: 0,
    vip: ["不享受会员专享折扣", "享受会员专享折扣"],
    mindex: 0,
    length: 0,
    imagebox: app.globalData.imagebox,
    shop: '',
    sc_id: '',
    goodlist: [],
    goodIndex: 0,
    imgbox1: [],
    img: '/img/img/add_pic@2x.png',
    date: '请选择时间',
    lovePhone: false,
    detailbox: '',
    points: [{
        num: 1,
        text: "不参与",
      }, {
        num: 2,
        text: "5",
      },
      {
        num: 3,
        text: "10",
      },
      {
        num: 4,
        text: "15",
      },
      {
        num: 5,
        text: "20",
      },
      {
        num: 6,
        text: "25",
      },
      {
        num: 7,
        text: "30",
      },
      {
        num: 8,
        text: "35",
      },
      {
        num: 9,
        text: "45",
      },
      {
        num: 10,
        text: "50",
      }, {
        num: 2,
        text: "55",
      },
      {
        num: 3,
        text: "60",
      },
      {
        num: 4,
        text: "65",
      },
      {
        num: 5,
        text: "70",
      },
      {
        num: 6,
        text: "75",
      },
      {
        num: 7,
        text: "80",
      },
      {
        num: 8,
        text: "85",
      },
      {
        num: 9,
        text: "90",
      },
      {
        num: 10,
        text: "95",
      },
      {
        num: 10,
        text: "100",
      }
    ],
    pindex: 0,
    _points: true,
    address: '',
    gid: '',
    index: 0,
    bannerindex: 0,
    lng: '',
    lat: '',
    destination: ''
  },
  price(e) {
    var num = e.detail.value;
    var x = String(num).indexOf('.') + 1;
    var y = String(num).length - x;
    console.log('y', y)
    let sum = String(num).indexOf(".")
    console.log('sum', sum)
    if (sum > 0 && y == 2) {
      wx.showModal({
        title: '提示',
        content: '最多两位0.00，后面不能输了',
        showCancel: false
      })
    }
  },
  //享受会员专享折扣
  vip: function(e) {
    var that = this
    console.log('享受会员专享折扣', e.detail.value)
    let index = e.detail.value
    if (index == 0) {
      that.setData({
        _points: true
      })
    } else {
      that.setData({
        _points: false
      })
    }
    this.setData({
      vipIndex: index
    })
  },
  //积分抵扣
  points_: function(e) {
    console.log('积分抵扣', e.detail.value)
    this.setData({
      pindex: e.detail.value
    })
  },

  // 手机验证
  lovePhone: function(e) {
    let phone = e.detail.value;
    // console.log('我需要的手机号phone +', phone)
    // console.log(phone)
    this.setData({
      hongyzphone: phone
    })
    // console.log(hongyzphone)
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        lovePhone: false
      })
      console.log(phone.length)
      if (phone.length >= 11) {

        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 1000
        })
      }
    } else {
      this.setData({
        lovePhone: true

      })
    }
  },
  //图片删除
  imgDelete2: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('删除', index)
    let imgbox1 = this.data.detailbox;
    imgbox1.splice(index, 1)
    that.setData({
      detailbox: imgbox1
    });
  },
  //图片删除
  imgDelete: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('删除', index)
    let imgbox1 = this.data.imgbox1;
    imgbox1.splice(index, 1)
    that.setData({
      imgbox1: imgbox1
    });
  },

  onLoad: function(options) {
    let that = this
    let imagebox = app.globalData.imagebox
    console.log('imagebox', imagebox)
    if (imagebox) {
      console.log('imagebox', imagebox)
      that.setData({
        imagebox: imagebox
      })
    }
    let uid = wx.getStorageSync('user').id
    // 查询点店铺详情
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data,
        sc_id: res.data.data.sc_id
      })
    }).catch(err => {
      console.log(err)
    })


  },

  // 规格数量
  length: function(e) {
    let length = e.detail.value.length
    // console.log(length)
    this.setData({
      length: length
    })
  },



  // 删除照片 &&
  Delete: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let arr = this.data.arr;
    arr.splice(index, 1)
    that.setData({
      arr: arr
    });
  },



  // 唤出添加套餐弹窗
  addTo: function() {
    this.setData({
      specifications: true
    })
  },

  // 弹窗取消按钮
  quxiao: function() {
    let that = this
    that.setData({
      specifications: false
    })
  },


  // 商品图

  // 上传图片 &&&
  addPic1: function(e) {
    var imgbox = this.data.imgbox1;
    console.log(imgbox)
    var picid = e.currentTarget.dataset.pic;
    console.log(picid)
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
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
          imgbox[picid] = tempFilePaths;
        }
        that.setData({
          imgbox1: imgbox
        });
      }
    })
  },

  // 上传图片 &&&
  addPic2: function(e) {
    var imgbox = this.data.detailbox;
    // console.log(imgbox)
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
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
          imgbox[picid] = tempFilePaths;
        }
        that.setData({
          detailbox: imgbox
        });
      }
    })
  },

  //添加活动套擦规格
  toSubmit: function(e) {
    let that = this
    let val = e.detail.value
    console.log('活动套餐', val)
    console.log('val', val, 'val.leng', e.detail.value.length)
    let list = val.list
    let price = val.price
    console.log('list', list, 'price', price)
    var length = that.data.arr.length
    if (length <= 2) {
      if (val.list != '' && val.price != '') {
        if (that.data.arr == '') {
          let array = []
          array.push({
            "list": list,
            "price": price
          });
          console.log('array', array)
          that.setData({
            arr: array,
            specifications: false
          })
        } else {
          let item = that.data.arr.concat(val)
          that.setData({
            arr: item,
            specifications: false
          })
          console.log('that.data.arr', that.data.arr)
        }
      } else {
        wx.showToast({
          title: '请填充完整',
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '最多上传三个套餐',
        showCancel: false
      })
    }
  },


  // 活动时间
  bindDateChange: function(e) {
    console.log('截止时间', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },




  // 提交所有的信息
  addSubmit: function(e) {
    let that = this
    console.log(e)
    let val = e.detail.value
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('所有信息', val)
    // 商铺id
    let item = that.data.shop
    let sid = item.id
    console.log(sid)
    // 活动标题
    let title = val.activity_name
    console.log('标题+', title)
    // 活动内容
    // let describe = val.describe
    let describe = ''
    console.log('活动内容', describe)
    // 发布人id
    let mid = wx.getStorageSync('user').id
    console.log('发布人ID', mid)
    // 发布人姓名
    let mine = val.mine
    console.log('姓名', mine)
    // 发布人头像
    let mheader = wx.getStorageSync('user').avatar
    console.log('头像', mheader)
    // 集合地点
    let gather = val.gather
    console.log('集合地点', gather)
    // 联系电话
    let phone = val.phone
    console.log('联系电话', phone)
    // 目的地
    let destination = val.destination
    console.log('目的地', destination)
    // 活动须知
    let attention = val.attention
    console.log('活动须知：', attention)
    // 套餐
    let meal = that.data.arr
    let array_ = JSON.stringify(that.data.arr)
    console.log('套餐', that.data.arr.length)
    console.log('meal length', meal.length)
    // 活动时间
    let atime = that.data.date
    console.log('活动时间：', atime)
    // 是否享受会员折扣，0不享受，1享受
    let numbers = val.is_member
    console.log('会员', numbers)
    // 0为不享受积分折扣，其他为折扣百分比
    // let points = val.is_points
    // console.log('积分', points)
    // 现价

    let price_arr = that.data.arr
    let nowprice = price_arr[0].price //现价
    console.log('price', nowprice)
    // let nowprice = val.price
    // console.log('现价', nowprice)
    // 原价
    let yuan = val.market_price
    console.log('原价：', yuan)
    let is_points = null //积分折扣
    if (val.is_points == "不参与") {
      is_points = 0
    } else {
      is_points = val.is_points
    }
    console.log('is_points', is_points)
    let data = {
      store_id: sid,
      title: title,
      content: describe,
      user_id: mid,
      user_name: mine,
      user_avatar: mheader,
      resort: gather,
      mobile: phone,
      destination: destination,
      explain: attention,
      specifications: array_,
      activity_time: atime,
      is_member: numbers,
      is_points: is_points,
      price: nowprice,
      market_price: yuan,
      freight: 0,
      lat: that.data.store_lat,
      lon: that.data.store_lng
    }
    console.log('data', data)
    console.log('请求数据：', data)
    let url = app.globalData.api + 'tcshop/store.activity_apply'
    // 判断
    if (that.data.imgbox1.length == 0 && that.data.detailbox.length == 0) {
      modals.showToast('请上传商品图片', 'none')
    } else if (title == '') {
      modals.showToast('请填写活动标题', 'none')
    } else if (yuan == '') {
      modals.showToast('请填写原价', 'none')
    } else if (nowprice == '') {
      modals.showToast('请填写价格', 'none')
    } else if (meal == '' && that.data.arr == '') {
      modals.showToast('请添加套餐', 'none')
    } else if (gather == '') {
      modals.showToast('请输入集合地', 'none')
    } else if (destination == '') {
      modals.showToast('请输入目的地', 'none')
    } else if (mine == '') {
      modals.showToast('请输入发布者的姓名', 'none')
    } else if (meal.length > 3) {
      modals.showToast('只能上传3个套餐', 'none')
    }
    //  else if (describe == '') {
    //   modals.showToast('请输入活动详情', 'none')
    // }
    else if (phone == '') {
      modals.showToast('请输入联系电话', 'none')
    } else if (atime == '请选择时间' && val.close_book_time == '请选择时间') {
      modals.showToast('请设置活动开始时间', 'none')
    } else if (that.data.lovePhone == false) {
      modals.showToast('手机号有误', 'none')
    } else {
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log(res)
          let code = res.data.code
          if (code == 200) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            let aid = res.data.data
            that.setData({
              gid: aid
            })
            console.log('a')
            that.upimages(aid);
            // that.uploadDetail(aid);
            that.upload_file(); //上传详情图
            wx.showToast({
              title: '添加成功',
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/index/caseShare/caseShare',
              })
            }, 1500)
        } else if (code == 701003) {
          modals.showToast('您的橱窗不足，无法发布活动', 'none')
        }
      })
    }
  },

  //循环上传图片
  upload_file: function() {
    let that = this
    let imagebox = that.data.detailbox
    let gid = that.data.gid
    let index = that.data.index
    let length = parseInt(imagebox.length) + 1
    wx.uploadFile({
      url: 'https://circle.didu86.com/tcshop/store.activity_detail_image',
      filePath: imagebox[index],
      name: 'files',
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      formData: {
        activity_id: gid,
        type: 1
      },
      success: function(res) {
        console.log(' 图片详情 success', res)
        if (true) {
          if (index == imagebox.length) {
            console.log("全部上传完毕了");
          } else {
            index++;
            that.setData({
              index: index
            })
            if (length == index) {
              console.log('停止上传')
            } else {
              that.upload_file();
            }
          }
        } else {
          //打印错误信息
          console.log("上传错误")
        }
      },
      fail() {
        console.log('上传详情失败')
      }

    })
  },
  //循环上传图片
  upload_banner: function() {
    let that = this
    let imagebox = that.data.imgbox1
    let gid = that.data.gid
    let index = that.data.bannerindex
    let length = parseInt(imagebox.length) + 1
    wx.uploadFile({
      url: 'https://circle.didu86.com/tcshop/store.activity_detail_image',
      filePath: imagebox[index],
      name: 'files',
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      formData: {
        activity_id: gid
      },
      success: function(res) {
        console.log(' 图片详情 success', res)
        if (true) {
          if (index == imagebox.length) {
            console.log("全部上传完毕了");
          } else {
            index++;
            that.setData({
              bannerindex: index
            })
            if (length == index) {
              console.log('停止上传')
            } else {
              that.upload_banner();
            }
          }
        } else {
          //打印错误信息
          console.log("上传错误")
        }
      },
      fail() {
        console.log('上传详情失败')
      }

    })
  },

  //上传图片详情
  uploadDetail(aid) {
    let that = this
    if (that.data.detailbox.length != 0) {
      let imagebox = that.data.detailbox
      for (let i = 0; i < imagebox.length; i++) {
        console.log('我要上传的每个图片', imagebox[i])
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.activity_detail_image',
          filePath: imagebox[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            activity_id: aid,
            type: 1
          },
          success: function(res) {
            console.log('图片上传成功', res)
          },
          fail: function() {
            console.log('图片上传失败')
          }
        })
      }
    } else {
      wx.showToast({
        title: '请上传图片',
      })
    }
  },

  // 上传图片
  upimages: function(aid) {
    let that = this
    let imagelist = that.data.imgbox1
    console.log('上传的图片数组', imagelist)

    for (let i = 0; i < imagelist.length; i++) {
      let item = imagelist[i]
      console.log(item)
      wx.uploadFile({
        url: 'https://circle.didu86.com/tcshop/store.upload_activity_image',
        filePath: item,
        name: 'files',
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: 'post',
        formData: {
          activity_id: aid,
          type: 1
        },
        success: function(res) {
          console.log('图片上传成功', res)
        },
        fail: function(res) {
          console.log('图片上传失败')
        }
      })
    }


  },



  //上传轮播图片
  upload: function(gid) {
    let that = this
    if (that.data.imagebox != '') {
      let imagebox = that.data.imagebox
      for (let i = 0; i < imagebox.length; i++) {
        console.log('我要上传的每个图片', imagebox[i])
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.upload_goods_image',
          filePath: that.data.imagebox[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            goods_id: gid
          },
          success: function(res) {
            console.log('图片上传成功', res)
            app.globalData.imagebox = []
          },
          fail: function() {
            console.log('图片上传失败')
          }
        })
      }
    }
  },
  //获取地理
  area() {
    var that = this
    that.choosearea();
    // that.getUserLocation();
  },
  area_() {
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
            let store_lat = res.result.location.lat;
            let store_lng = res.result.location.lng
            that.setData({
              destination: address,
              lng: store_lng,
              lat: store_lat
            })
            console.log('that.data.store_lng', that.data.lng, 'store_lat', that.data.lat, 'destination', that.data.destination)
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
            let store_lat = res.result.location.lat;
            let store_lng = res.result.location.lng
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

})