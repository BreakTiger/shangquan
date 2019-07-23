const request = require('../../../../class/api/_request.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specifications: false,
    arr: [],
    vipIndex: 0,
    vip: ["不享受会员专享折扣", "享受会员专享折扣"],
    method: ["线上", "线下"],
    mindex: 0,
    length: 0,
    // imagebox: app.globalData.imagebox,
    imagebox: '',
    shop: [],
    sc_id: '',
    goodlist: [],
    goodIndex: 0,
    imgbox1: '',
    img: '/img/img/add_pic@2x.png',
    detailbox: [],
    // points: ["不参与", "5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", "45%", "50%"],
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
    distribution: ["否", "是"],
    disindex: 0,
    free: ["否", "是"],
    freeindex: 0,
    door: ["否", "是"],
    doorindex: 0,
    index: 0,
    gid: ''
  },
  // 上门服务
  door: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      doorindex: e.detail.value
    })
  },
  price_all(e) {
    var num = e.detail.value;
    var x = String(num).indexOf('.') + 1; //小数点的位置
    var y = String(num).length - x; //小数的位数
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
  length(e) {
    let length = e.detail.value.length
    // console.log(length)
    this.setData({
      length: length
    })
  },
  // 删除照片 &&
  Delete2: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    console.log('删除', index)
    let arr = this.data.imagebox;
    arr.splice(index, 1)
    that.setData({
      imagebox: arr
    });
  },
  // 上传图片 &&&
  addPic2: function(e) {
    var imgbox = this.data.imagebox;
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
          imagebox: imgbox
        });
        // console.log('imgbox', that.da)
      }
    })
  },


  //商品详情图
  addPic3: function(e) {
    var imgbox = this.data.detailbox;
    // var picid = e.currentTarget.dataset.pic;
    // console.log(picid)
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
        console.log('detailbox', that.data.detailbox)
      }
    })
  },
  uploadImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var successUp = 0; //成功
        var failUp = 0; //失败
        var length = res.tempFilePaths.length; //总数
        var count = 0; //第几张
        that.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length);
      },
    });
  },
  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    var that = this;
    wx.showLoading({
      title: '正在上传第' + count + '张',
    })
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count],
      name: count, //示例，使用顺序给文件命名
      success: function(e) {
        successUp++; //成功+1
      },
      fail: function(e) {
        failUp++; //失败+1
      },
      complete: function(e) {
        count++; //下一张
        if (count == length) {
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: '上传成功' + successUp,
            icon: 'success',
            duration: 2000
          })
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          console.log('正在上传第' + count + '张');
        }
      }
    })
  },
  // 删除商品详情图
  Delete3: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    console.log('删除', index)
    let arr = this.data.detailbox;
    arr.splice(index, 1)
    that.setData({
      detailbox: arr
    });
    console.log('detailbox', that.data.detailbox)
  },



  // 商品分类
  goodlist: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      goodIndex: e.detail.value
    })
  },

  // 免配送费
  distribution: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      disindex: e.detail.value
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
  //销售方式
  method: function(e) {
    console.log('销售方式', e.detail.value)
    this.setData({
      mindex: e.detail.value
    })
  },


  //free 包邮
  free: function(e) {
    console.log('包邮', e.detail.value)
    this.setData({
      freeindex: e.detail.value
    })
  },

  //积分抵扣
  points_: function(e) {
    console.log('积分抵扣', e.detail.value)
    this.setData({
      pindex: e.detail.value
    })
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
  addTo() {
    this.setData({
      specifications: true
    })
  },
  quxiao() {
    let that = this
    that.setData({
      specifications: false
    })
  },
  // 商品图
  addImg() {
    wx.navigateTo({
      url: '/pages/mine/training/addShop/addImg/addImg',
    })
  },
  //上传图片
  addimage() {
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
          imgbox1: imgbox1
        })
        console.log('that.data.imgbox1', that.data.imgbox1)
      }
    })
  },
  //添加规格
  toSubmit(e) {
    console.log('e', e)
    let that = this
    let val = e.detail.value
    console.log('val', val, 'val.leng', e.detail.value.length)
    let list = val.list
    let price = val.price
    console.log('list', list, 'price', price)
    console.log('arr', that.data.arr)
    console.log('that.data.arr.length > 3', that.data.arr, 'length', that.data.arr.length)
    var length = that.data.arr.length
    if (length <= 2) {
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
      wx.showModal({
        title: '提示',
        content: '套餐上线三个哦~',
        showCancel: false
      })
    }

  },
  addSubmit(e) {
    let that = this
    let val = e.detail.value
    let url = 'https://circle.didu86.com/tcshop/store.goods_apply'
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    console.log('imgagebox', that.data.imagebox)
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('val', val)
    let sc_id = that.data.sc_id //判断是否有分类
    console.log('sc_id', sc_id)
    let product_category = val.product_category //商品分类
    let goods_name = val.goods_name //商品名
    let market_price = val.market_price //市场价
    let price_arr = that.data.arr
    let price = price_arr[0].price //现价
    console.log('price', price)
    let store_id = that.data.shop.id //店铺id
    let sales_method = 0 //销售方式  0线上  1线下
    let stock = val.stock //库存
    let is_member = val.is_member //是否享受会员折扣，0不享受，1享受
    let is_points = null //积分折扣
    if (val.is_points == "不参与") {
      is_points = 0
    } else {
      is_points = val.is_points
    }
    console.log('is_points', is_points)
    let freight = val.distribution //包邮或者免配送费或者上门服务
    let product_body = val.product_body //商品简介
    let product_spec = that.data.arr //规格价格
    let data = null
    if (val.goods_name != '' && val.market_price != '' && val.price != '' && val.product_body != '' && val.stock != '' && val.is_member != '' && val.sales_method != '' && val.is_points != '' && that.data.arr != '' && val.product_category != '' && that.data.detailbox.length != 0) {
      if (sc_id == 1 || sc_id == 3) { //我没有分类 1美食 3 生活服务
        if (that.data.imgbox1.length != 0) {
          app.agriknow.addShop(goods_name, market_price, price, store_id, sales_method, stock, is_member, is_points, product_body, product_spec, '', freight).then(res => {
            console.log(' 商品添加', res)
            if (res.data.code == 200) {
              let gid = res.data.data
              //formid 收集
              app.agriknow.formId(formid, openid, uid).then(res => {
                console.log('fromid收集', res)
              }).catch(err => {
                console.log(err)
              })
              that._upload(gid); //上传单个图片
              that.uploadDetail(gid) //上传详情图
              setTimeout(function() {
                wx.showToast({
                  title: '添加成功',
                })
              }, 1500)
              wx.redirectTo({
                url: '/pages/mine/training/Commodity/Commodity'
              })
            } else if (res.data.code == 701003) {
              wx.showToast({
                title: '橱窗不足',
              })
            } else {
              wx.showToast({
                title: '添加失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.showToast({
            title: '请上传图片',
          })
        }
      } else if (sc_id == 2) { //2 景点活动
        if (that.data.imgbox1.length != 0) {
          app.agriknow.addShop(goods_name, market_price, price, store_id, sales_method, stock, is_member, is_points, product_body, product_spec, product_category, 0).then(res => {
            console.log(' 商品添加', res)
            if (res.data.code == 200) {
              //formid 收集
              app.agriknow.formId(formid, openid, uid).then(res => {
                console.log('fromid收集', res)
              }).catch(err => {
                console.log(err)
              })
              let gid = res.data.data
              that.setData({
                gid: gid
              })
              if (sc_id == 2) {
                that._upload(gid);
                that.upload_file() //上传详情图
              } else {
                that.upload(gid);
                that.upload_file() //上传详情图
              }
              setTimeout(function() {
                wx.showToast({
                  title: '添加成功',
                })
              }, 1500)
              wx.redirectTo({
                url: '/pages/mine/training/Commodity/Commodity'
              })
            } else if (res.data.code == 701003) {
              wx.showToast({
                title: '橱窗不足',
              })
            } else {
              wx.showToast({
                title: '添加失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.showToast({
            title: '请上传图片',
          })
        }
      } else if (sc_id == 4) { //百货
        if (that.data.imagebox.length != 0) {
          app.agriknow.addShop(goods_name, market_price, price, store_id, sales_method, stock, is_member, is_points, product_body, product_spec, product_category, freight).then(res => {
            console.log(' 商品添加', res)
            if (res.data.code == 200) {
              let gid = res.data.data
              that.setData({
                gid: gid
              })
              //formid 收集
              app.agriknow.formId(formid, openid, uid).then(res => {
                console.log('fromid收集', res)
              }).catch(err => {
                console.log(err)
              })
              if (sc_id == 2) {
                that._upload(gid);
                that.upload_file() //上传详情图
              } else {
                that.upload(gid);
                that.upload_file() //上传详情图
              }
              setTimeout(function() {
                wx.showToast({
                  title: '添加成功',
                })
              }, 1500)
              wx.redirectTo({
                url: '/pages/mine/training/Commodity/Commodity'
              })
            } else if (res.data.code == 701003) {
              wx.showToast({
                title: '橱窗不足',
              })
            } else {
              wx.showToast({
                title: '添加失败',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.showToast({
            title: '请上传图片',
          })
        }
      }
    } else {
      wx.showToast({
        title: '请填充完整',
        icon: 'success',
        duration: 1500
      })
    }
  },
  //上传单个图片
  _upload(gid) {
    let that = this
    let imgbox1 = that.data.imgbox1
    let store_id = that.data.shop.id //店铺id
    console.log('我要上传的每个图片', imgbox1)
    if (imgbox1.length != 0) {
      wx.uploadFile({
        url: 'https://circle.didu86.com/tcshop/store.upload_goods_image',
        filePath: imgbox1,
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
    } else {
      wx.showToast({
        title: '请上传图片',
      })
    }
  },
  //上传轮播图片
  upload(gid) {
    let that = this
    let store_id = that.data.shop.id //店铺id
    if (that.data.imagebox.length != 0) {
      let imagebox = that.data.imagebox
      for (let i = 0; i < imagebox.length; i++) {
        console.log('上传轮播图片', imagebox[i])
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.upload_goods_image',
          filePath: that.data.imagebox[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            goods_id: gid,
            store_id: store_id
          },
          success: function(res) {
            console.log('轮播图片上传成功', res)
            app.globalData.imagebox = []
          },
          fail: function() {
            console.log('轮播图片上传失败')
          }
        })
      }
    } else {
      wx.showToast({
        title: '请上传图片',
      })
    }
  },

  //上传图片详情
  uploadDetail(gid) {
    let that = this
    if (that.data.detailbox.length != 0) {
      let imagebox = that.data.detailbox
      for (let i = 0; i < imagebox.length; i++) {
        console.log('上传图片详情', imagebox[i])
        console.log('[i]', i)
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.product_detail_image',
          filePath: imagebox[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            goods_id: gid,
            type: 1
          },
          success: function(res) {
            console.log('图片详情上传成功', res)
          },
          fail: function() {
            console.log('图片详情上传失败')
          }
        })
      }
    } else {
      wx.showToast({
        title: '请上传图片',
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
      url: 'https://circle.didu86.com/tcshop/store.product_detail_image',
      filePath: imagebox[index],
      name: 'files',
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      formData: {
        goods_id: gid,
        type: 1
      },
      success: function(res) {
        console.log('success', res)
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





  onShow: function(options) {
    // console.log('shop',app.globalData.shop)
    let that = this
    console.log('points', that.data.points)
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
    //商品分类列表
    app.agriknow.getGood(uid).then(res => {
      console.log('商品分类列表', res)
      that.setData({
        goodlist: res.data.data
      })
    }).catch(err => {
      console.log(err)
    })
  }
})