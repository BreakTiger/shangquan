var app = getApp();
import usual from "../../../class/base/_usual.js"
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
    biref: 0,
    vip: '',
    all_: 0, //计算 商品折扣 积分抵扣 会员折扣的总价
    maybe: true, //商基金和奖励金 二选1
    table: true, //商基金和奖励金 二选1
    probably: 0, //计算可抵用的 商基金和 奖励金
    initif: '',
    arr: [],
    member: '',
    fix: false,
    gral: false
  },
  //留言
  inputText(e) {
    let that = this
    const index = e.currentTarget.dataset.index; //获取下标
    let item = "jiF[" + index + "].store.beizhu"
    console.log('留言内容', e.detail.value)
    that.setData({
      [item]: e.detail.value
    })
    console.log('jiF', that.data.jiF) //赋值成功后数组
  },
  onLoad: function(options) {
    let that = this
    console.log('_shop', options.data)
    let _shop = options.data
    let shop = JSON.parse(options.data) //商品数据
    let user = wx.getStorageSync('user')
    console.log('item', shop)
    //判断用户是否是商户
    let uid = wx.getStorageSync('user').id
    app.agriknow.ifelse(uid).then(res => {
      console.log('判断用户是否是商户', res)
      let seller_coin = null
      let judge = res.data.data
      if (judge.is_store == "0") {
        seller_coin = 0 //我的商户币
      } else {
        seller_coin = parseInt(judge.store.seller_coin) //我的商户币
      }

      let points = judge.user.points //我的积分
      console.log('我的积分', points)
      that.setData({
        code: judge.is_store, //查看是否可以商户币抵扣的资格
        judge: judge,
        seller_coin: parseInt(seller_coin), //商户币
        points: parseInt(points), //积分
        _shop: _shop,
        allpoints: parseInt(points), //总积分
        allSeller_: parseInt(seller_coin) //总商户币
      })


      app.agriknow.indefinite(_shop, uid).then(res => {
        // console.log('购物车数据', res)
        let jiF = res.data.data
        console.log('购物车数据', jiF)
        that.setData({
          jiF: res.data.data,
          _result: res.data.data
        })

        // let item = "jiF[" + index + "].store.beizhu" //setData
        // that.setData({
        //   [item]: ''
        // })

        //计算会员折扣
        let member = 0
        for (let j in jiF) {
          let product = jiF[j].product
          for (let i in product) {
            console.log('product[i].detail.is_member', product[i].detail.is_member)
            member = product[i].detail.is_member
            console.log('for - ------member', that.data.member)
            member += that.data.member
            console.log('member+++', member)
            that.setData({
              member: member
            })
          }
          member = 0
        }
        console.log('member', that.data.member)




        //计算商品是否可以满足 会员折扣
        let initif = 0
        for (let a in jiF) {
          let pro = jiF[a].product
          for (let r in pro) {
            console.log('pro[r]', pro[r])
            initif = parseInt(pro[r].detail.is_member)
            initif += initif
            console.log('initif', initif)
            that.setData({
              initif: initif
            })
            initif = 0
          }
        }





        let biref = 0
        let allPrice = wx.getStorageSync('allPrice') //总价
        //计算邮费
        for (let i in jiF) {
          biref += parseInt(jiF[i].store.detail.distribution_fee)
          console.log('计算邮费', biref)
        }
        let zojia = 0
        for (let i in jiF) {
          let allZongjia = jiF[i].store.allprice - jiF[i].store.use_member
          zojia = zojia + allZongjia
        }
        let z = zojia.toFixed(2) //保留两位整数
        // let j = parseInt(z)
        console.log('zojia', z)
        wx.setStorageSync('allPrice', z)
        // let a = allPrice 
        that.setData({
          biref: biref
        })
        // allPrice = z + biref
        allPrice = parseFloat(z) + biref
        console.log('+++++++z  biref', z, biref, allPrice)
        that.setData({
          allPrice: allPrice.toFixed(2)
        })
        //计算 可抵用的商基金 奖励金
        console.log('that.data.jiF', that.data.jiF)
        // console.log('美食', that.data.jiF[1].product[0].detail.is_member)
        // let discount = 0
        // let all_price = 0
        // let last = 0
        // for (let i in jiF) {
        //   let product = jiF[i].product
        //   for (let j in product) {
        //     let pro_price = 0 //单个商品价格
        //     pro_price = parseInt(product[j].price) //商品的每一个价格
        //     console.log('pro_price', pro_price)
        //     let detail_price = parseInt(product[j].detail.is_points) / 100 //每个商品的折扣
        //     console.log('detail_price', detail_price)
        //     discount = pro_price * detail_price
        //     console.log('discount', discount)
        //     last = pro_price - discount
        //     console.log('last', last)
        //     all_price += last
        //     all_price = parseInt(all_price)
        //     console.log('all_price', all_price)
        //   }
        // }

        //计算 总抵扣值
        var probably = 0
        let reduce = 0
        console.log('jiF+++++++++++++++++++++++++++++++', that.data.jiF)
        for (let i in jiF) { //循环每个店铺
          let product = jiF[i].product //每个店铺的每个商品
          for (let j in product) { //循环每个商品
            var is_points = parseInt(product[j].detail.is_points)
            console.log('is_points', is_points)
            if (is_points > 0) { //积分抵扣大于0
              let proPrice = 0 //单个商品价格
              proPrice = parseInt(product[j].price) * parseInt(product[j].num) //商品的每一个价格 乘以数量
              console.log('proPrice', proPrice)
              is_points = is_points / 100
              console.log('is_points', is_points)
              reduce = parseInt(proPrice * is_points)
              console.log('reduce', reduce)
              // sum = proPrice - reduce
              // console.log('sum', sum)
              probably += reduce
              that.setData({
                probably: probably
              })
              console.log('probably******************', probably)
              reduce = 0
            }
          }
        }




        //查询用户信息
        app.agriknow.getUser(user.id).then(res => {
          console.log(' 查询用户信息 =>', res)
          that.setData({
            vip: res.data.data.grade_bili
          })
          let vip = parseInt(that.data.vip)
          //计算会员  的价格
          console.log('vip', vip)
          let discount = 0
          let all_price = 0
          let last = 0
          let all = 0
          let vipPrice = 0
          var all_ = 0
          var jiage = 0
          vip = vip / 100
          console.log('vip', vip) //vip 折扣
          for (let i in jiF) {
            let product = jiF[i].product
            for (let j in product) {
              let pro_price = 0 //单个商品价格
              last = 0
              let code = parseInt(product[j].detail.is_member) //是否享受会员抵扣 
              console.log('code[j]++++++++', code)
              if (code == 0) { //商品折扣
                pro_price = product[j].price * parseInt(product[j].num) //商品的每一个价格 乘以数量
                last = pro_price
                // console.log('code == 0 商品折扣')
                // let detail_price = parseInt(product[j].detail.is_points) / 100 //每个商品的折扣
                // console.log('detail_price[j]-------------------', detail_price)
                // if (detail_price == 0) { //==0 不享受会员折扣
                //   last = pro_price
                //   console.log('detail_price == 0 last', last)
                // } else {
                //   console.log('detail_price', detail_price)
                //   discount = pro_price * detail_price
                //   console.log('discount', discount)
                //   last = pro_price - discount
                //   console.log('last', last)
                // }
              } else if (code == 1) { //享受会员折扣
                pro_price = parseInt(product[j].price) * parseInt(product[j].num) //商品的每一个价格 乘以数量
                console.log('code == 1 享受会员折扣')
                console.log('vip', vip)
                jiage = (pro_price * vip)
                console.log('pro_price', jiage)
              }
              console.log('最后一次last', last)
              console.log('最后一次 pro_price', jiage)
              // allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
              // all_price = last + jiage
              all_price = Math.round((parseFloat(last) + parseFloat(jiage)) * 100) / 100
              console.log('[nnn] ', 'last', last, 'pro_price', pro_price, 'all_price', all_price)
              that.setData({
                all: all_price
              })
              console.log('that.data.all', that.data.all)
              all_ += that.data.all //最后的结果
              // wx.setStorageSync('allPrice', all_) //设置缓存
              // that.setData({
              //   allPrice: all_
              // })
              last = 0
              jiage = 0
              console.log('all_price[iiiii]', all_price, 'all_', all_)
            }
          }





          // let discount = 0
          // let all_price = 0
          // let last = 0
          // let all = 0
          // let vip = parseInt(that.data.vip)
          // let vipPrice = 0
          // var all_ = 0
          // var jiage = 0
          // console.log('vip', vip) //vip 折扣
          // for (let i in jiF) {
          //   let product = jiF[i].product
          //   for (let j in product) {
          //     let pro_price = 0 //单个商品价格
          //     let code = parseInt(product[j].detail.is_member) //是否享受会员抵扣 
          //     console.log('code[j]++++++++', code)
          //     if (code == 0) { //商品折扣
          //       pro_price = parseInt(product[j].price) * parseInt(product[j].num) //商品的每一个价格 乘以数量
          //       last = 0
          //       console.log('code == 0 商品折扣')
          //       let detail_price = parseInt(product[j].detail.is_points) / 100 //每个商品的折扣
          //       console.log('detail_price[j]-------------------', detail_price)
          //       if (detail_price == 0) { //==0 不享受会员折扣
          //         last = pro_price
          //         console.log('detail_price == 0 last', last)
          //       } else {
          //         console.log('detail_price', detail_price)
          //         discount = pro_price * detail_price
          //         console.log('discount', discount)
          //         last = pro_price - discount
          //         console.log('last', last)
          //       }
          //     } else if (code == 1) { //享受会员折扣
          //       pro_price = parseInt(product[j].price) * parseInt(product[j].num) //商品的每一个价格 乘以数量
          //       console.log('code == 1 享受会员折扣')
          //       vip = vip / 100
          //       console.log('vip', vip)
          //       jiage = pro_price * vip
          //       console.log('pro_price', jiage)
          //     }
          //     console.log('最后一次last', last)
          //     console.log('最后一次 pro_price', jiage)
          //     all_price = last + jiage
          //     console.log('[nnn] ', 'last', last, 'pro_price', pro_price, 'all_price', all_price)
          //     that.setData({
          //       all: all_price
          //     })
          //     console.log('that.data.all', that.data.all)
          //     all_ += that.data.all //最后的结果
          //     wx.setStorageSync('allPrice', all_) //设置缓存
          //     that.setData({
          //       allPrice: all_
          //     })
          //     last = 0
          //     jiage = 0
          //     console.log('all_price[iiiii]', all_price, 'all_', all_)
          //   }
          // }



        }).catch(err => {
          console.log(err)
        })

      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
    // console.log(that.data.types)

    // let price = 0;
    // let buyNow = shop
    // // console.log('shop buyNow', buyNow)
    // for (let j in buyNow) {
    //   var num = 0;
    //   let ttprice = 0;
    //   var items = buyNow[j].product
    //   // console.log('items',items)
    //   for (let i in items) {
    //     var intm = parseInt(items[i].num)
    //     // console.log('intm', intm)
    //     num = parseInt(num) + intm
    //     // console.log('num+',i,j, num)
    //     price = intm * items[i].price
    //     // console.log('计算得来price', price)
    //     buyNow[j]['ttnum'] = num;
    //     // console.log('数目', num, '价格', price)
    //     ttprice += items[i].num * items[i].price
    //     // console.log('num', num, 'buyNow[j]',buyNow[j])
    //     //num = 0;
    //     price = 0;
    //     // console.log('num', num)
    //     // console.log('price', price)
    //   }
    //   // buyNow[j]['ttprice'] = ttprice;
    //   num = 0;
    //   price = 0;
    // }
    // that.setData({
    //   shopData: buyNow,
    //   num: num
    // })
    // usual.sum(buyNow)
    console.log('that.data.shopData', that.data.shopData)
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
    let shopData = that.data.jiF //所有商品信息
    let allPrice = that.data.allPrice //总价
    console.log('总价', allPrice)
    let c = allPrice //把总价 赋值
    var prix = 0
    let sum = 0
    let points = parseInt(that.data.judge.store.seller_coin) //我的商基金
    console.log('我的全部商基金', points)
    var probably = that.data.probably //最高抵扣
    // var probably = 5
    console.log('probably', probably)
    if (that.data._selected == 0) { //默认不点击
      if (points > 0) { //我的商户币 >0
        if (probably >= points) { //最高抵扣大于我的商户币
          // allPrice = allPrice - points
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(points)) * 100) / 100
          that.setData({
            seller_coin: 0,
            allPrice: allPrice,
            maybe: false,
            _selected: 1, //点击状态 显示
            c: c,
            gral: true
          })
        } else { //最高抵扣 小于我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          // allPrice = allPrice - probably
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100

          console.log('allPrice', allPrice)
          that.setData({
            seller_coin: sum,
            allPrice: allPrice.toFixed(2),
            maybe: false,
            _selected: 1, //点击状态 显示
            c: c,
            gral: true
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
        allPrice: raise,
        maybe: true,
        seller_coin: parseInt(that.data.judge.store.seller_coin), //我的商基金
        gral: false
      })
    }
  },
  //商户币抵扣
  _selectMoren() {
    let that = this
    let allPrice = that.data.allPrice
    console.log('一进来的初始化', that.data._selected) //默认不点击
    console.log('商户币抵扣 allPrice', allPrice) //拿到总价格
    let bbb = allPrice //总价格存入bbb setaData
    let _shop = that.data._shop //拿到进入的商品数据 字符串
    let seller_coin = that.data.judge.store.seller_coin //判断是否能用商户币抵扣 为0不行
    console.log('判断是否能用商户币抵扣 0不行 1可以')
    let result = that.data.jiF //循环的数组
    let fff = result //保存未点击的数组
    console.log('result', result)
    let _points = that.data.points //查询我的所有积分
    let money = 0;
    let use_points = 0;
    let use_seller_coin = 0;
    let pric
    // seller_coin
    let _seller = parseInt(that.data.seller_coin) //我的所有商户币 
    console.log('_seller', _seller)
    if (_seller > 0) { //我的商户币>0 继续
      if (that.data._selected == 0) { //我的选择状态 默认不点击 == 0.0
        // console.log('form++', that.data._selected == 0)
        for (let j in result) {
          var product = result[j].product
          for (let i in product) {
            let arr = 0
            console.log('product[i]', product[i])
            console.log('product[i].price', product[i].price)
            if (product[i].price != 0) {
              pric = product[i].price * parseInt(product[i].num) //每个价格乘以数量
              console.log('product[i].price', product[i].price)
              console.log('product[i].num', product[i].num)
              if (seller_coin >= pric) { //我的商户币大于价格
                // product[i].price = 0
                use_seller_coin += product[i].price //每个商品价格的相加
                console.log(' use_seller_coin', use_seller_coin)
                money += pric //
                console.log('money', money)
                product[i].use_seller_coin = pric
                // allPrice = allPrice - pric

                seller_coin = seller_coin - pric
                let s = seller_coin.toFixed(2)
                console.log('pric', pric)
                console.log('money', money)
                console.log('allPrice', allPrice) //折扣后总价
                that.setData({
                  seller_coin: s,
                  _selected: 1,
                  bbb: bbb,
                  _result: result //改变的result
                })
              }
            }
          }

        }
        console.log('allPrice', allPrice)
        console.log('money', money)
        console.log('pric', pric)
        allPrice = parseInt(allPrice) - money
        // allPrice = parseInt(allPrice) - use_seller_coin
        console.log('allPrice', allPrice)
        if (allPrice > 0) {
          let appa = parseFloat(allPrice)
          console.log('appa', appa)
          let a = appa.toFixed(2)
          console.log('aaaaa', a)
          let aaa = parseInt(a)
          console.log('aaaa', aaa)
          wx.setStorageSync('allPrice', a)
          that.setData({
            allPrice: aaa
          })
        } else {
          let a = 0
          wx.setStorageSync('allPrice', a)
          that.setData({
            allPrice: a
          })
        }
      } else {
        console.log('that.data._selected else', that.data._selected)
        let bbb = that.data.bbb
        let _result = that.data.jiF
        wx.setStorageSync('allPrice', bbb)
        console.log('bbb', bbb)
        // let c = that.data.c
        // wx.setStorageSync('allPrice', c)
        // console.log('b', 'c', c)
        that.setData({
          _selected: 0,
          allPrice: bbb,
          seller_coin: parseInt(that.data.judge.store.seller_coin),
          // _result: result,
          // jiF: fff
        })
        console.log('that.data._selected', that.data._selected)
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
    let shopData = that.data.jiF //所有商品信息
    let allPrice = that.data.allPrice //总价
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
            allPrice: allPrice,
            table: false,
            selectMoren: 1, //点击状态 显示
            c: c,
            fix: true
          })
        } else { //最高抵扣 小于我的积分
          console.log('points allPrice probably', points, allPrice, probably)
          sum = points - probably
          console.log('sum', sum)
          // allPrice = allPrice - probably
          allPrice = Math.round((parseFloat(allPrice) - parseFloat(probably)) * 100) / 100
          console.log('allPrice', allPrice)
          that.setData({
            points: sum,
            allPrice: allPrice.toFixed(2),
            table: false,
            selectMoren: 1, //点击状态 显示
            c: c,
            fix: true
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
        allPrice: raise,
        table: true,
        points: parseInt(that.data.judge.user.points), //我的全部积分
        fix: false
      })
    }
  },



















  //积分抵扣
  selectMoren() {
    let that = this
    let _shop = that.data._shop //我的商品信息 josn字符串
    let allPrice = that.data.allPrice
    // wx.getStorageSync('allPrice') //获取我的所有价格
    let c = allPrice //把进入价格赋值
    console.log('判断用户是否能用积分抵扣')
    let result = that.data.jiF //所有商品信息
    let _points = parseInt(that.data.points) //我的积分
    console.log('我的全部积分', _points)
    let money = 0;
    let use_points = 0;
    if (_points > 0) { //我的积分大于0 才可以选择
      if (that.data.selectMoren == 0) { //==0 默认 不点击
        console.log('显示不点击')
        for (let j in result) {
          var product = result[j].product //商品信息
          for (let i in product) {
            let arr = 0
            console.log('product[i].price', product[i].price)
            if (product[i].price > 0) {
              let proprice = product[i].price
              console.log('product[i].detail.is_points', product[i].detail.is_points)
              if (product[i].detail.is_points > 0) {
                let z_points = product[i].detail.is_points * product[i].num
                console.log('商品总使用积分：', z_points)
                console.log('我的积分', _points)
                if (_points >= z_points) { //我的积分大于商品积分
                  var array = parseInt(product[i].detail.is_points) //商品积分 %100
                  console.log('array', array)
                  console.log('product[i].price', product[i].price)
                  let arr = product[i].price - array //商品价格减去积分
                  console.log('arr', arr)
                  let acpric = array * product[i].num // 减去的积分 乘以数量
                  console.log('acpric', acpric)
                  let price = product[i].num * arr //商品每个数量 乘以 减去的积分
                  console.log('price+++++', price) //价格
                  use_points += parseInt(product[i].detail.is_points)
                  console.log('+++++++use_points', 'product[i].detail.is_points',
                    use_points)
                  // product[i].price = arr
                  product[i].use_points = product[i].detail.is_points
                  console.log(' product[i].use_points', product[i].use_points)
                  allPrice = allPrice - acpric
                  let allp = parseFloat(allPrice)
                  wx.setStorageSync('allPrice', allPrice)
                  console.log('wx.setStorageSync(allPrice, allPrice)', allPrice)
                  console.log('product[i].detail.is_points', product[i].detail.is_points)
                  console.log('我的积分_pnints', _points)
                  console.log('商品积分+++++', product[i].detail.is_points, )
                  _points = _points - product[i].detail.is_points //我的积分减去商品积分
                  console.log('_points', _points)
                  console.log('allPrice', allPrice)
                  console.log('allp', allp)
                  // console.log('p', p)
                  console.log('use_points', use_points)
                  that.setData({
                    allPrice: allp, //所有价格
                    selectMoren: 1, //点击状态 显示
                    b: acpric, //
                    points: _points, //对话积分更新
                    c: c, //之前定义的总价
                    //_result: result //改变的result
                  })
                  console.log('result', result, 'b', that.data.b)
                } else {
                  // wx.showToast({
                  //   title: '积分不足',
                  // })
                }
              } else {
                wx.showToast({
                  title: '不支持抵扣',
                })
              }
            }

          }
        }
      } else {
        // for(j in result){
        //   var product = result[j].product //商品信息
        //   for (let i in product) {

        //   }
        // }
        let c = that.data.c //之前未使用的价格
        let _result = that.data.jiF
        wx.setStorageSync('allPrice', c)
        console.log('b', 'c', c)
        that.setData({
          selectMoren: 0,
          allPrice: c,
          points: that.data.judge.user.points, //我的全部积分
          c: c,
          //_result: _result
        })
      }
    } else {
      wx.showToast({
        title: '积分不足',
      })
    }
  },
  //结算
  submit(e) {
    let that = this
    let val = e.detail.value
    console.log('val', val)
    let uid = wx.getStorageSync('user').id
    let allprice = that.data.allPrice
    let address = that.data.address
    let carts = that.data.jiF
    var formid = e.detail.formId
    console.log('jiF', carts)
    let phone = that.data.phone
    let name = that.data.name


    let points = parseInt(that.data.judge.user.points) //获取积分
    // let points = 200
    let seller_coin = parseInt(that.data.judge.store.seller_coin) //获取商户比
    // let seller_coin = 22
    console.log('我的奖励金', points, '我的商基金', seller_coin)



    let allpoints = that.data.allpoints //获取抵扣积分积分
    let allSeller_ = parseInt(that.data.allSeller_) //获取抵扣商户币
    console.log('获取抵扣积分积分', allpoints, '获取抵扣商户币', allSeller_)

    let probably = that.data.probably //抵扣

    let reduce_seller = 0 //减少的商基金
    if (that.data.gral == true) { //选择了商基金抵扣
      if (seller_coin < allSeller_) { //我的商基金少于 整个商基金
        reduce_seller = seller_coin
      } else {
        if (seller_coin >= probably) { //我可用的商基金 大于 抵扣
          reduce_seller = probably
        } else {
          reduce_seller = seller_coin - probably
        }
      }
    } else {
      reduce_seller = 0
    }

    let reduce_points = 0 //减少的奖励金
    if (that.data.fix == true) { //选择了 奖励金
      if (points < allpoints) { //我的积分 大于 总积分
        reduce_points = points
        console.log('reduce_points', reduce_points)
      } else {
        if (points >= probably) {
          reduce_points = probably
          console.log('reduce_points', reduce_points)
        } else {
          reduce_points = probably - points
          console.log('reduce_points', reduce_points)
        }
      }
    } else {
      reduce_points = 0
    }

    console.log('减去的积分', reduce_points, '减去商户币', reduce_seller)



    // let reduce_points = allpoints - points //整个积分减去积分
    // if (points < allpoints) {
    //   reduce_points = points
    // }

    // if (seller_coin < allSeller_) {
    //   reduce_seller = seller_coin
    // }
    // let reduce_seller = allSeller_ - seller_coin //整个商户币减去商户比
    // console.log('减少+++++', reduce_points, reduce_seller)





    // console.log('---  carts', carts)
    var goumai = carts
    for (var i = 0; i < goumai.length; i++) {
      var product = goumai[i].product
      for (var j = 0; j < product.length; j++) {
        if (product[j].selected) {
          console.log(product[j].selectd, j)
        } else {
          goumai[i].product[j] = ''
          let arrya = goumai[i].product
          arrya.splice(j, 1)
          // // len--;//删除数组后长度减少
          console.log(arrya)
        }
      }
    }
    for (var g = 0; g < goumai.length; g++) {
      console.log(goumai[g].product.length)
      if (goumai[g].product.length > 0) {

      } else {
        console.log('继续截取', goumai[g])
        goumai.splice(g, 1)

      }
    }
    let a = JSON.stringify(goumai) //carts
    let openid = wx.getStorageSync('user').weixin_openid
    // console.log('goumai', a)
    console.log('uid', uid, 'allprice', allprice, 'carts', carts, 'a', a, 'phone', phone, 'name', name, 'points', points, 'seller_coin', seller_coin)

    if (address != '' && name != '' && phone != '') {
      app.agriknow.buyshopcart(uid, allprice, address, a, phone, name, reduce_points, reduce_seller, 3).then(res => {
        //formid 收集
        app.agriknow.formId(formid, openid, uid).then(res => {
          console.log('fromid收集', res)
        }).catch(err => {
          console.log(err)
        })
        console.log('购物车结算', res)
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
        wx.showToast({
          title: '失败',
        })
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