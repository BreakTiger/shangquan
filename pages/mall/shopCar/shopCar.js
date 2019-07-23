import modals from '../../../class/base/modal.js'
import usual from "../../../class/base/_usual.js"
var app = getApp();
Page({


  data: {
    shopData: [],
    allPrice: 0,
    CheckAll: true,
    selectAllStatus: true
  },
  // 跳转结算页面
  Settlement() {
    let that = this
    let data = that.data.shopData
    // console.log('shopData', data)
    if (that.data.allPrice == 0) {
      modals.hideLoading('请选择商品')
    } else {
      // let str = JSON.stringify(data);
      var goumai = that.data.shopData //获取购物车所有商品
      console.log('00购物车所有商品,', goumai[0])
      console.log('11', goumai[1])
      for (var i = 0; i < goumai.length; i++) {
        console.log('goumai[i]', goumai[i], i)
        if (goumai[i].store.selected) {
          var product = goumai[i].product
          console.log('product', product)
          for (var j = 0; j < product.length; j++) {
            if (product[j].selected) {
              console.log('product[j].selectd, j', product[j].selected, j)
            } else {
              goumai[i].product[j] = ''
              let arrya = goumai[i].product
              arrya.splice(j, 1)
              // // len--;//删除数组后长度减少
              console.log('arrya', arrya)
            }
          }
        } else {
          goumai.splice(i, 1)
          console.log('店铺减少', i)
        }
      }
      for (var g = 0; g < goumai.length; g++) {
        console.log(goumai[g].product.length)
        if (goumai[g].product.length > 0) {

        } else {
          console.log('继续截取', goumai[g])
          goumai.splice(g, 1)
          console.log('end end end', goumai)
        }
      }
      console.log('最终数据', goumai)
      let _str = JSON.stringify(goumai)
      // console.log('__________________str', _str)
      wx.navigateTo({
        url: '/pages/mall/Settlement/Settlement?data=' + _str,
      })
    }
  },
  //购物车删除
  detele(e) {
    let that = this
    console.log('e', e)
    let index = e.currentTarget.dataset.key
    let item = e.currentTarget.dataset.item
    let cart_id = e.currentTarget.dataset.id //
    console.log('item', item, 'cart_id', cart_id)
    app.agriknow.deletecart(cart_id).then(res => {
      console.log('删除', res)
      this.seeAll();
    }).catch(err => {
      console.log(err)
    })
  },
  //单选
  select: function(e) {
    var that = this
    let allPrice = wx.getStorageSync('allPrice')
    let index = e.currentTarget.dataset.index //父级index
    let id = e.currentTarget.dataset.erji //子元素index
    console.log('父级index', index, '子元素', id)
    let shopData = that.data.shopData
    console.log('shopData', shopData)
    console.log('shopData[index].product[id].selected', shopData[index].product[id].selected)
    shopData[index].product[id].selected = !shopData[index].product[id].selected
    that.setData({
      shopData: shopData
    })
    console.log('单选改变的shopData')
    // 判断是否全部选中，然后更改状态
    let datashop = shopData[index].product
    var arr = []
    for (let i = 0; i < datashop.length; i++) {
      if (datashop[i].selected === true) {
        arr.push(datashop[i])
        console.log('=== true')
      }
      console.log('arr', arr)
    }
    if (arr.length === 0) {
      shopData[index].selected = false
      that.setData({
        shopData: shopData
      })
      console.log('=== 0', that.data.shopData)
    } else if (arr.length === datashop.length) {
      shopData[index].selected = true
      that.setData({
        shopData: shopData
      })
      console.log('arr.length === datashop.length', that.data.shopData)
    }
    usual.sum(shopData)
    allPrice = wx.getStorageSync('allPrice')
    that.setData({
      shopData: shopData,
      allPrice: allPrice
    })
    console.log('单选', that.data.shopData)
  },
  //全选
  selectAll(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log('全选的index', index)
    let shopData = that.data.shopData
    console.log('全选', shopData[index])
    shopData[index].store.selected = !shopData[index].store.selected
    //记录全选状态并将其赋给单选选中状态
    let select = shopData[index].store.selected
    let datashop = shopData[index].product
    for (let i in datashop) {
      datashop[i].selected = select;
    }
    usual.sum(shopData)
    let allPrice = wx.getStorageSync('allPrice')
    that.setData({
      shopData: shopData,
      allPrice: allPrice
    })
    console.log('全选不全选的shopData', that.data.shopData)
  },
  //加减操作
  add(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let cart_id = e.currentTarget.dataset.id //
    console.log('add', index, 'item', item, 'cart_id', cart_id)
    //购物车商品增加
    app.agriknow.pluscartproduct(cart_id).then(res => {
      console.log('添加数量', res.data)
      if (res.data.message == '库存不足') {
        wx.showToast({
          title: '库存不足',
        })
      }
      that.seeAll();
    }).catch(err => {
      console.log(err)
    })

    let shopData = that.data.shopData
    shopData[index].product.num++
      // this.getsumTotal()合计
      // usual.sum(shopData)
      // let jiesuan = wx.getStorageSync('jiesuan', jiesuan)
      that.setData({
        // jiesuan: jiesuan,
        shopData: shopData
      })
  },
  // 购物车减少
  subtraction(e) {
    var that = this
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let cart_id = e.currentTarget.dataset.id //
    let shopData = that.data.shopData
    console.log('add', index, 'item', item, 'cart_id', cart_id)
    console.log('加减', item)
    if (parseInt(item.num) > 1) {
      // shopData[index].num--
      app.agriknow.less(cart_id).then(res => {
        console.log('购物车减少', res)
        that.seeAll();
        console.log('减少', res)
      }).catch(err => {
        console.log(err)
      })

    } else  {
      modals.hideLoading('不能再少了')
    }
    this.seeAll()
    that.setData({
      shopData: shopData
    })
  },
  onLoad: function(options) {
    this.seeAll();
  },
  //查看购物车
  seeAll() {
    let that = this
    let uid = wx.getStorageSync('user').id
    app.agriknow.shoppingCart(uid).then(res => {
      console.log('car', res)
      let result = []
      if (res.data == '') {
        result = []
      } else {
        result = res.data.data
      }
      console.log('result', result)
      usual.sum(result)
      let allPrice = wx.getStorageSync('allPrice')
      that.setData({
        shopData: result,
        allPrice: allPrice
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onShow: function() {
    let that = this
    this.seeAll();
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
        console.log('地址', adss)
        that.setData({
          address: adss,
          name: username,
          phone: phone
        })
        let data = {
          username: username,
          phone: phone,
          ads: adss
        }
        console.log('data', data)
        // 设置缓存
        wx.setStorageSync('address', data)

      }
    })
  },


})