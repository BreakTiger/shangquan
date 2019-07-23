Page({


  data: {
    list: []
  },


  onLoad: function(options) {
    let item = JSON.parse(options.json)
    this.setData({
      list: item
    })
  }
})