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
    imagebox: app.globalData.imagebox,
    shop: '',
    sc_id: '',
    goodlist: [],
    goodIndex: 0,
    imgbox1: '',
    img: '/img/img/add_pic@2x.png',
    shopData: [],
    is_points: 0, //积分抵扣
    detailimg: '',
    points: [{
        num: 0,
        text: "不参与",
      }, {
        num: 1,
        text: "5",
      },
      {
        num: 2,
        text: "10",
      },
      {
        num: 3,
        text: "15",
      },
      {
        num: 4,
        text: "20",
      },
      {
        num: 5,
        text: "25",
      },
      {
        num: 6,
        text: "30",
      },
      {
        num: 7,
        text: "35",
      },
      {
        num: 8,
        text: "45",
      },
      {
        num: 9,
        text: "50",
      }, {
        num: 10,
        text: "55",
      },
      {
        num: 11,
        text: "60",
      },
      {
        num: 12,
        text: "65",
      },
      {
        num: 13,
        text: "70",
      },
      {
        num: 14,
        text: "75",
      },
      {
        num: 15,
        text: "80",
      },
      {
        num: 16,
        text: "85",
      },
      {
        num: 17,
        text: "90",
      },
      {
        num: 18,
        text: "95",
      },
      {
        num: 19,
        text: "100",
      }
    ],
    pindex: 0,
    _points: '',
    distribution: ["否", "是"],
    disindex: 0,
    free: ["否", "是"],
    freeindex: 0,
    door: ["否", "是"],
    doorindex: 0,
  },
  // 上门服务
  door: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      doorindex: e.detail.value
    })
  },

  // 免配送费
  distribution: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      disindex: e.detail.value
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


  length(e) {
    let length = e.detail.value.length
    // console.log(length)
    this.setData({
      length: length
    })
  },
  // 商品分类
  goodlist: function(e) {
    console.log('商品分类', e.detail.value)
    this.setData({
      goodIndex: e.detail.value
    })
  },
  // 删除照片 &&
  Delete: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('删除', index)
    let arr = this.data.arr;
    arr.splice(index, 1)
    that.setData({
      arr: arr
    });
  },
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


  // 上传图片 &&&
  addPic2: function(e) {
    var imgbox = this.data.detailimg;
    // console.log(imgbox)
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
          detailimg: imgbox
        });
      }
    })
  },
  //图片删除
  imgDelete2: function(e) {
    console.log('e', e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('删除', index)
    let imgbox1 = this.data.detailimg;
    imgbox1.splice(index, 1)
    that.setData({
      detailimg: imgbox1
    });
    // let gid = that.data.shopData.id
    // let sid = that.data.shop.id //店铺id
  },
  //销售方式
  method: function(e) {
    console.log('销售方式', e.detail.value)
    this.setData({
      mindex: e.detail.value
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
    var length = that.data.arr.length
    if(length <= 2){
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
    }else{
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
    console.log('val', val)
    let sc_id = that.data.sc_id //判断是否有分类
    console.log('sc_id', sc_id)
    console.log('form------arr', that.data.arr)
    let gid = that.data.shopData.id
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    let product_category = val.product_category //商品分类
    let goods_name = val.goods_name //商品名
    let market_price = val.market_price //市场价
    let price = that.data.arr[0].price //现价
    let store_id = that.data.shop.id //店铺id
    let sales_method = 0 //销售方式  0线上  1线下
    let stock = val.stock //库存
    let is_member = val.is_member //是否享受会员折扣，0不享受，1享受
    let is_points = null //积分折扣
    if (that.data._points == true) {
      if (val.is_points == "不参与") {
        is_points = 0
      } else {
        is_points = val.is_points
      }
    } else {
      is_points = 0
    }
    console.log('is_points', is_points)
    let freight = val.distribution //包邮或者免配送费或者上门服务
    let product_body = val.product_body //商品简介
    let product_spec = that.data.arr //规格价格
    console.log('arr', that.data.arr)
    if (val.goods_name != '' && val.market_price != '' && val.price != '' && val.product_body != '' && val.stock != '' && val.is_member != '' && val.sales_method != '' && val.is_points != '' && that.data.arr != '' && val.product_category != '' && that.data.detailimg.length != 0 && that.data.arr.length != 0) {
      if (sc_id == 1 || sc_id == 3) { //我没有分类
        //product_category 没有分类传 空
        app.agriknow.changeShop(goods_name, market_price, price, store_id, sales_method, stock, is_member, is_points, product_body, gid, product_spec, '', freight).then(res => {
          console.log(' 商品添加', res)
          if (res.data.code == 200) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            that._upload(gid); //上传单个图片
            setTimeout(function() {
              wx.showToast({
                title: '修改成功',
              })
            }, 1500)
            wx.redirectTo({
              url: '/pages/mine/training/Commodity/Commodity'
            })
          } else {
            wx.showToast({
              title: '失败',
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (sc_id == 2 || sc_id == 4) {
        if (sc_id == 2) {
          freight = 0
        } else {
          freight = val.distribution
        }
        //商品添加
        app.agriknow.changeShop(goods_name, market_price, price, store_id, sales_method, stock, is_member, is_points, product_body, gid, product_spec, product_category, freight).then(res => {
          console.log(' 商品添加', res)
          if (res.data.code == 200) {
            //formid 收集
            app.agriknow.formId(formid, openid, uid).then(res => {
              console.log('fromid收集', res)
            }).catch(err => {
              console.log(err)
            })
            if (sc_id == 2) {
              that._upload(gid);
              that.uploaddetail(gid, 0)
              that.uploaddetail(gid, 1)
              setTimeout(function() {
                wx.showToast({
                  title: '修改成功',
                })
              }, 1500)
              wx.redirectTo({
                url: '/pages/mine/training/Commodity/Commodity'
              })
            } else {
              that.upload(gid);

              that.uploaddetail(gid)
              // that.uploaddetail(gid, 1)
              console.log('上传轮播图')
              setTimeout(function() {
                wx.showToast({
                  title: '修改成功',
                })
              }, 1500)
              wx.redirectTo({
                url: '/pages/mine/training/Commodity/Commodity'
              })
            }

          } else {
            wx.showToast({
              title: '失败',
            })
          }
        }).catch(err => {
          console.log(err)
        })
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
    let store_id = that.data.shop.id
    console.log('我要上传的每个图片', imgbox1)
    if (imgbox1 != '') {
      wx.uploadFile({
        url: 'https://circle.didu86.com/tcshop/store.upload_goods_image',
        filePath: imgbox1,
        name: 'files',
        header: {
          "Content-Type": "multipart/form-data"
        },
        method: "POST",
        formData: {
          goods_id: gid,
          type: 1,
          store_id: store_id
        },
        success: function(res) {
          console.log('图片上传成功', res)
        },
        fail: function() {
          console.log('图片上传失败')
        }
      })
    }
  },
  //上传轮播图片
  upload(gid) {
    let that = this
    let sid = that.data.shop.id
    // let gid = that.data.shopData.id
    app.agriknow.del(sid, gid).then(res => {
      console.log('删除图片', res)
    }).catch(err => {
      console.log(err)
    })
    let imgbox1 = that.data.imgbox1
    if (imgbox1 != '') {
      console.log('length', imgbox1.length)
      let num = 0
      for (let i = 0; i < imgbox1.length; i++) {
        num++;
        console.log('我要上传的每个图片', imgbox1[i])
        console.log('num', num)
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.upload_goods_image',
          filePath: imgbox1[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            goods_id: gid,
            type: num,
            store_id: sid
          },
          success: function(res) {
            console.log('图片上传成功', res)
          },
          fail: function() {
            console.log('图片上传失败')
          }
        })
      }
    }
  },
  //上传详情图片
  uploaddetail(gid) {
    let that = this
    console.log('gid', gid)
    let imgbox1 = that.data.detailimg
    if (imgbox1 != '') {
      console.log('length', imgbox1.length)
      let num = 0
      for (let i = 0; i < imgbox1.length; i++) {
        num = i
        console.log('详情图片', imgbox1[i])
        console.log('num', num)
        wx.uploadFile({
          url: 'https://circle.didu86.com/tcshop/store.product_detail_image',
          filePath: imgbox1[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          method: "POST",
          formData: {
            goods_id: gid,
            type: num,
          },
          success: function(res) {
            console.log('图片上传成功', res)
          },
          fail: function() {
            console.log('图片上传失败')
          }
        })
      }
    }
  },
  onLoad: function(options) {
    let that = this
    //获取上个页面带来的商品数据
    let shopData = JSON.parse(options.shop)
    console.log('shopData', shopData)
    let is_member = parseInt(shopData.is_member)
    console.log('积分抵扣抵扣', is_member)
    let freight = shopData.freight || 0
    if (is_member == 1) { //积分抵扣大于0 不享受积分抵扣
      that.setData({
        vipIndex: 1,
        _points: false
      })
    } else {
      let num;
      let points = parseInt(shopData.is_points)
      console.log('points', points)
      let pointsArr = that.data.points
      for (let i in pointsArr) {
        if (pointsArr[i].text == points) {
          console.log('i', i, 'num', pointsArr[i].num)
          num = pointsArr[i].num
          that.setData({
            pindex: num
          })
        }
      }
      that.setData({
        vipIndex: 0,
        _points: true
      })
    }
    let sku = shopData.store_product_sku
    let arr = []
    for (let i in sku) {
      arr.push({
        "list": sku[i].product_name,
        "price": sku[i].price,
      });
    }
    that.setData({
      arr: arr
    })
    if (shopData.product_image[0] == 1) {
      that.setData({
        imgbox1: shopData.product_image[0],
      })
    } else {
      that.setData({
        imgbox1: shopData.product_image
      })
    }
    // console.log('arr', arr)
    that.setData({
      minindex: 0, //线上0 线下1
      is_points: shopData.is_points, //积分抵扣
      shopData: shopData,
      arr: arr,
      detailimg: shopData.detail_img,
      freeindex: freight, //是否包邮
      disindex: freight,//是否免配送费
      doorindex:freight //是否 上门服务
    })

    console.log('shopData', shopData)
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
      var goodlist = res.data.data
      let gIndex = shopData.gc_id
      console.log('gIndex', gIndex)
      let index = goodlist.findIndex((e) => {
        return e.id == gIndex
      })
      console.log('index', index)
      that.setData({
        goodlist: goodlist,
        goodIndex: index
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    let that = this
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
  }
})