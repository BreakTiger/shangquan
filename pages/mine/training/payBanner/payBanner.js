var app = getApp();
const request = require('../../../../class/api/_request.js')
Page({


  data: {
    region: ['浙江省', '杭州市', '江干区'],

    tab: ["请选择", "首页(上)", "首页(下)", "美食广场(上)", "美食广场(下1)", "活动景点(上)", "同城互动", "生活服务", "最惠好货", "美食广场(下2)", "生活服务(下1)", "生活服务(下2)", "最惠好货(下)", "活动景点(下1)", "活动景点(下2)"],
    // 轮播图放置位置，轮播图放置位置,首页(上)=1,首页(下)=2,美食(上)=3,美食(下)=4,户外活动=5,活动=6,生活服务=7,百货=8
    tabIndex: 0,
    time: ["请选择", "1周", "2周", "3周", "4周", "5周", "6周", "7周", "8周"],
    timeIndex: 0,
    imgbox: '',
    imagebox: [],
    money: 0,
    img: '/img/img/add_pic@2x.png',
    imgbox: '',
    shop: [],
    text:''
  },

  add_() {
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
          imgbox: imgbox1
        })
        console.log('that.data.imgbox1', that.data.imgbox1)
      }
    })
  },
  //地区选择
  bindRegionChange: function(e) {
    console.log('地区选择', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //投放位置
  bindPickerChange: function(e) {
    console.log('投放位置', e.detail.value)
    this.setData({
      tabIndex: e.detail.value
    })

  },
  time: function(e) {
    let that = this
    console.log('投放位置', e.detail.value)
    let timeIndex = e.detail.value
    this.setData({
      timeIndex: timeIndex
    })
    that.price(timeIndex);
  },
  //计算价格
  price(month) {
    //价格 //1=轮播推广，2=产品推广，3=店铺推广 月数
    let that = this
    let index = that.data.timeIndex
    app.agriknow.money(1, month, index).then(res => {
      // console.log('计算价格', res)
      that.setData({
        money: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  add() {
    wx.navigateTo({
      url: '/pages/mine/training/payBanner/add/add',
    })
  },
  onLoad: function(options) {
    let that = this
    app.agriknow.getText(34).then(res => {
      console.log('说明', res)
      that.setData({ text:res.data.data.data})
    }).catch(err => {
      console.log(err)
    })
  },
  teformSubmit(e) {
    let val = e.detail.value
    let that = this
    console.log('val', val)
    let uid = wx.getStorageSync('user').id
    let store_id = that.data.shop.id
    var formid = e.detail.formId
    let openid = wx.getStorageSync('user').weixin_openid
    let title = val.title
    let position = val.position
    let month = val.month
    // let money = val.money
    let province = val.province
    let city = val.city
    let county = val.county
    let content = val.content
    let weixin = val.weixin
    if (that.data.imgbox != '' && val.title != '' && that.data.timeIndex != 0 && val.position != '' && val.month != '' && val.money != '' && that.data.tabIndex != 0 && val.content != '' && val.weixin != '' && that.data.imgbox.length != 0) {
      let data = {
        user_id: uid,
        store_id: store_id,
        title: val.title,
        position: position,
        month: month,
        // money: money,
        province: province,
        city: city,
        county: county,
        content: content,
        weixin: weixin,
        type_c: 1
      }
      let url = 'https://circle.didu86.com/mall/addmystoreslider'
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log('添加轮播图推广', res)
          if (res.data.code == 0) {
            let sid = res.data.data.id
            that.upload(sid);
            setTimeout(function() {
              // wx.showToast({
              //   title: '添加成功',
              // })
              //formid 收集
              app.agriknow.formId(formid, openid, uid).then(res => {
                console.log('fromid收集', res)
              }).catch(err => {
                console.log(err)
              })
              wx.showModal({
                title: '提示',
                content: '等待管理员联系',
                showCancel: false
              })
            }, 1500)
            wx.redirectTo({
              url: '/pages/mine/training/training'
            })

          } else {
            wx.showToast({
              title: '大喇叭不足',
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
  upload(sid) {
    let that = this
    let imgbox = that.data.imgbox
    console.log('我要上传的每个图片', imgbox)
    wx.uploadFile({
      url: 'https://circle.didu86.com/mall/addmystoresliderimage',
      filePath: imgbox,
      name: 'files',
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      formData: {
        slider_id: sid
      },
      success: function(res) {
        console.log('图片上传成功', res)
      },
      fail: function() {
        console.log('图片上传失败')
      }
    })

  },
  onShow: function() {
    let that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.shopDeatil(uid).then(res => {
      console.log('查询点店铺详情', res)
      that.setData({
        shop: res.data.data
      })
      app.globalData.shop = res.data.data //店铺信息存入全局
    }).catch(err => {
      console.log(err)
    })
  },



})