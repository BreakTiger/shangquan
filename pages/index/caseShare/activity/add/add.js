const request = require('../../../../../class/api/_request.js')
import modals from '../../../../../class/base/modal.js'
const app = getApp();

Page({

  data: {
    all: '',
    sku: '',
    num: '',
    sums: '',
    is_store: '',
    coin: '',
    upoint: '',
    zhekou: '',
    deduction: '',
    usepath: '',
    selected1: false,
    selected2: false,
    koujian1: 0,
    koujian2: 0,
    usersname: '',
    usersphone: '',
    userscode: '',
    hint: '',
    order: '',
    oderinfo: '',
    table: true,
    mabye: true,
    usepath1: '',
    usepath2: '',
    fid: '',
    alert: false,
    pay_: [],
    c: '',
    select_coin: [],
    fixed: false,
    init: false,
    reduce_points: 0,
    reduce_current: 0,
    allprice_: 0
  },


  onLoad: function(options) {
    let that = this
    console.log(options)
    let all = JSON.parse(options.all)
    console.log('活动', all)
    let sku = JSON.parse(options.skuinfo)
    console.log('规格', sku)
    let num = options.num
    console.log('数量', num)
    that.setData({
      all: all,
      sku: sku,
      num: num
    })
    that.judge()
  },


  //判断是否为商家
  judge: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id
    }
    modals.loading()
    let url = app.globalData.api + 'mall/userisstore'
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        // modals.loaded()
        console.log('判断是否为商家', res)
        let code = res.data.code
        if (code == 0) {
          let zhekou = parseInt(res.data.data.user.member_zhekou)
          console.log('会员折扣', zhekou) //会员折扣

          let is_store = res.data.data.is_store //判断是否为商家
          if (is_store == 1) {
            console.log('res.data.data.store', res.data.data.store)
            let coin = parseInt(res.data.data.store.seller_coin) //我的商户币
            console.log('商户商户币', coin)
            that.setData({
              is_store: is_store, //判断是否为商家
              coin: coin || 0, //我的商户币
              zhekou: zhekou, //会员的折扣
              select_coin: res.data.data
            })
          } else {
            that.setData({
              is_store: is_store,
              zhekou: zhekou
            })
          }
        }
        that.user_info()
      })
  },

  //个人积分 + 商户币或奖励金抵扣部分
  user_info: function() {
    let that = this
    let id = wx.getStorageSync('user').id //用户id
    let aid = that.data.all.id //套餐id
    let price = that.data.all.price //套餐的价格
    let numbers = that.data.num //数量
    let data = {
      user_id: id,
      activity_id: aid,
      price: price,
      num: numbers,
      type: 1
    }
    // modals.loading()
    let url = app.globalData.api + 'tcshop/store.points_pay'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log('个人积分 + 商户币或奖励金抵扣部分', res)
        let code = res.data.code
        if (code == 200) {
          let upoint = res.data.data.user_score
          console.log('个人积分', upoint)
          let deduction = res.data.data.product_score
          console.log('商户币或者奖励金（积分）的抵扣数额：', deduction)
          that.setData({
            upoint: parseInt(upoint), //个人的奖励金
            deduction: deduction, //抵扣的百分比
            pay_: res.data.data
          })
        }
        that.countway()
      })
  },

  // 判断进入页面后，使用那种一种计算
  countway: function() {
    let that = this
    let all = that.data.all
    let is_member = all.is_member
    let is_points = all.is_points
    // 判断
    // modals.loading()
    if (is_member == 1) { //商品只支持会员折扣
      console.log('只支持会员折扣')
      that.paywithnumber()
      // modals.loaded()
    } else if (is_points != 0) { //商品只支持商品抵扣
      console.log('只支持奖励金或商户币抵扣')
      that.paywithdis()
      // modals.loaded()
    } else if (is_member == 0 || is_points == 0) { //上述都不支持
      console.log('都不支持')
      that.paywithnone()
      // modals.loaded()
    }
  },

  // 商品支持会员折扣
  paywithnumber: function() {
    let that = this
    console.log('会员')
    let num = that.data.num
    console.log('num', num)
    let sku = that.data.sku
    console.log('sku', sku)
    let price = sku.price
    console.log('price', price)
    let sum = price * 1000 * num / 1000
    console.log('sum', sum)
    that.setData({
      allprice_: sum
    })
    let zhekou = that.data.zhekou / 100
    console.log('会员折扣（百分比）', zhekou)

    if (zhekou != 1) {
      let dis = sum * zhekou
      console.log('1: dis', dis)
      // let sums = sum - dis
      // console.log('sums', sums)
      let a = dis.toFixed(2)
      console.log(a)
      that.setData({
        sums: a
      })
    } else {
      that.setData({
        sums: sum
      })
    }
  },

  // 商品支持商品抵扣
  paywithdis: function() {
    let that = this
    let num = parseInt(that.data.num)
    let sku = that.data.sku
    console.log('sku', sku)
    let price = sku.price
    let sums = price * 1000 * num / 1000
    console.log('价格总价：', sums)
    that.setData({
      allprice_: sums
    })
    // 计算可用的抵扣数额
    // let deduction = parseInt(that.data.deduction) / 100
    // console.log('deduction', deduction)
    // let usepath = parseInt(sums * deduction)
    let is_points = parseFloat(that.data.all.is_points) / 100
    let usepath = sums * 1000 * is_points / 1000
    console.log('is_points', is_points)
    console.log('可抵扣', usepath)
    that.setData({
      sums: sums,
      usepath1: parseInt(usepath), //商基金
      usepath2: parseInt(usepath) //奖励金
    })
  },

  // 都不支持
  paywithnone: function() {
    let that = this
    console.log('不做处理')

    // let coin = that.data.coin
    // console.log('商基金', coin)

    let num = that.data.num
    let sku = that.data.sku
    let price = sku.price
    let sums = price * 1000 * num / 1000
    console.log('都不支持的价格总价：', sums)

    that.setData({
      sums: sums,
      allprice_: sums
    })


  },







  // 商基金
  selectcoin: function() {
    let that = this
    let coin = that.data.coin
    let choice = that.data.selected1
    // modals.loading()
    // if (coin != 0) {
    //   if (choice) { //取消选中
    //     that.setData({
    //       selected1: false,
    //       mabye: true
    //     })
    //     that.judge()
    //     modals.loaded()
    //   } else { //选中
    //     that.discount1()
    //     that.setData({
    //       selected1: true,
    //       selected2: false,
    //       mabye: false
    //     })

    //     modals.loaded()
    //   }
    // } else {
    //   modals.showToast('您的商基金不足，无法抵扣', 'none')
    // }
    let allPrice = that.data.sums //总价
    console.log('总价', allPrice)
    let c = allPrice //把总价 赋值
    var prix = 0
    let sum = 0
    let points = parseInt(that.data.coin) //我的商基金
    // let points = 333
    console.log('我的奖励金', points)
    var probably = that.data.usepath2 //最高抵扣
    console.log('probably', probably)
    if (that.data.selected1 != 1) { //默认不点击
      if (points > 0) { //我的积分 >0
        if (probably >= points) { //最高抵扣大于我的积分
          // allPrice = allPrice - points
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
          that.setData({
            coin: 0,
            sums: allPrice,
            mabye: false,
            selected1: 1, //点击状态 显示
            c: c,
            fixed: true
          })
        } else { //最高抵扣 小于 我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100
          // allPrice = allPrice - probably
          console.log('allPrice', allPrice)
          that.setData({
            coin: sum,
            sums: allPrice,
            mabye: false,
            selected1: 1,
            c: c,
            fixed: true
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
        selected1: 0,
        sums: raise,
        mabye: true,
        coin: parseInt(that.data.select_coin.store.seller_coin), //我的全部商基金
        fixed: false
      })
    }
  },

  // // 奖励金奖励金抵扣
  // currency: function() {
  //   let that = this
  //   let upoint = that.data.upoint //获取最多抵扣
  //   let choice = that.data.selected2
  //   // console.log(choice)
  //   // modals.loading()
  //   if (upoint > 0) {
  //     if (choice) { //取消选中
  //       that.setData({
  //         selected2: false,
  //         table: true
  //       })
  //       that.judge()
  //       // modals.loaded()
  //     } else { //选中
  //       that.discount2()
  //       that.setData({
  //         selected2: true,
  //         selected1: false,
  //         table: false
  //       })

  //       // modals.loaded()
  //     }
  //   } else {
  //     modals.showToast('你的奖励金不足，无法抵扣', 'none')
  //   }

  // },
  //积分抵扣另外一种算法
  currency() {
    let that = this
    let allPrice = that.data.sums //总价
    console.log('总价', allPrice)
    let c = allPrice //把总价 赋值
    var prix = 0
    let sum = 0
    let points = parseInt(that.data.upoint) //我的奖励金
    // let points = 333
    console.log('我的奖励金', points)
    var probably = that.data.usepath2 //最高抵扣
    console.log('probably', probably)
    if (that.data.selected2 != 1) { //默认不点击
      if (points > 0) { //我的积分 >0
        if (probably >= points) { //最高抵扣大于我的积分
          // allPrice = allPrice - points
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
          that.setData({
            upoint: 0,
            sums: allPrice,
            table: false,
            selected2: 1, //点击状态 显示
            c: c,
            init: true
          })
        } else { //最高抵扣 小于我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100
          // allPrice = allPrice - probably
          console.log('allPrice', allPrice)
          that.setData({
            upoint: sum,
            sums: allPrice,
            table: false,
            selected2: 1,
            c: c,
            init: true
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
        selected2: 0,
        sums: raise,
        table: true,
        upoint: parseInt(that.data.pay_.user_score), //我的全部积分
        init: false
      })
    }
  },
  // 商基金计算
  discount1: function() {
    let that = this
    console.log('商基金')
    let sum = that.data.sums
    console.log('总价', sum)
    let coin = that.data.coin
    console.log('可用：', coin)
    let usepath = that.data.usepath1
    console.log('该订单最多抵扣：', usepath)
    // 判断
    if (coin >= usepath) {
      //1.拥有商基金多余最多的抵扣
      let sums = sum - usepath
      let yue = coin - usepath
      that.setData({
        sums: sums,
        coin: yue,
        koujian1: usepath
      })
    } else {
      let sums = sum - coin
      let yue1 = usepath - coin
      that.setData({
        sums: sums,
        usepath1: yue1,
        koujian1: coin
      })
    }
  },

  discount2: function() {
    let that = this
    let sum = that.data.sums
    console.log('总价', sum)
    let upoint = parseInt(that.data.upoint)
    console.log('可用奖励金', upoint)
    let usepath = that.data.usepath2
    console.log('最多抵扣：', usepath)
    // 判断
    if (upoint >= usepath) { //我的奖励金 >= 最多抵扣
      let sums = sum - usepath
      let yue = upoint - usepath
      console.log('yue', yue)
      that.setData({
        sums: sums, //总价
        upoint: yue, // 可用奖励金
        koujian2: usepath //奖励金
      })
      console.log('koujian2', that.data.koujian2)
    } else { //我的奖励金 < 最多抵扣
      let sums = sum - upoint
      let yue1 = usepath - upoint
      console.log('减少后的价格', sums)
      console.log('减少后的最多', yue1)
      // console.log(yue1)
      that.setData({
        sums: sums,
        // usepath2: yue1,
        koujian2: upoint,
        upoint: 0
      })
    }
  },

  // 用户名
  username: function(e) {
    let that = this
    let name = e.detail.value
    console.log(name)
    that.setData({
      usersname: name
    })
  },

  // 联系电话
  phone: function(e) {
    let that = this
    let phone = e.detail.value
    console.log(phone)
    if (phone.length == 11) {
      if ((/^1[34578]\d{9}$/.test(phone))) {
        that.setData({
          usersphone: phone
        })
        console.log('phone', that.data.usersphone)
      }
    }
  },

  // 身份证号码
  code: function(e) {
    let that = this
    let code = e.detail.value
    // console.log(code)
    if (code.length == 15) {
      if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(code)) {
        that.setData({
          userscode: code
        })
      }
    } else if (code.length == 18) {
      if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(code)) {
        that.setData({
          userscode: code
        })
      }
    }

  },

  // 备注
  hint: function(e) {
    let that = this
    let hint = e.detail.value
    console.log(hint)
    that.setData({
      hint: hint
    })
  },

  // 创建订单
  creatOrder: function(e) {
    console.log('e', e)
    let that = this
    var formid = e.detail.formId
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid
    app.agriknow.formId(formid, openid, uid).then(res => {
      console.log('fromid收集', res)
    }).catch(err => {
      console.log(err)
    })
    that.setData({
      fid: formid
    })

    let all = that.data.all
    // console.log('活动数据:', all)
    let aid = all.id
    console.log('活动ID：', aid)
    let num = that.data.num
    console.log('套餐数量：', num)
    let sku = that.data.sku
    // console.log('套餐规格', sku)
    let name = sku.product_name
    console.log('套餐名称：', name)
    let aname = all.title
    let price = sku.price
    console.log('价格：', price)
    let id = wx.getStorageSync('user').id
    console.log('用户ID：', id)
    let username = that.data.usersname
    console.log('联系人姓名：', username)
    let phone = that.data.usersphone
    console.log('电话号码：', phone)
    let code = that.data.userscode
    console.log('身份证号码：', code)
    let beizhu = that.data.hint
    console.log('备注：', beizhu)

    // let is_member = all.is_member
    // if (is_member == 1) {
    //   let dis = parseInt(that.data.zhekou) / 100
    //   console.log('会员折扣', dis)
    // } else {
    //   let dis = 0
    // }
    let dis = parseInt(that.data.zhekou) / 100
    console.log('会员折扣', dis)

    let koujian = that.data.koujian2
    console.log('积分减扣：', koujian)
    let way = '微信支付'




    let reduce_points = 0 //减少的商基金
    let coin = parseInt(that.data.select_coin.store.seller_coin)
    // let coin = 2
    if (that.data.fixed == true) { //选择了 商基金
      if (coin < parseInt(that.data.usepath2)) { //我的商基金 小于 总积分
        reduce_points = coin
        console.log('reduce_points', reduce_points)
      } else {
        if (coin >= parseInt(that.data.usepath2)) {
          reduce_points = parseInt(that.data.usepath2)
          console.log('reduce_points', reduce_points)
        } else {
          reduce_points = parseInt(that.data.usepath2) - coin
          console.log('reduce_points', reduce_points)
        }
      }
    } else {
      reduce_points = 0
    }

    let reduce_current = 0 //减少的积分
    let current = parseInt(that.data.pay_.user_score)
    console.log('我的奖励金', current)

    if (that.data.init == true) { //选择了 商基金
      if (current < parseInt(that.data.usepath2)) { //我的商基金 小于 总积分
        reduce_current = current
        console.log('reduce_current', reduce_current)
      } else {
        if (current >= parseInt(that.data.usepath2)) {
          reduce_current = parseInt(that.data.usepath2)
          console.log('reduce_current', reduce_current)
        } else {
          reduce_current = parseInt(that.data.usepath2) - current
          console.log('reduce_current', reduce_current)
        }
      }
    } else {
      reduce_current = 0
    }




    console.log('减少', reduce_points, reduce_current)
    that.setData({
      reduce_points: reduce_points,
      reduce_current: reduce_current
    })

    // 判断
    if (username == '') {
      modals.showToast('您输入的姓名有误或者未输入，请输入正确的姓名', 'none')
    } else if (phone == '') {
      modals.showToast('您输入的手机号码有误或者未输入，请输入正确的手机号码', 'none')
    } else if (code == '') {
      modals.showToast('您输入的身份证号码有误或者未输入，请输入正确的身份证号码', 'none')
    } else {
      wx.showModal({
        title: '提示',
        content: '确认支付？',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            let data = {
              activity_id: aid,
              specifications_num: num,
              specifications_name: name,
              // reserve_price: price,
              reserve_price:that.data.allprice_,
              user_id: id,
              user_name: username,
              user_mobile: phone,
              identity_number: code,
              comment: beizhu,
              member_price: dis,
              points: reduce_current,
              pay_type: way,
              product_spec: name,
              seller_coin: reduce_points
            }
            console.log(data)
            modals.loading()
            let url = app.globalData.api + 'tcshop/store.activity_order_create'
            request.sendRequest(url, 'post', data, {
                "Content-Type": "application/x-www-form-urlencoded"
              })
              .then(function(res) {
                modals.loaded()
                console.log('1111111111')
                console.log(res)
                let code = res.data.code
                if (code == 200) {
                  that.joincar();
                } else {
                  modals.showToast('支付失败', 'none')
                }
              })
            that.creatOrder();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  // 加入购物车
  joincar: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let all = that.data.all
    let aid = all.id
    let sid = all.store_id
    let point = that.data.koujian2
    let coin = that.data.koujian1




    let num = that.data.num
    console.log('数量', num)
    let aprice = that.data.sku.price
    console.log('单价', aprice)
    let sum = num * aprice
    console.log('减扣前的总价', sum)
    // let sum = that.data.sums
    // console.log('总价', sum)
    let sums = that.data.sums
    console.log('减扣后的总价:', sums)


    let data = {
      user_id: id,
      activity_id: aid,
      store_id: sid,
      use_points: that.data.reduce_current,
      use_seller_coin: that.data.reduce_points
    }
    console.log(data)
    modals.loading()
    let url = app.globalData.api + 'tcshop/store.activity_cart_detail'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let result = res.data.data
        // console.log(result)
        that.setData({
          order: result
        })
        that.createdorder()
      })
  },


  createdorder: function() {
    let that = this
    let id = wx.getStorageSync('user').id
    let price = that.data.sums
    let point = that.data.koujian2
    let coin = that.data.koujian1
    let list = JSON.stringify(that.data.order)
    let name = that.data.usersname
    let phone = that.data.usersphone
    let code = that.data.userscode
    let beizhu = that.data.hint
    let data = {
      user_id: id,
      allprice: price,
      address: '',
      carts: list,
      phone: phone,
      name: name,
      points: point,
      seller_coin: coin,
      identity_number: code,
      types: 1,
      beizhu: beizhu
    }
    console.log(data)
    modals.loading()
    let url = app.globalData.api + 'mall/buyshopcart'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          console.log('333333333333333333')
          let result = res.data.data
          that.setData({
            oderinfo: result
          })
          that.delcar()
        }
      })
  },

  delcar: function() {
    let that = this
    let all = that.data.all
    let aid = all.id
    let id = wx.getStorageSync('user').id
    let data = {
      user_id: id,
      activity_id: aid
    }
    console.log(data)
    modals.loading()
    let url = app.globalData.api + 'tcshop/store.activity_del'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        console.log('44444444444')
        console.log('清空购物车', res)
        let code = res.data.code
        if (code == 200) {
          that.pay()
        }
      })
  },

  pay: function() {
    let that = this
    let item = that.data.oderinfo
    console.log(item)
    let price = item.money
    let openid = wx.getStorageSync('auth').openid
    let numbers = item.order_number

    let data = {
      total_fee: price,
      openid: openid,
      out_trade_no: numbers
    }
    console.log(data)
    modals.loading()
    let url = app.globalData.api + 'pay/pay'
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log('55555555555555555555')
        console.log(res)
        let code = res.data.code
        if (code == 200) {
          let josn = res.data.data
          that.wxpay(josn)
        }
      })
  },

  // 微信支付
  wxpay: function(josn) {
    let that = this
    let formid = that.data.fid
    let uid = wx.getStorageSync('user').id
    let openid = wx.getStorageSync('user').weixin_openid

    console.log('666666666666666666666666')
    wx.requestPayment({
      'appId': josn.appId,
      'nonceStr': josn.nonceStr,
      'package': josn.package,
      'paySign': josn.paySign,
      'signType': josn.signType,
      'timeStamp': josn.timeStamp,
      success: function() {
        console.log('77777777777777777777777777777')

        setTimeout(function() {
          wx.showToast({
            title: '支付成功',
          })
        }, 1500)
        // app.agriknow.formId(formid, openid, uid).then(res => {
        //   console.log('fromid收集', res)
        // }).catch(err => {
        //   console.log(err)
        // })


        wx.redirectTo({
          url: '/pages/mine/reserve/reserve',
        })

      },
      fail: function(res) {
        setTimeout(function() {
          wx.showToast({
            title: '支付失败',
          })
        }, 1500)
        wx.redirectTo({
          url: '/pages/mine/reserve/reserve',
        })

      }

    })

  }















})