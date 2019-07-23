const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
const app = getApp();

Page({

  data: {
    starIndex: 0,
    imgbox: [],
    all: '',
    inputmessage: ''
  },


  onLoad: function(options) {
    let that = this
    let item = JSON.parse(options.data)
    console.log(item)
    let items = [];
    item.product.forEach(function(item) {
      item.star = 0;
      items.push(item);
    });
    that.setData({
      all: item
    })
  },



  // 商铺评星
  onChange1: function(e) {
    const index = e.detail.index;
    console.log(index)
    this.setData({
      starIndex: index
    })
  },

  // 商品评星
  onChange2: function(e) {
    let that = this
    // console.log('e', e)
    const star = e.detail.index;
    console.log(star)
    let id = e.currentTarget.dataset.id;
    let all = this.data.all;
    let items = [];
    all.product.forEach(function(item) {
      if (item.id == id) {
        item.star = star;
      }
      items.push(item);
    })
    all.product = items
    console.log('all', all)
    this.setData({
      all: all
    })
  },




  // 上传图片 &&&
  addPic1: function() {
    let that = this
    let imgbox = that.data.imgbox;
    console.log(imgbox)

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


  // 评价
  advice: function(e) {
    let that = this
    let data = e.detail.value
    console.log(data)
    that.setData({
      inputmessage: data
    })
  },







  // 提交评价
  //1.商家点评


  toformSubmit(e) {
    console.log('e', e)
    let that = this
    let val = e.detail.value
    let info = val.sunmmy
    wx.showModal({
      title: '提示',
      content: '是否提交评价',
      success(res) {
        if (res.confirm) {
          if (that.data.starIndex != 0 && val.sunmmy != '' && val.onChange2 != 0) {
            var formid = e.detail.formId
            let openid = wx.getStorageSync('user').weixin_openid
            //先评价商铺
            let uid = wx.getStorageSync('user').id //用户ID
            let item = that.data.all
            let sid = item.store_id //商铺ID
            let order = item.order_sn //订单编号
            let star = val.onChange1 //店铺评星
            // let info = that.data.inputmessage //店铺评论内容
            let pro = item.product
            for (let i = 0; i < pro.length; i++) {
              console.log(pro[i])
              let gid = pro[i].product_id // 商品ID
              let data = {
                user_id: uid,
                store_id: sid,
                order_code: order,
                score: star,
                comment: info
              }
              console.log('data', data)

              let url = app.globalData.api + 'tcshop/store.order_comment'

              request.sendRequest(url, 'post', data, {
                  "Content-Type": "application/x-www-form-urlencoded"
                })
                .then(function(res) {
                  console.log('form结果', res)
                  let code = res.data.code
                  if (code == 200) {
                    //formid 收集
                    app.agriknow.formId(formid, openid, uid).then(res => {
                      console.log('fromid收集', res)
                    }).catch(err => {
                      console.log(err)
                    })
                    that.goodstar(info, order) // 2.评价商品
                    if (that.data.imgbox.length != 0) {
                      that.upimg();
                      wx.redirectTo({
                        url: '/pages/mine/orderList/orderList',
                      })
                      wx.showToast({
                        title: '评价成功',
                      })
                    } else {
                      wx.redirectTo({
                        url: '/pages/mine/orderList/orderList',
                      })
                      wx.showToast({
                        title: '评价成功',
                      })
                    }
                  } else if (code == 1) {
                    modals.showToast('您已评价过该订单，不可重复评价', 'none')

                  }
                })
            }
          } else {
            wx.showToast({
              title: '请填充完整',
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })

  },


  goodstar: function(info, order) {
    let that = this
    // console.log(info, order)
    let id = wx.getStorageSync('user').id //用户ID
    let item = that.data.all.product
    console.log(that.data.all.product)
    for (let i = 0; i < item.length; i++) {
      let star = item[i].star //商品评星
      let gid = item[i].product_id //商品ID
      let sid = item[i].store_id //商铺ID

      let data = {
        goods_id: gid,
        user_id: id,
        order_code: order,
        score: star,
        comment: info
      }
      console.log(data)
      let url = app.globalData.api + 'tcshop/store.order_comment'
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log('星星', res)
          let code = res.data.code
          if (code == 200) {
          }
        })
    }
  },

  upimg: function() {
    let that = this
    let item = that.data.all
    console.log(item)
    let order = item.order_sn

    let imglist = that.data.imgbox
    for (let i = 0; i < imglist.length; i++) {
      // let item = imglist[i]
      wx.uploadFile({
        url: 'https://circle.didu86.com/tcshop/store.upload_order_comment_image',
        filePath: imglist[i],
        name: 'files',
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: 'post',
        formData: {
          order_code: order
        },
        success: function(res) {
          console.log('图片上传成功', res)
          // wx.redirectTo({
          //   url: '/pages/mine/orderList/orderList',
          // })
        },
        fail: function(res) {
          console.log('图片上传失败', res)
          // wx.redirectTo({
          //   url: '/pages/mine/orderList/orderList',
          // })
        }
      })
    }
  }

})