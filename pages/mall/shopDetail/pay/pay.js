var app = getApp();
import usual from "../../../../class/base/_usual.js"
Page({


  data: {
    code: '', //判断用户是否是商户 1.是商户
    seller_coin: '', //我的商户币
    points: '', //我的积分
    _shop: '',
    _selected: 0,
    selectMoren: 0,
    allPrice: '',
    shopData: [],
    jiF: [],
    address: '',
    name: '',
    phone: '',
    b: '',
    c: '',
    bb: null,
    _result: [], //传入的car
    allpoints: null,
    allSeller_: null,
    shopData: [],
    //---------------------------------------------------
    num: 0, //数量
    allPrice: 0, //商品价格价格
    zongjia: 0, //总价
    vip: 0,
    youfei: 0,
    maybe: true, //商基金和奖励金 二选1
    table: true, //商基金和奖励金 二选1
    probably: 0, //计算可抵用的 商基金和 奖励金
    is_member: 0,
    sc_id: '',
    is_member: ''
  },


  onLoad: function(options) {
    let that = this
    // console.log('页面传值', options)
    // console.log('价格', options.price)
    // console.log('img', options.img)
    let shopData = JSON.parse(options.shop)
    let sc_id = options.sc_id
    console.log('onload', sc_id)
    console.log('shop', shopData)
    let youfei = parseInt(shopData.store.distribution_fee) //邮费
    console.log('邮费', youfei)
    let num = parseInt(options.num) //数量
    // let allPrice = wx.setStorageSync('allPrice') + youfei
    // let vip = parseInt(shopData.product.sku.use_member) * num //会员抵扣
    // console.log('vip', vip)
    // let v = vip.toFixed(2);
    let zongjia = options.price * num //商品价格乘以数量
    // zongjia = zongjia - v //价格减去会员抵扣
    console.log('总价', zongjia)
    // zongjia = zongjia + youfei
    // wx.setStorageSync('allPrice', allPrice)

    that.setData({
      shopData: shopData,
      guige: JSON.parse(options.guige),
      num: num,
      // allPrice: allPrice,
      price: options.price,
      zongjia: zongjia.toFixed(2),
      zongjia: zongjia,
      youfei: youfei,
      sc_id: sc_id
    })
    //判断用户是否是商户
    let uid = wx.getStorageSync('user').id
    app.agriknow.ifelse(uid).then(res => {
      console.log('判断用户是否是商户', res)
      let judge = res.data.data
      var seller_coin = 0
      if (res.data.data.is_store == 0) {

      } else {
        seller_coin = parseInt(judge.store.seller_coin) //我的商户币
      }

      console.log('seller_coin', seller_coin)
      let points = parseInt(judge.user.points) //我的积分
      console.log('我的积分', points)
      that.setData({
        code: judge.is_store,
        judge: judge,
        seller_coin: seller_coin,
        points: parseInt(points),
        allpoints: parseInt(points),
        allSeller_: seller_coin
      })
      console.log('我的积分', points, '我的商户币', seller_coin)


      //查询用户信息
      app.agriknow.getUser(uid).then(res => {
        console.log(' 查询用户信息 =>', res)
        let vip = parseInt(res.data.data.grade_bili)
        that.setData({
          vip: vip
        })
        vip = vip / 100
        console.log('vip', vip)
        //计算商品是否享受会员折扣和 商品折扣
        let pro_price = 0
        var is_member = parseInt(shopData.product.is_member)
        that.setData({
          is_member: is_member
        })
        var is_points = parseInt(shopData.product.is_points)
        let pro_ = 0
        console.log('is_member', is_member, 'is_points', is_points)
        let pro = 0
        if (is_member == 1) { //享受会员折扣
          pro_price = options.price * 1000 * num / 1000
          pro_ = pro_price * vip
          console.log('pro_price', pro_price)
          console.log('pro', pro_)
          let fixed = Math.floor(pro_ * 100) / 100
          if (fixed == 0.00) {
            fixed = 0.01
          }
          that.setData({
            // zongjia: pro_price.toFixed(2)
            zongjia: fixed
          })
        } else if (is_points > 0) {
          pro_price = parseInt(options.price) * num
          is_points = parseInt(is_points) / 100
          console.log('is_points', is_points)
          pro = pro_price * 1000 * is_points / 1000
          console.log('pro', pro)
          pro_price = pro_price - pro
          console.log('pro_price', pro_price)
          // let par = pro_price.toFixed(2)
          // if(par == 0.00){
          //   par = 0.01
          // }
          that.setData({
            // zongjia: par,
            probably: parseInt(pro)
          })
        }


      }).catch(err => {
        console.log(err)
      })


    }).catch(err => {
      console.log(err)
    })
    if (!that.data.name && !that.data.adress && !that.data.phone) {
      that.changeadds(); //收货地址
    }
  },
  onShow: function() {
    let that = this
    // that.changeadds();
  },
  //选择收货地址
  changeadds() {
    let that = this
    // let getid = that.data.getid
    // console.log(getid)
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        let username = res.userName
        let phone = res.telNumber
        // 地址
        let arr = []
        arr.push(res.provinceName)
        arr.push(res.cityName)
        arr.push(res.countyName)
        arr.push(res.detailInfo)
        let adss = arr.join(',')
        // console.log('地址', adss)
        that.setData({
          address: adss,
          name: username,
          phone: phone
        })
      }
    })
  },

  //商户币抵扣另外一种算法
  currency() {
    let that = this
    let allPrice = that.data.zongjia //总价
    console.log('总价', allPrice)
    let c = allPrice //把总价 赋值
    var prix = 0
    let sum = 0
    let points = parseInt(that.data.judge.store.seller_coin) //我的商基金
    console.log('我的全部商基金', points)
    var probably = that.data.probably //最高抵扣
    console.log('probably', probably)
    if (that.data._selected == 0) { //默认不点击
      if (points > 0) { //我的商户币 >0
        if (probably >= points) { //最高抵扣大于我的商户币
          // allPrice = allPrice - points
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
          that.setData({
            seller_coin: 0,
            zongjia: allPrice,
            maybe: false,
            _selected: 1, //点击状态 显示
            c: c
          })
        } else { //最高抵扣 小于我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          console.log('++++++', allPrice, '++++++probably', probably)
          // Math.round((parseFloat(MarketPrice.value) - parseFloat(SecondPrice.value)) * 100) / 100
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100
          console.log('allPrice', allPrice)
          that.setData({
            seller_coin: parseInt(sum),
            zongjia: allPrice,
            maybe: false,
            _selected: 1, //点击状态 显示
            c: c
          })
        }
      } else {
        wx.showToast({
          title: '商基金不足',
        })
      }
    } else {
      let raise = that.data.c
      console.log('我输出的总价 raise', raise)
      that.setData({
        _selected: 0,
        zongjia: raise,
        maybe: true,
        seller_coin: parseInt(that.data.judge.store.seller_coin), //我的商基金
      })
    }
  },
  //商户币抵扣
  _selectMoren() {
    let that = this
    let allPrice = that.data.zongjia //商品总价
    console.log('商户币抵扣 allPrice', allPrice)
    let bbb = allPrice
    let seller_coin = parseInt(that.data.judge.store.seller_coin) //判断是否能用商户币抵扣 为0不行
    console.log('判断是否能用商户币抵扣')
    let _points = that.data.points //我的积分
    let money = 0;
    let use_points = 0;
    let use_seller_coin = 0;
    if (seller_coin > 0) { //判断是否能用商户币抵扣 为0不行
      if (that.data._selected == 0) {
        let result = that.data.shopData
        console.log('商品', result)
        var product = result.product //商品
        let arr = 0
        let num = parseInt(that.data.num)
        let pric = product.price * num //商品价格乘以数量
        if (seller_coin >= allPrice) { //我的商户币大于商品价格
          // product.price = 0
          product.use_seller_coin = allPrice
          seller_coin = seller_coin - allPrice
          let s = seller_coin.toFixed(2)
          allPrice = 0
          console.log('pric', pric)
          console.log('allPrice', allPrice)
          if (allPrice > 0) {
            let aaa = that.data.zongjia
            // wx.setStorageSync('allPrice', allPrice)
            that.setData({
              zongjia: aaa
            })
          } else {
            let a = 0
            // wx.setStorageSync('allPrice', a)
            that.setData({
              zongjia: a
            })
          }

          console.log('pric', pric)
          console.log('allPrice', allPrice) //折扣后总价
          that.setData({
            seller_coin: s,
            _selected: 1,
            bbb: bbb
            // _result: result //改变的result
          })
        }
        console.log('bbb', bbb)
      } else {
        // wx.setStorageSync('allPrice', bbb)
        let bbb = that.data.bbb //取消恢复原价
        console.log('bbb', bbb)
        let c = that.data.c
        // wx.setStorageSync('allPrice', c)
        console.log('c', c)
        that.setData({
          _selected: 0,
          zongjia: bbb,
          seller_coin: that.data.judge.store.seller_coin
        })
      }
    } else {
      wx.showToast({
        title: '商户币不足',
      })
    }
  },
  //积分抵扣另外一种算法
  select_Moren() {
    let that = this
    let allPrice = that.data.zongjia //总价
    console.log('总价', allPrice)
    let c = allPrice //把总价 赋值
    var prix = 0
    let sum = 0
    let points = parseInt(that.data.points) //我的积分
    console.log('我的全部积分', points)
    var probably = that.data.probably //最高抵扣
    console.log('probably', probably)
    if (that.data.selectMoren == 0) { //默认不点击
      if (points > 0) { //我的积分 >0
        if (probably >= points) { //最高抵扣大于我的积分
          // allPrice = allPrice - points
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
          that.setData({
            points: 0,
            zongjia: allPrice,
            table: false,
            selectMoren: 1, //点击状态 显示
            c: c
          })
        } else { //最高抵扣 小于我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100
          // allPrice = allPrice - probably
          console.log('allPrice', allPrice)
          that.setData({
            points: sum,
            zongjia: allPrice,
            table: false,
            selectMoren: 1, //点击状态 显示
            c: c
          })
        }
      } else {
        wx.showToast({
          title: '奖励金不足',
        })
      }
    } else {
      let raise = that.data.c
      console.log('我输出的总价 raise', raise)
      that.setData({
        selectMoren: 0,
        zongjia: raise,
        table: true,
        points: parseInt(that.data.judge.user.points), //我的全部积分
      })
    }
  },
  //积分抵扣
  selectMoren() {
    let that = this
    let allPrice = that.data.zongjia //总价
    let c = allPrice //总价赋值
    console.log('留有预存的总价c', c)
    console.log('判断用户是否能用积分抵扣')
    let _points = that.data.points //我的积分
    let money = 0;
    let use_points = 0;
    if (that.data.selectMoren == 0) {
      let shopData = that.data.shopData
      var product = shopData.product
      console.log('product', product)
      let arr = 0
      if (allPrice > 0) { //商品价格
        console.log('商品积分', product.is_points, '我的积分', _points)
        let pro_ = parseInt(product.is_points) //
        if (pro_ <= _points) { //商品积分 <= 我的积分
          console.log('我的积分<=')
          // var array = pro_ / 100
          var array = pro_
          //var array = product.is_points / 100 //
          let arr = product.price - array
          let num = that.data.num
          // let acpric = array * product.num
          let acpric = array * num
          let price = num * arr
          let jian_pro = pro_ * num
          use_points += parseInt(product.is_points)
          console.log('++++++++++++++++use_points', 'product[i].detail.is_points', product.is_points, use_points)
          product.price = price
          product.use_points = product.is_points
          console.log(acpric, 'acpric')
          allPrice = allPrice - acpric
          if (allPrice < 0) {
            allPrice = 0
            that.setData({
              zongjia: allPrice
            })
          } else {
            let ap = parseInt(allPrice)
            that.setData({
              zongjia: ap
            })
          }
          // wx.setStorageSync('allPrice', allPrice)
          // console.log('price', price)
          _points = _points - jian_pro
          if (_points <= 0) {
            that.setData({
              points: 0
            })
          } else {
            that.setData({
              points: _points
            })
          }
          console.log('_points', _points)
          console.log('allPrice', allPrice)
          console.log('use_points', use_points)
          that.setData({
            // zongjia: allPrice,
            selectMoren: 1,
            b: acpric,
            c: c
          })
          // console.log('result', result, 'b', that.data.b)
        } else {
          wx.showToast({
            title: '积分不足',
          })
        }
      }
    } else {
      let c = that.data.c
      console.log('固定的总价c', c)
      // let _result = that.data.jiF
      // wx.setStorageSync('allPrice', c)
      that.setData({
        selectMoren: 0,
        zongjia: c,
        points: that.data.judge.user.points,
        c: c
      })
    }
  },
  //结算
  submit(e) {
    let that = this
    let val = e.detail.value
    console.log('val', val)
    var formid = e.detail.formId
    let pid = that.data.shopData.product.id
    let uid = wx.getStorageSync('user').id
    let allprice = that.data.zongjia
    let address = that.data.address
    // let carts = that.data._result
    let num = that.data.num
    let sid = that.data.shopData.store.id
    let phone = that.data.phone
    let name = that.data.name
    let openid = wx.getStorageSync('user').weixin_openid
    let sku_id = that.data.shopData.product.sku.id
    let points = that.data.points //获取积分
    let seller_coin = parseInt(that.data.seller_coin) //获取商户比
    let allpoints = that.data.allpoints //获取整个积分
    let allSeller_ = parseInt(that.data.allSeller_) //获取整个商户币
    console.log('获取我所需的整个积分币', allpoints, '获取整个商户币', allSeller_)
    console.log('获取积分', points, '获取商户比', seller_coin)
    let reduce_points = allpoints - points //整个积分减去积分
    let reduce_seller = allSeller_ - seller_coin //整个商户币减去商户比
    let beizhu = val.text //备注
    console.log('减少+++++', reduce_points, reduce_seller)
    console.log('uid', uid, 'allprice', allprice, 'pid', pid, 'phone', phone, 'name', name, 'reduce_points', reduce_points, 'reduce_seller', reduce_seller, 'sku_id------------', sku_id)
    if (address != '' && name != '' && phone != '') {
      app.agriknow.nowBuy(pid, uid, allprice, address, num, sid, reduce_points, sku_id, reduce_seller, phone, name, 3, beizhu).then(res => {
        //formid 收集
        app.agriknow.formId(formid, openid, uid).then(res => {
          console.log('fromid收集', res)
        }).catch(err => {
          console.log(err)
        })
        console.log('直接购买', res)
        let money = res.data.data.money
        let order_id = res.data.data.order_number
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '确认支付？',
            confirmText: '支付',
            success: function(res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
                wx.switchTab({
                  url: '/pages/mall/mall',
                })
              } else {
                //点击确定
                app.agriknow.pay(money, openid, order_id).then(res => { //支付
                  console.log('支付结果', res)
                  let json = res.data.data
                  //微信支付
                  wx.requestPayment({
                    'appId': json.appId,
                    'timeStamp': json.timeStamp,
                    'nonceStr': json.nonceStr,
                    'package': json.package,
                    'signType': 'MD5',
                    'paySign': json.paySign,
                    'success': function(res) {
                      console.log('支付成功', res)
                      wx.showToast({
                        title: '支付成功',
                      })
                      setTimeout(function() {
                        wx.redirectTo({
                          url: '/pages/mine/orderList/orderList',
                        })
                      }, 1500)
                    },
                    fail(res) {
                      console.log('支付失败', res)
                      wx.showToast({
                        title: '支付失败',
                      })
                      setTimeout(function() {
                        wx.switchTab({
                          url: '/pages/mall/mall',
                        })
                      }, 1500)
                    }
                  })
                }).catch(err => {
                  console.log(err)
                })

              }
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '请填写物流信息',
        showCancel: false
      })
    }
  }


})