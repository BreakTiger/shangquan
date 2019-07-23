Page({


  data: {
    list:[]
  },


  onLoad: function(options) {
    // console.log('options', options)
    let item = JSON.parse(options.json)
    console.log('item', item)
    this.setData({
      list: item
    })
  },



})