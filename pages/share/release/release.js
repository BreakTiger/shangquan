const request = require('../../../class/api/_request.js') //sendRequest api请求文件 
import modals from '../../../class/base/modal.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 0,
    array: [],
    arrindex: 0,
    date: '请选择时间',
    imgbox: '', //上传图片
    aid: ''
  },


  onLoad: function(options) {
    let that = this
    that.gettype()

  },

  // 标题长度
  input_title: function(e) {
    // 计算长度
    let length = e.detail.value.length
    this.setData({
      length: length
    })
  },


  // 获取活动类型
  gettype: function() {
    let that = this
    let data = {

    }
    let url = app.globalData.api + 'mall/selectactivitytype'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // console.log(res)
        let result = res.data.data
        // console.log(result)
        // 循环筛选出活动名
        let aa = []
        for (let i = 0; i < result.length; i++) {
          // console.log(result[i].activity_type)
          let activity = result[i].activity_type
          aa.push(activity)
          // console.log('类型:',aa)
          that.setData({
            array: aa
          })
        }
      })
  },


  //选择活动类型
  bindPickerChange: function(e) {
    console.log('arrindex 活动+', e.detail.value)
    this.setData({
      arrindex: e.detail.value
    })
  },

  // 截止时间
  bindDateChange: function(e) {
    console.log('截止时间', e.detail.value)
    this.setData({
      date: e.detail.value
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

  // 上传图片
  addPic1: function(e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var picid = e.currentTarget.dataset.pic;
    console.log(picid)
    var that = this;
    var n = 9;
    // 限制上次的图片数量
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }

    // 选择图片API
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


  // 发布
  formSubmit(e) {
    let that = this
    console.log(e)

    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid

    //店铺ID


    // 捕获输入，或选择的数据
    let val = e.detail.value
    console.log('获取所有的数据：', val)

    //活动类型
    let index = that.data.arrindex
    let typelist = that.data.array
    let types = typelist[index]
    console.log('类型：', types)

    let title = val.title //标题
    let content = val.content //内容

    // 活动时间
    let time = val.close_book_time
    console.log('截止时间:', time)

    // 判断
    if (title == '') {
      modals.showToast('标题不能为空', 'none')
    } else if (content == '') {
      modals.showToast('内容不能为空', 'none')
    } else if (time == '请选择时间') {
      modals.showToast('请设置截止日期', 'none')
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查你的发布内容是否有误，无误请点击确定',
        success: function(res) {
          if (res.confirm) {
            let data = {
              user_id: uid,
              store_id: 1,
              title: title,
              content: content,
              activity_type: types,
              close_book_time: time
            }
            console.log('请求数据:', data)
            let url = app.globalData.api + 'mall/releaseactivity'
            request.sendRequest(url, 'post', data, {
                "Content-Type": "application/x-www-form-urlencoded"
              })
              .then(function(res) {
                console.log(res)
                let code = res.data.code
                if (code == 0) {
                  app.agriknow.formId(formid, openid, uid).then(res => {
                    console.log('fromid收集', res)
                    app.globalData.shop = res.data.data //店铺信息存入缓存
                  }).catch(err => {
                    console.log(err)
                  })
                  let aid = res.data.data.id
                  console.log('活动ID:', aid)
                  that.setData({
                    aid: aid
                  })
                  that.getpicture(aid)
                  wx.showModal({
                    title: '提示',
                    content: '请等待管理员审核',
                    showCancel:false,
                    success:function(res){
                      if(res.confirm){
                        wx.switchTab({
                          url: '/pages/share/share',
                        })
                      }
                    }
                  })
                }
              })
          } else {
            console.log('发布失败')
          }
        }
      })



    }
  },


  // 发布图片
  getpicture: function(id) {
    let that = this
    // 上传的图片组
    let imglist = that.data.imgbox
    console.log(imglist)
    // 接口路径
    let url = app.globalData.api + 'mall/uploadactivityimage'
    // 循环出数组中的每一个元素
    for (let i = 0; i < imglist.length; i++) {
      console.log('需要上传的每一站图片', imglist[i])
      let item = imglist[i]
      wx.uploadFile({
        url: url,
        filePath: item,
        name: 'files',
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: "POST",
        formData: {
          activity_id: id
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








})