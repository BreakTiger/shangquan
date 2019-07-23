const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: '',
    goods: [],
    imgbox: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let data = JSON.parse(options.data)
    let good = data.product
    console.log(data)
    that.setData({
      all: data,
      goods: good
    })
    that.storedata()
  },

  storedata: function() {
    let that = this
    let all = that.data.all
    let sid = all.store_id
    let data = {
      store_id: sid
    }
    let url = app.globalData.api + 'mall/findselectstoreproduct'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        let code = res.data.code
        if (code == 0) {
          let phone = res.data.data.store.store_phone
          that.setData({
            phone: phone
          })
        }
      })
  },

  phonecall: function() {
    let that = this
    let phone = that.data.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  ToSubmit: function(e) {
    let that = this
    let val = e.detail.value.text
    let item = that.data.all
    let id = item.id
    let data = {
      order_id: id,
      tuihuo_yuanyin: val
    }

    console.log(data)
    let url = app.globalData.api + 'mall/myordertuikuan'
    modals.loading()

    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('申请成功，请等待商家审核', 'none')
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/mine/orderList/orderList',
            })
          }, 1500)
        } else {
          modals.showToast('申请失败，请稍后重试', 'none')
          wx.redirectTo({
            url: '/pages/mine/orderList/orderList',
          })
        }

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
          imgbox[picid] = tempFilePaths[0];
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },




})