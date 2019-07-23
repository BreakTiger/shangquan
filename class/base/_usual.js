const app = getApp()
export default class usual {
  static sum(shopData) {
    new Promise((res, rej) => {
      var that = this
      let allPrice = 0
      // console.log(shopData)
      for (let i = 0; i < shopData.length; i++) {
        let produce = shopData[i].product
        // console.log(produce)
        for (let j = 0; j < produce.length; j++) {
          if (produce[j].selected) {
            allPrice += produce[j].price * 1000 * produce[j].num / 1000
          }
        }
      }
      console.log('allPrice', allPrice)
      var x = String(allPrice).indexOf('.') + 1;   //小数点的位置
      var y = String(allPrice).length - x;  //小数的位数
      if (y > 0) {
        console.log('2 ', allPrice.toFixed(2))
        wx.setStorageSync('allPrice', allPrice.toFixed(2))
      }else{
        wx.setStorageSync('allPrice', allPrice)
      }
      // return jiesuan
    }) 
  }
  static selectAll(shopData) {
    return new Promise ((res,rej) => {
      //遍历所有商品，将选中状态改为false
      //一进页面即全为选中状态
        var that = this
        for (let i = 0; i < shopData.length; i++) {
          let datashop = shopData[i].product
          for (let i in datashop) {
            datashop[i].selected = false
          }
        }
    })
  }
}
