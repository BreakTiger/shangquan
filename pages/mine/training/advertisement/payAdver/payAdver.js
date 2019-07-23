var app = getApp();
const request = require('../../../../../class/api/_request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expandType: ["内涵段子", "抖音", "最右", "火山小视频", "爱奇艺", "腾讯视频"], //推广类型
    expandTypeID: 0,
    region: ['浙江省', '杭州市', '江干区'], //推广区域,微信自带
    putPlace: ["首页", "尾页"], //推广位置
    putPlaceId: 0,
    expandTime: ["1-30天", "31-60天", "61-90天"], //推广时间
    expandTimeId: 0,
    items: [{
        name: 1,
        value: '海报推广',
        checked: false
      },
      {
        name: 2,
        value: '小视频推广',
        checked: false
      },
      {
        name: 3,
        value: 'H5推广',
        checked: false
      },
      {
        name: 4,
        value: '公众号推广',
        checked: false
      },
      {
        name: 5,
        value: '其他广告媒体',
        checked: false
      },
    ],
    checks: [{
        name: "海报推广",
        value: '0',
        checked: false
      },
      {
        name: "小视频推广",
        value: '1',
        checked: false
      },
      {
        name: "H5推广",
        value: '2',
        checked: false
      },
      {
        name: "公众号推广",
        value: '3',
        checked: false
      },
      {
        name: "其他广告媒体",
        value: '4',
        checked: false
      },
    ],
    shop:[],
    text:''
  },
  clicks: function(e) {
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
    // console.log(e)
  },

  radioChange(e) {
    console.log('e', e)
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let index = e.currentTarget.dataset.index;
    // let arrs = this.data.checks;
    // if (arrs[index].checked == false) {
    //   arrs[index].checked = true;
    // } else {
    //   arrs[index].checked = false;
    // }
    // this.setData({
    //   checks: arrs
    // })
  },

  // 推广类型
  expandTypeChange: function(e) {
    console.log('推广类型', e.detail.value)
    this.setData({
      expandTypeID: e.detail.value //把当前的触摸的索引给expandTypeID
    })
  },


  // 地区选择
  expandAreaChange: function(e) {
    console.log('地区选择', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },


  // 投放位置
  putPlaceChange: function(e) {
    console.log('投放位置', e.detail.value)
    this.setData({
      putPlaceId: e.detail.value
    })
  },


  // 推广时间
  expandTimeChange: function(e) {
    console.log('推广时间', e.detail.value)
    this.setData({
      expandTimeId: e.detail.value
    })
  },


  //表单提交
  teformSubmit(e) {
    let that = this
    let val = e.detail.value
    console.log('form', val)
    let checkbox = val.checkbox.join(",");
    console.log('checkbox', checkbox)
    let uid = wx.getStorageSync('user').id
    let store_id = that.data.shop.id
    if (val.checkbox != '' && val.text != '' && val.expandArea != '' && val.expandTime != '' && val.wechat != '') {
      let data = {
        user_id: uid,
        store_id: store_id,
        title: '',
        position: checkbox,
        month: '',
        // money: money,
        province: val.province,
        city: val.city,
        county: val.county,
        content: val.text,
        weixin: val.wechat,
        type_c: 4
      }
      let url = 'https://circle.didu86.com/mall/addmystoreslider'
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log('添加轮播图推广', res)
          if (res.data.code == 0) {
            setTimeout(function() {
              // app.agriknow.formId(formid, openid, uid).then(res => {
              //   console.log('fromid收集', res)
              // }).catch(err => {
              //   console.log(err)
              // })
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
      })
    }
  },

  onLoad: function(options) {
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
    app.agriknow.getText(34).then(res => {
      console.log('说明', res)
      that.setData({ text: res.data.data.data })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {},

})