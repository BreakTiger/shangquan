const app = getApp()
export default class usual {
  static sum(shopData) {
    new Promise((res, rej) => {
      var that = this
      let jiesuan = 0
      // console.log(shopData)
      for (let i = 0; i < shopData.length; i++) {
        if (shopData[i].selected) {
          jiesuan += shopData[i].price * 1000 * 1 / 1000
          // console.log(jiesuan)
        }
      }
      console.log(jiesuan)
      wx.setStorageSync('jiesuan', jiesuan)
    })
  }
  static selectAll(shopData) {
    return new Promise((res, rej) => {
      //一进页面即全为选中状态
      var that = this
      for (let i = 0; i < shopData.length; i++) {
        let datashop = shopData[i].pro
        console.log('datashop', datashop)
        for (let i in datashop) {
          datashop[i].selected = false
        }
      }
    })
  }
}
