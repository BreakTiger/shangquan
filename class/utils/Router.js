export default class Router {
  constructor() {}

  nav(path) {
    wx.navigateTo({
      url: path,
    })
  }

  redirect(path) {
    wx.redirectTo({
      url: path,
    })
  }

  switchTab(path) {
    wx.switchTab({
      url: path,
    })
  }

  toBuy(pid) {
    wx.navigateTo({
      url: '/pages/mall/buy/buy?pid=' + pid,
    })
  }

  toHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }

  toOrder(status) {
    wx.navigateTo({
      url: '/pages/customer/order/order?status=' + status,
    })
  }

  toPaySuccess(order_id) {
    wx.redirectTo({
      url: '/pages/customer/paysuccess/paysuccess?order_id=' + order_id
    })
  }

  toApply() {
    wx.navigateTo({
      url: '/pages/distributor/apply/apply',
    })
  }

  toApplyStatus() {
    wx.redirectTo({
      url: '/pages/distributor/apply/applystatus/applystatus',
    })
  }

  toAddProduct() {
    wx.navigateTo({
      url: '/pages/distributor/addproduct/addproduct',
    })
  }

  toAddStock(product) {
    wx.navigateTo({
      url: '/pages/distributor/pickcode/pickcode?product=' + JSON.stringify(product)
    })
  }

  toAddHotel() {
    wx.navigateTo({
      url: '/pages/distributor/addhotel/addhotel',
    })
  }

  toAddDevice() {
    wx.navigateTo({
      url: '/pages/distributor/adddevice/adddevice',
    })
  }

  toSelectDevice(device_code = '') {
    wx.navigateTo({
      url: '/pages/distributor/selectdevice/selectdevice?device_code=' + device_code
    })
  }

  toCash() {
    wx.navigateTo({
      url: '/pages/distributor/cash/cash',
    })
  }

  toCashRecord() {
    wx.navigateTo({
      url: '/pages/distributor/cash/record',
    })
  }

  back(level = 1) {
    wx.navigateBack({
      delta: level
    })
  }
}