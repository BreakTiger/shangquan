var app = getApp();
// const request = require('../../../../class/api/_request.js')
Page({


  data: {
    region: ['浙江省', '杭州市', '江干区'],
    tab: ["请选择", "首页(上)", "首页(下)", "美食(上)", "美食(下)", "户外活动", "活动", "生活服务", "百货"],
    // 轮播图放置位置，轮播图放置位置,首页(上)=1,首页(下)=2,美食(上)=3,美食(下)=4,户外活动=5,活动=6,生活服务=7,百货=8
    shop: [],
    shopindex: 0,
    other_id: ''
  },
  //上线产品
  bindPickerChange: function(e) {
    console.log('上线产品', e.detail.value)
    this.setData({
      shopindex: e.detail.value
    })

  },
  onLoad: function(options) {
    let that = this
    console.log(options)
    let oid = options.oid
    that.setData({
      other_id: oid
    })
    //getOnline 查询本店铺上线产品
    let store_id = app.globalData.shop.id
    app.agriknow.getOnline(store_id).then(res => {
      console.log('查询本店铺上线产品', res)
        that.setData({
          shop: res.data.data
        })
    }).catch(err => {
      console.log(err)
    })

  },
  teformSubmit(e) {
    let val = e.detail.value
    let that = this
    console.log('val', val)
    let other_id = that.data.other_id
    let title = val.title
    let content = val.content
    let product_id = val.product_id
    if (val.title != '' && val.content != '' && val.product_id != '') {
      app.agriknow.addsliderproduct(other_id, title, content, product_id).then(res => {
        console.log('表单提交结果',res)
        if(res.data.code == 0){
          wx.showToast({
            title: '添加成功',
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '/pages/mine/training/training',
            })
          }, 1500)
        }else{
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

  },
  onShow: function() {
    console.log(app.globalData.shop)
  },



})