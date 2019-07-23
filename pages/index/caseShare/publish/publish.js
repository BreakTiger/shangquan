const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
var app = getApp();


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
    date: '请选择时间'
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
    // let gid = that.data.shopData.id
    // let sid = that.data.shop.id //店铺id
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
    let index = e.currentTarget.dataset.deindex;
    let arr = this.data.arr;
    arr.splice(index, 1)
    that.setData({
      arr: arr
    });
  },


  //享受会员专享折扣
  vip: function(e) {
    console.log('vip')
    console.log('享受会员专享折扣', e.detail.value)
    this.setData({
      vipIndex: e.detail.value
    })
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


  //添加活动套擦规格
  toSubmit: function(e) {
    let that = this
    let val = e.detail.value
    console.log('活动套餐', val)
    console.log('val', val, 'val.leng', e.detail.value.length)
    let list = val.list
    let price = val.price
    console.log('list', list, 'price', price)
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
    let describe = val.describe
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
    let meal = JSON.stringify(that.data.arr)
    console.log('套餐', that.data.arr)
    // 活动时间
    let atime = that.data.date
    console.log('活动时间：', atime)
    // 是否享受会员折扣，0不享受，1享受
    let numbers = val.is_member
    console.log('会员', numbers)
    // 0为不享受积分折扣，其他为折扣百分比
    let points = val.is_points
    console.log('积分', points)
    // 现价
    let nowprice = val.price
    console.log('现价', nowprice)
    // 原价
    let yuan = val.market_price
    console.log('原价：', yuan)
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
      specifications: meal,
      activity_time: atime,
      is_member: numbers,
      is_points: points,
      price: nowprice,
      market_price: yuan
    }
    console.log('请求数据：', data)
    let url = app.globalData.api + 'tcshop/store.activity_apply'
    // 判断
    if (that.data.imgbox1.length == 0) {
      modals.showToast('请上传商品图片', 'none')
    } else if (title == '') {
      modals.showToast('请填写活动标题', 'none')
    } else if (yuan == '') {
      modals.showToast('请填写原价', 'none')
    } else if (nowprice == '') {
      modals.showToast('请填写价格', 'none')
    } else if (meal.length == 0) {
      modals.showToast('请添加套餐', 'none')
    } else if (gather == '') {
      modals.showToast('请输入集合地', 'none')
    } else if (destination == '') {
      modals.showToast('请输入目的地', 'none')
    } else if (mine == '') {
      modals.showToast('请输入发布者的姓名', 'none')
    } else if (describe == '') {
      modals.showToast('请输入活动详情', 'none')
    } else if (phone == '') {
      modals.showToast('请输入联系电话', 'none')
    } else if (atime == '') {
      modals.showToast('请设置活动开始时间', 'none')
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
              app.globalData.shop = res.data.data //店铺信息存入缓存
            }).catch(err => {
              console.log(err)
            })
            let aid = res.data.data
            that.upimages(aid)
            // wx.redirectTo({
            //   url: '/pages/index/caseShare/caseShare',
            // })
          } else if (code == 701003) {
            modals.showToast('您的橱窗不足，无法发布活动', 'none')
          }
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
          activity_id: aid
        },
        success: function(res) {
          console.log('图片上传成功', res)
          // app.globalData.imagebox = []
          wx.redirectTo({
            url: '/pages/index/caseShare/caseShare',
          })
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
          url: 'http://circle.didu86.com/tcshop/store.upload_goods_image',
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
  }

})