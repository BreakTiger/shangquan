const request = require('../../../../class/api/_request.js')
import modals from '../../../../class/base/modal.js'
const app = getApp();

Page({

  data: {
    allinfo: '',
    starIndex: 0,
    imgbox: '',
    all: '',
    stars: [],
    inputmessage: ''
  },


  onLoad: function(options) {
    let that = this
    let all = JSON.parse(options.data)
    console.log(all)
    that.setData({
      allinfo: all
    })
  },

  // 活动评分
  onChange1: function(e) {
    const index = e.detail.index;
    console.log(index)
    this.setData({
      starIndex: index
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



  //1.商家点评

  toformSubmit(e) {
    let that = this

    var formid = e.detail.formId
    // let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid


    // 获取评星+评论内容
    let val = e.detail.value
    let item = that.data.allinfo
    // console.log(item)
    let aid = item.id //活动ID
    let uid = wx.getStorageSync('user').id //用户ID
    let name = item.name //用户姓名
    let avatar = wx.getStorageSync('user').avatar //用户头像
    let star = val.onChange1 // 内容评星
    let info = val.sunmmy // 评论内容
    let sid = item.store_id //商户ID
    let code = item.order_sn



    let data = {
      activity_id: aid,
      user_id: uid,
      user_name: name,
      user_avatar: avatar,
      number: star,
      content: info,
      store_id: sid,
      order_code: code
    }

    console.log('请求数据：', data)

    let url = app.globalData.api + 'tcshop/store.activity_comment'
    if (star == 0) {
      modals.showToast('请为活动评星', 'none')
    } else if (info == '') {
      modals.showToast('请输入评论内容', 'none')
    } else {
      modals.loading()
      request.sendRequest(url, 'post', data, {
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          modals.loaded()
          console.log(res)
          let code = res.data.code
          let id = res.data.data
          if (code == 200) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
              app.globalData.shop = res.data.data //店铺信息存入缓存
            }).catch(err => {
              console.log(err)
            })
            let imagelist = that.data.imgbox
            if (imagelist.length == 0) {
              modals.showToast('发布完成', 'none')
              wx.redirectTo({
                url: '/pages/mine/reserve/reserve',
              })
            } else {
              that.upimage(id)
            }
          }
        })
    }
  },


  // 上传
  upimage: function(id) {
    let that = this
    let imagelist = that.data.imgbox
    console.log('上传的图片内容', imagelist)

    for (let i = 0; i < imagelist.length; i++) {
      let item = imagelist[i]
      console.log(item)
      wx.uploadFile({
        url: 'https://circle.didu86.com/tcshop/store.activity_comment_img',
        filePath: item,
        name: 'files',
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: 'post',
        formData: {
          activity_id: id
        },
        success: function(res) {
          console.log('图片上传成功', res)
          wx.redirectTo({
            url: '/pages/mine/reserve/reserve',
          })
        },
        fail: function(res) {
          console.log('图片上传失败')
        }
      })
    }
  },
})