const app = getApp();
import modals from '../../../class/base/modal.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    selected: true,
    selected1: false,
    shopId: '',
    shop: [],
    shopTure: false, //底部加入购物车按钮
    nextTure: false, //底部立即购买按钮
    bgTure: false, //底部购物车
    num: 1,
    arrindex: 0,
    list: [],
    price: '', //规格的价格
    sku_id: '',
    buyNow: [{
      url: '',
      dianpu: '',
      id: '',
      pro: [{
        pid: '',
        title: '',
        price: '',
        num: '',
        url: '',
        selected: true
      }]
    }],
    mallShop: [],
    guige: [],
    guigeindex: 0,
    sku: [{
      id: '',
      product_sn: '',
      activity_id: '',
      product_name: '',
      product_slogan: ''
    }],
    all: [],
    imgheights: [],
    arrHeight: [],
    current: 0,
    sc_id: '',
    shopId: '',
    show: true,
    score: ''
  },

  bindchange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //轮播图 转发 放大
  previewImage_(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: "scene_img",
      urls: url.split(',')
    })
  },
  imageLoad: function(e) {
    console.log('e', e)
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      src = [],
      ratio = imgwidth / imgheight;
    // console.log(e.target.dataset['src'])
    src.push(e.target.dataset['src'])
    console.log(src)
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    // console.log('imgheight', imgheight)
    var imgheights = this.data.imgheights
    let arrHeight = []
    imgheights[e.target.dataset['index']] = imgheight;
    // console.log('imgheights', imgheights)
    this.setData({
      imgheights: imgheights,
      arrHeight: arrHeight
    })
  },
  //拨打位置
  callphone() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '拨打商家电话？',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.mall.store_phone //需要拨打的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //立即购买
  toBuy() {
    var that = this
    that.setData({
      bgTure: true,
      nextTure: true,
      shopTure: false,
    })

  },
  //加入购物车
  toshopCar() {
    var that = this
    that.setData({
      bgTure: true,
      shopTure: true,
      nextTure: false
    })
  },
  //关闭
  close() {
    var that = this
    that.setData({
      bgTure: false
    })
  },
  //加减法操作
  subtraction(e) {
    // var that = this
    // let num = that.data.num
    // if (num < 2) {
    //   that.setData({
    //     showNum: false
    //   })
    // } else {
    //   num--
    //   that.setData({
    //     num: num
    //   })
    // }
    // console.log(that.data.num)
    var that = this
    let num = that.data.num
    let list = e.currentTarget.dataset.list
    let index = that.data.guigeindex
    if (num < 2) {
      that.setData({
        showNum: false
      })
    } else {
      num--
      that.setData({
        num: num
      })
    }
    console.log(that.data.num)
  },
  add(e) {
    var that = this
    let num = 1
    let list = e.currentTarget.dataset.list
    let index = that.data.guigeindex
    let stock = that.data.shop.stock //粗存
    console.log('stock', stock)
    num = that.data.num
    num++
    console.log('num', num)
    if (num > 1 && num <= stock) {
      that.setData({
        showNum: true
      })
      that.setData({
        num: num,
      })
      console.log('num', num)
    } else if (that.data.num == stock) {
      wx.showToast({
        title: '库存不足',
      })
    }
  },
  // 轮播图
  changDot(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },


  selected: function(e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },

  selected1: function(e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  //规格
  array(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let price = e.currentTarget.dataset.price
    let item = e.currentTarget.dataset.item
    let num = that.data.num
    console.log('num', )
    console.log('that.data.list[0].id', that.data.list[0].id)
    let sku_id = e.currentTarget.dataset.id
    console.log('item', item)
    console.log('sku_id', sku_id)
    // let p = num / 1000 * price * 1000
    that.setData({
      arrindex: index,
      price: price,
      sku_id: sku_id,
      guige: item,
      guigeindex: index,
      // price: p
    })
  },
  //加入购物车
  jiaR(e) {
    let that = this
    var formid = e.detail.formId
    let sku_id = null
    if (that.data.arrindex == 0) {
      sku_id = that.data.list[0].id
    } else {
      sku_id = that.data.sku_id
    }
    let pid = that.data.shop.id
    let num = that.data.num
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    console.log('pid', pid, 'num', num, 'uid', uid, 'sku_id', sku_id)
    //百货商品加入购物车
    app.agriknow.add_car(pid, num, uid, sku_id).then(res => {
      //formid 收集
      app.agriknow.formId(formid, openid, uid).then(res => {
        console.log('fromid收集', res)
      }).catch(err => {
        console.log(err)
      })
      console.log('添加购物车', res)
      if (res.data.code == 0) {
        wx.showToast({
          title: '添加成功',
        })
        that.close();
      } else if (res.data.message == '库存不足') {
        wx.showToast({
          title: '库存不足',
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  //客服旁边进去购物车
  _carmall() {
    wx.navigateTo({
      url: '/pages/mall/shopCar/shopCar'
    })
  },
  //立即购买
  Buy() {
    let that = this
    let mallShop = that.data.mallShop
    // console.log('mallShop', mallShop)
    let shop = JSON.parse(mallShop)
    let guige = null
    let aaa = null
    if (that.data.guigeindex == 0) {
      guige = that.data.list[0]
      aaa = that.data.list[0].price
      wx.setStorageSync('allPrice', a)
    } else {
      aaa = that.data.price
      guige = that.data.guige
    }
    let all = that.data.all
    console.log('guige', guige, 'all', all)
    // shop.sku[0] = guige
    that.setData({
      'all.product.sku': guige
    })
    that.setData({
      'all.product.sku': guige
    })
    console.log('shop[0].sku-++all', that.data.all)
    let num = that.data.num
    let _str = JSON.stringify(that.data.all)
    let a = JSON.stringify(guige)
    console.log('shop', shop)
    console.log('guige', a)
    console.log('shopData', that.data.shop)
    wx.navigateTo({
      url: '/pages/mall/shopDetail/pay/pay?guige=' + a + '&&shop=' + _str + '&&num=' + num + '&&price=' + aaa + '&&sc_id=' + that.data.sc_id,
    })
  },

  //进入店铺详情
  mall(e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mall/shopDetail/mall/mall?json=' + id,
    })
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function(e) {
    console.log(e)
    var that = this
    let img = e.currentTarget.dataset.img;
    console.log('图片数据', e, img)
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: img.split(',')
      // 需要预览的图片http链接 使用split把字符串转数组。不然会报错 
    })
  },

  onLoad: function(options) {
    let id = options.id //商品id
    var that = this
    console.log('id', id)
    let uid = wx.getStorageSync('user').id
    console.log('user', wx.getStorageSync('user'))
    // console.log('uid', uid)
    that.setData({
      shopId: id //商品id 
    })
    //百货点击商品进入详情
    app.agriknow.mallDetail(id, uid).then(res => {
      console.log(' 百货点击商品进入详情 onload =>', res.data.data)
      let score = parseFloat(res.data.data.store.score)
      let scores = score.toFixed(2)

      let shop_id = res.data.data.store.id
      // let imgheights = res.data.data.product.product_image
      that.setData({
        all: res.data.data,
        mall: res.data.data.store,
        shop: res.data.data.product,
        list: res.data.data.product.sku, //商品规格
        price: res.data.data.product.sku[0].price,
        // imgheights: imgheights,
        mallShop: res.data.data.product.product_slogan, //详情页面传入数据
        sc_id: res.data.data.store.sc_id,
        shop_id: shop_id,
        score: Math.round(res.data.data.store.score)
      })
      // 查询点店铺详情
      app.agriknow.shopDeatil(uid).then(res => {
        console.log('查询点店铺详情', res)
        let shopid = res.data.data.id
        if (shopid == that.data.shop_id) {
          that.setData({
            show: false
          })
        }
        app.globalData.shop = res.data.data //店铺信息存入全局
      }).catch(err => {
        console.log(err)
      })
      // console.log('mall', res.data.data.store)
      // console.log('shop', res.data.data.product)
      // console.log('list', res.data.data.product.sku)
    }).catch(err => {
      console.log(err)
    })
  },
  // -------- 点击图片放大 保存 -------
  previewImage: function(e) {
    console.log(e)
    var that = this
    let img = e.currentTarget.dataset.img;
    console.log('图片数据', img)
    wx.previewImage({
      current: "that.data.imgUrl",
      urls: img.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })
  },
  onShow: function() {}


})