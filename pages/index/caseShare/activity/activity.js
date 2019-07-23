const request = require('../../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../../class/base/modal.js'
const app = getApp();
var QQMapWX = require('../../../../qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '4LZBZ-62FAQ-G4Z5N-GQLXO-4U5D3-SRF7T'
});


Page({


  data: {
    aid: '',
    detail: '',
    list: [],
    select: 0,
    winds: false,
    detailDatas: {
      num: 1
    },
    minusStatuses: true,
    times: '',
    current: 0,
    arrHeight: [],
    imgheights: [],
    is_invoice: '',
    show: true
  },
  previewImage: function(e) {
    var that = this
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      current: "scene_img",
      urls: img.split(',')
      // urls必须是数组 不然会报错  
    })

  },

  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },

  imageLoad: function(e) { //获取图片真实宽度  
    console.log('e', e)
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      src = [], //宽高比    
      ratio = imgwidth / imgheight;
    src.push(e.target.dataset['src'])
    console.log(src)
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    let arrHeight = []
    let index = e.currentTarget.dataset.index
    console.log('index', index)
    imgheights[index] = imgheight;
    this.setData({
      imgheights: imgheights,
      arrHeight: arrHeight
    })
  },
  onLoad: function(options) {
    let that = this
    console.log('options', options)
    let aid = options.id
    that.setData({
      aid: aid,
      is_invoice: options.is_invoice
    })
    // that.outsidedetail()
  },
  onShow: function() {
    this.outsidedetail()
  },

  // 活动详情
  outsidedetail: function() {
    let that = this
    let aid = that.data.aid
    let data = {
      activity_id: aid
    }
    let url = app.globalData.api + 'tcshop/store.activity_detail'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log('活动详情', res)
        let result = res.data.data
        console.log('活动详情：', result)
        let time = result.activity_time
        let times = time.substring(0, 10)
        let sc_id = result.store_id



        let uid = wx.getStorageSync('user').id
        // 查询点店铺详情
        app.agriknow.shopDeatil(uid).then(res => {
          console.log('店铺详情', res)
          let scid = res.data.data.id
          if (scid == sc_id) {
            that.setData({
              show: false
            })
          }
          app.globalData.shop = res.data.data //店铺信息存入全局
        }).catch(err => {
          console.log(err)
        })





        console.log(times)
        that.setData({
          detail: result,
          times: times
        })


        that.comment(aid)
      })
  },

  // 规格
  comment: function(aid) {
    let that = this
    let data = {
      activity_id: aid,
      page: 1
    }
    let url = app.globalData.api + 'tcshop/store.comment_list'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let result = res.data.data
        console.log('评论列表：', result)
        that.setData({
          list: result
        })
      })
  },

  //店铺详情
  mall: function(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })
  },

  // 集合地导航
  local: function() {
    let that = this
    let item = that.data.detail
    // console.log(item)
    let address = item.destination
    console.log(address)
    qqmapsdk.geocoder({
      address: address,
      success: function(res) {
        console.log(res);
        let data = res.result.location
        console.log(data)
        let lon = data.lat
        let lat = data.lng
        wx.navigateTo({
          url: '/pages/index/fastConsult/shop/stroelocation/stroelocation?lat=' + lat + '&&lon=' + lon,
        })
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  // 联系电话
  phone: function() {
    let that = this
    let item = that.data.detail
    let phone = item.mobile
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  // 关闭弹窗
  close: function() {
    this.setData({
      winds: false
    })
  },

  // 选择规格
  choice: function(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      select: index
    })
  },


  // 立即预定
  reserve: function() {
    let that = this
    that.setData({
      winds: true
    })
  },

  // 数量控制
  // 加
  bindPlus: function(e) {
    var num = this.data.detailDatas.num;
    // 自增
    num++;
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
      minusStatuses: false,
    });
    console.log(this.data.detailDatas)
  },

  // 减号
  bindMinus: function(e) {
    let num = this.data.detailDatas.num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    } else {
      this.setData({
        minusStatuses: true,
      })
      modals.showToast('不能再减少了', 'none')
    }
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
    });
    console.log(this.data.detailDatas)
  },

  // 下一步
  nextTap: function() {
    let that = this
    let select = that.data.select
    let detail = that.data.detail
    console.log('活动的数据', detail)
    let sku = detail.specifications[select]
    console.log('获取规格数据：', sku)
    let num = that.data.detailDatas.num
    console.log('数量', num)
    that.setData({
      winds: false
    })
    let all = JSON.stringify(detail)
    let skuinfo = JSON.stringify(sku)
    wx.navigateTo({
      url: '/pages/index/caseShare/activity/add/add?all=' + all + '&skuinfo=' + skuinfo + '&num=' + num,
    })
  },

})