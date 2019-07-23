import request from './request.js'
class agriknow {
  constructor() {
    this._baseUrl = 'https://circle.didu86.com/'
    this._defaultHeader = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }
  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  // 入驻配置信息 图片 文字
  admission() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_conf', '').then(res => res.data)
  }

  //入驻
  join_admission(sname, uname, sid, time, area, uid, password, lat, lon) {
    let data = {
      store_name: sname,
      store_user_name: uname,
      sc_id: sid,
      business_time: time,
      address: area,
      user_id: uid,
      password: password,
      lat: lat,
      lon: lon
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.store_apply', data).then(res => res)
  }

  //经营类型
  BusinessType() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.sc', '').then(res => res.data)
  }

  //店铺详情
  shopDeatil(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_detail', data).then(res => res)
  }

  //商家修改
  modify_shop(store_name, uname, sid, time, area, uid, is_invoice, summary, lat, lon) {
    let data = {
      store_name: store_name,
      store_user_name: uname,
      sc_id: sid,
      business_time: time,
      address: area,
      user_id: uid,
      is_invoice: is_invoice,
      summary: summary,
      lat: lat,
      lon: lon
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.store_apply', data).then(res => res)
  }

  //查询配送方式
  seeCourier() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.courier', '').then(res => res)
  }

  //设置开店状态
  setUp(uid, num) {
    let data = {
      user_id: uid,
      status: num
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.conf_status', data).then(res => res)
  }

  //设置配送方式和配送费
  conf_courier(uid, cid, money) {
    let data = {
      user_id: uid,
      courier_id: cid,
      courier_fee: money
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.conf_courier', data).then(res => res)
  }

  //查询我的余额
  seeMoney(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/MyUserbalancelog', data).then(res => res)
  }

  //查询商户币明细
  seeMerchant(uid, sid) {
    let data = {
      user_id: uid,
      store_id: sid
    }
    return this._request.postRequest(this._baseUrl + 'mall/MyUserSellerlog', data).then(res => res)
  }

  //查询广告币明细
  seeAdver(uid, sid) {
    let data = {
      user_id: uid,
      store_id: sid
    }
    return this._request.postRequest(this._baseUrl + 'mall/MyUserAdvlog', data).then(res => res)
  }

  //查询广告币充值套餐
  adverCueernt() {
    return this._request.getRequest(this._baseUrl + 'mall/selectadvpackage', '').then(res => res)
  }

  //生成订单
  payList(uid, money, _type, sid, num) {
    let data = {
      user_id: uid,
      money: money,
      type: _type,
      store_id: sid,
      number: num
    }
    return this._request.postRequest(this._baseUrl + 'mall/userchongzhi', data).then(res => res)

  }

  //支付
  pay(total, oid, out_trade_no) {
    let data = {
      total_fee: total,
      openid: oid,
      out_trade_no: out_trade_no
    }
    return this._request.postRequest(this._baseUrl + 'pay/pay', data).then(res => res)
  }

  //百货页面查询商品
  mall() {
    return this._request.getRequest(this._baseUrl + 'mall/selectbaihuo', '').then(res => res)
  }

  //百货点击商品进入详情
  mallDetail(id, uid) {
    let data = {
      id: id,
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/storeproductdetail', data).then(res => res)
  }

  //查询积分明细
  integral(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/MyUserpoints', data).then(res => res)
  }

  //进入店铺
  intoShop(sid) {
    let data = {
      store_id: sid
    }
    return this._request.getRequest(this._baseUrl + 'mall/findstoreanduser', data).then(res => res)
  }

  //商品添加
  addShop(gname, mprice, price, sid, sales_method, stock, is_member, is_points, product_body, product_spec, product_category, freight) {
    let data = {
      goods_name: gname,
      market_price: mprice,
      price: price,
      store_id: sid,
      sales_method: sales_method,
      stock: stock,
      is_member: is_member,
      is_points: is_points,
      product_body: product_body,
      product_spec: product_spec,
      product_category: product_category,
      freight: freight
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.goods_apply', data).then(res => res)
  }

  //查询我的店铺轮播推广
  getBanner(sid) {
    let data = {
      store_id: sid
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectmystoreslider', data).then(res => res)
  }

  //商品分类列表
  getGood() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.goods_category', '').then(res => res)
  }

  //点击店铺进入商品列表
  goods(sid, page) {
    let data = {
      store_id: sid,
      page: page
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_goods_list', data).then(res => res)
  }

  //添加轮播图推广
  addbanner(uid, sid, t, position, month, money, province, city, county, content) {
    let data = {
      user_id: uid,
      store_id: sid,
      title: t,
      position: position,
      month: month,
      money: money,
      province: province,
      city: city,
      county: county,
      content: content
    }
    return this._request.postRequest(this._baseUrl + 'mall/addmystoreslider', data).then(res => res)
  }

  //推广计算价格
  money(t, month, area) {
    let data = {
      type: t,
      month: month,
      position: area
    }
    return this._request.postRequest(this._baseUrl + 'mall/selectpromotionmoney', data).then(res => res)
  }

  //店铺推广
  shop_Extension(sid, month, money) {
    let data = {
      store_id: sid,
      month: month,
      money: money
    }
    return this._request.postRequest(this._baseUrl + 'mall/setstorepromotion', data).then(res => res)
  }

  //查询推广轮播内容
  slider(slider_id) {
    let data = {
      slider_id: slider_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/findslidercontent', data).then(res => res)
  }

  //查询本店铺上线产品
  getOnline(store_id) {
    let data = {
      store_id: store_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectmystoreonlineproduct', data).then(res => res)
  }

  //添加轮播图内容产品详情
  addsliderproduct(other_id, title, content, product_id) {
    let data = {
      other_id: other_id,
      title: title,
      content: content,
      product_id: product_id
    }
    return this._request.postRequest(this._baseUrl + 'mall/addsliderproduct', data).then(res => res)
  }

  //修改推广轮播 内容
  modify(other_id, title, content) {
    let data = {
      other_id: other_id,
      title: title,
      content: content
    }
    return this._request.postRequest(this._baseUrl + 'mall/editslidercontent', data).then(res => res)
  }

  //删除轮播图内容产品详情
  deletesliderproduct(product_id) {
    let data = {
      product_id: product_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/deletesliderproduct', data).then(res => res)
  }

  //查看我的推广产品
  getpro(store_id) {
    let data = {
      store_id: store_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectmystoreproductpromotion', data).then(res => res)
  }

  //查询各版块轮播
  getSliser(province, city, county, position, up) {
    let data = {
      province: province,
      city: city,
      county: county,
      position: position,
      up: up
    }
    return this._request.postRequest(this._baseUrl + 'mall/selectplateslider', data).then(res => res)
  }

  //搜索产品
  searchShop(store_id) {
    let data = {
      store_id: store_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectmystoreproducthz', data).then(res => res)
  }

  //添加产品推广
  addSpread(month, goods, money, uid) {
    let data = {
      month: month,
      goods: goods,
      money: money,
      user_id: uid
    }
    return this._request.postRequest(this._baseUrl + 'mall/payadvcoinpromotionproduct', data).then(res => res)
  }

  //添加产品推广
  addSpread_(month, goods, money, uid, t) {
    let data = {
      month: month,
      goods: goods,
      money: money,
      user_id: uid,
      type: t
    }
    return this._request.postRequest(this._baseUrl + 'mall/payadvcoinpromotionproduct', data).then(res => res)
  }

  //百货页面搜索
  mallSearch(key) {
    let data = {
      key: key
    }
    return this._request.getRequest(this._baseUrl + 'mall/sousuobaihuoproduct', data).then(res => res)
  }

  //查询购物车商品 
  shoppingCart(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectcartproduct', data).then(res => res)
  }

  //点击店铺进入店铺详情
  getShopDetail(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_detail', data).then(res => res)
  }

  //百货商品加入购物车
  add_car(pid, num, uid, sid) {
    let data = {
      product_id: pid,
      number: num,
      user_id: uid,
      sku_id: sid
    }
    return this._request.postRequest(this._baseUrl + 'mall/joinproductcart', data).then(res => res)
  }

  //删除购物车
  deletecart(cart_id) {
    let data = {
      cart_id: cart_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/deletecart', data).then(res => res)
  }

  //购物车商品增加
  pluscartproduct(cart_id) {
    let data = {
      cart_id: cart_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/pluscartproduct', data).then(res => res)
  }

  //购物车商品减少
  less(cart_id) {
    let data = {
      cart_id: cart_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/lesscartproduct', data).then(res => res)
  }

  //判断用户是否是商户
  ifelse(user_id) {
    let data = {
      user_id: user_id
    }
    return this._request.getRequest(this._baseUrl + 'mall/userisstore', data).then(res => res)
  }

  //使用积分抵扣
  indefinite(goods, uid) {
    let data = {
      goods: goods,
      user_id: uid
    }
    return this._request.postRequest(this._baseUrl + 'mall/usepointsdeduction', data).then(res => res)
  }

  //商户币抵扣
  currency(goods, seller_coin) {
    let data = {
      goods: goods,
      seller_coin: seller_coin
    }
    return this._request.postRequest(this._baseUrl + 'mall/usesellercoindeduction', data).then(res => res)
  }

  //购物车结算
  buyshopcart(uid, allprice, address, carts, phone, name, points, seller_coin, type) {
    let data = {
      user_id: uid,
      allprice: allprice,
      address: address,
      carts: carts,
      phone: phone,
      name: name,
      points: points,
      seller_coin: seller_coin,
      types: type //baihuo
    }
    return this._request.postRequest(this._baseUrl + 'mall/buyshopcart', data).then(res => res)
  }

  //商品直接购买 
  nowBuy(product_id, user_id, allprice, address, num, store_id, points, sku_id, seller_cion, phone, name, type, beizhu) {
    let data = {
      product_id: product_id,
      user_id: user_id,
      allprice: allprice,
      address: address,
      number: num,
      store_id: store_id,
      points: points,
      sku_id: sku_id,
      seller_cion: seller_cion,
      phone: phone,
      name: name,
      types: type, //baihuo,
      beizhu: beizhu
    }
    return this._request.postRequest(this._baseUrl + 'mall/nowbuy', data).then(res => res)
  }

  //商品上架下架
  down(gid, status) {
    let data = {
      goods_id: gid,
      status: status //改变状态  0下架 1上架
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.product_up_down', data).then(res => res)
  }

  down_(gid, status) {
    let data = {
      goods_id: gid,
      status: status, //改变状态  0下架 1上架
      type: 1
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.product_up_down', data).then(res => res)
  }


  //购买橱窗
  pay_window(sid, num, money) {
    let data = {
      store_id: sid,
      number: num,
      // month: month,
      money: money
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.showcase_pay', data).then(res => res)
  }

  //计算橱窗购买价格
  windowPrice(store_id, num) {
    let data = {
      // time: time,
      store_id: store_id,
      number: num
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.chow_price', data).then(res => res)
  }

  //查询我的评价
  myComment(sid, page) {
    let data = {
      store_id: sid,
      page: page
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.my_score_list', data).then(res => res)
  }

  //查询我的商品橱窗
  getWindow(sid) {
    let data = {
      store_id: sid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.chow_num', data).then(res => res)
  }

  //查看店铺订单
  seeList(sid) {
    let data = {
      store_id: sid
    }
    return this._request.getRequest(this._baseUrl + 'mall/selectstoreorder', data).then(res => res)
  }

  //店铺设置订单发货
  storesetorderfahuo(order_id, courier_company, shipping_code) {
    let data = {
      order_id: order_id,
      courier_company: courier_company,
      shipping_code: shipping_code
    }
    return this._request.postRequest(this._baseUrl + 'mall/storesetorderfahuo', data).then(res => res)
  }

  //商品修改
  changeShop(gname, mprice, price, sid, sales_method, stock, is_member, is_points, product_body, goods_id, product_spec, product_category, freight) {
    let data = {
      goods_name: gname,
      market_price: mprice,
      price: price,
      store_id: sid,
      sales_method: sales_method,
      stock: stock,
      is_member: is_member,
      is_points: is_points,
      product_body: product_body,
      goods_id: goods_id,
      product_spec: product_spec,
      product_category: product_category,
      freight: freight

    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.goods_apply', data).then(res => res)
  }

  //订单同意退款
  agree(oid) {
    let data = {
      order_id: oid
    }
    return this._request.postRequest(this._baseUrl + 'mall/successordertuikuan', data).then(res => res)
  }

  //订单拒绝退款
  refuse(oid, yuanyin) {
    let data = {
      order_id: oid,
      yuanyin: yuanyin
    }
    return this._request.postRequest(this._baseUrl + 'mall/errorordertuikuan', data).then(res => res)
  }

  //获取用户评分
  getF(sid, page) {
    let data = {
      store_id: sid,
      page: page
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.my_score', data).then(res => res)
  }

  //商铺营业额
  shop_money(sid, year, month, day) {
    let data = {
      store_id: sid,
      year: year,
      month: month,
      day: day
    }
    return this._request.postRequest(this._baseUrl + 'mall/storeturnover', data).then(res => res)
  }

  //商品列表
  getShop_(sid, page) {
    let data = {
      store_id: sid,
      page: page
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.goods_list', data).then(res => res)
  }

  //店铺详情
  seeShop_(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_detail', data).then(res => res)
  }

  //百货点击商品进入详情
  seeMall(id, uid) {
    let data = {
      id: id,
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/storeproductdetail', data).then(res => res)
  }

  //查询店铺详情和产品
  getShop_Product(sid) {
    let data = {
      store_id: sid
    }
    return this._request.getRequest(this._baseUrl + 'mall/findselectstoreproduct', data).then(res => res)
  }

  //获取用户token
  token() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.GainAccessToken', '').then(res => res)
  }

  //获取二维码
  ecode(token, sence) {
    let data = {
      token: token,
      sence: sence
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.GainAccessTokenQrcode', data).then(res => res)
  }

  //查询我的二维码
  getEcode() {

  }

  //商户币兑换广告币
  exchangeadvcoin(sid, seller_coin) {
    let data = {
      store_id: sid,
      seller_coin: seller_coin
    }
    return this._request.postRequest(this._baseUrl + 'mall/exchangeadvcoin', data).then(res => res)
  }

  //删除图片
  del(sid, gid) {
    let data = {
      store_id: sid,
      goods_id: gid
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.img_Del', data).then(res => res)
  }

  //关注
  seePeople(sid, uid, status) {
    let data = {
      store_id: sid,
      user_id: uid,
      status: status
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.store_follow', data).then(res => res)
  }

  //判断用户是不是商家    1=是  0=不是
  select(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/IfUserIsStore', data).then(res => res)
  }

  // 余额提现
  getmoney(uid, balance, username, name, password) {
    let data = {
      user_id: uid,
      balance: balance,
      username: username,
      name: name,
      password: password
    }
    return this._request.postRequest(this._baseUrl + 'mall/balancetixian', data).then(res => res)
  }

  //我的邀请列表
  goJoin(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.my_invitation', data).then(res => res)
  }

  //邀请总积分
  allP(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.user_detail', data).then(res => res)
  }

  //活动入口图片
  HuoD() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.activity_p', '').then(res => res)
  }

  //查询我的二维码
  getMycode(token, uid) {
    let data = {
      token: token,
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.FindMyQrcode', data).then(res => res)
  }

  //获取用户二维码
  postCode(token, user_id) {
    let data = {
      token: token,
      sence: user_id
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.GainAccessTokenQrcodeUser', data).then(res => res)
  }

  //formid收集
  formId(form_id, openid, user_id) {
    let data = {
      formid: form_id,
      openid: openid,
      user_id: user_id
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.form', data).then(res => res)
  }

  //提现提示语
  info() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.tixianshuom', '').then(res => res)
  }

  //忘记密码 手机验证
  phoneCode(phone, uid) {
    let data = {
      mobile: phone,
      user_id: uid,
      zhao: 1
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.sendVerifyCode', data).then(res => res)
  }

  //判断验证码接口
  Verification(uid, phone, code) {
    let data = {
      user_id: uid,
      mobile: phone,
      verifycode: code
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.yanzhengma', data).then(res => res)
  }

  //修改密码
  bindMobile(uid, password) {
    let data = {
      user_id: uid,
      password: password
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.bindMobile', data).then(res => res)
  }

  //百货推荐
  mallbanner() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.baihuo', '').then(res => res)
  }

  //百货 商品分类列表
  mallGoodlist() {
    return this._request.getRequest(this._baseUrl + 'tcshop/store.goods_category', '').then(res => res)
  }

  //查询用户信息
  getUser(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'mall/user_detail', data).then(res => res)
  }

  //商家入驻审核中图片
  getImg() {
    let data = {
      id: 21
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.config_img', data).then(res => res)
  }

  //推广说明
  getText(id) {
    let data = {
      id: id //2=商家入驻海报 21=商家入驻审核中图片 22=首页领取积分 23=小程序授权图片 34=推广说明
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.config_img', data).then(res => res)
  }

  //我的邀请
  myJoin(uid) {
    let data = {
      user_id: uid
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.my_invitation', data).then(res => res)
  }

  //普通用户抽取红包
  envelopes(uid, id) {
    let data = {
      user_id: uid,
      inviter_id: id
    }
    return this._request.postRequest(this._baseUrl + 'tcshop/store.draw', data).then(res => res)
  }

  //查询我发布的活动
  getActiVity(city, page, id) {
    let data = {
      city: city,
      page: page,
      id: id
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.my_activity_list', data).then(res => res)
  }

  //查看活动详情
  activityDetail(id) {
    let data = {
      activity_id: id
    }
    return this._request.getRequest(this._baseUrl + 'tcshop/store.activity_detail', data).then(res => res)
  }

  //商家无法购买自己产品





}
export default agriknow