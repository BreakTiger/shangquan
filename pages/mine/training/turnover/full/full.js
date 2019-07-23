const Charts = require('../../../../../class/utils/wxcharts1.js')
var app = getApp();
const request = require('../../../../../class/api/_request.js')
import Tips from '../../../../../class/utils/Tips.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '', //年
    userid: '', //用户id
    money: [], //全年gege钱、
    month: [],
    sum_money: '' //总齐纳书
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let date_ = new Date();
    let year = date_.getFullYear();
    this.setData({
      year: year
    })

    // let hpUrl = app.globalData.hpUrl;
    // let month = [];
    // let money = [];
    // let url = hpUrl + 'year_count?userid=' + 8 + '&&year=' + year;
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear(); //年
    //月
    let month = [];
    let money = [];
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let store_id = app.globalData.shop.id
    app.agriknow.shop_money(store_id, year, M).then(res => {
      console.log('统计图', res)
      let price = res.data.data.turnover
      if (res.data.code == 0) {
        let datas = res.data.data;
        let all = Y + '-' + M
        console.log('all', all)
        month.push(all);
        money.push(price)
        // datas.forEach(e => {
        //   month.push(e.month);
        //   money.push(e.money)
        //   let sum_money = 0;
        //   sum_money += e.money
        //   console.log(sum_money)
        //   this.setData({
        //     sum_money: sum_money
        //   })
        // })
        new Charts({
          canvasId: 'stock',
          type: 'column',
          categories: month,
          series: [{
            name: '成交量1',
            color: '#FF4427',
            data: money
          }],
          yAxis: {
            title: '营业额',
            format: function(val) {
              return val;
            },
            min: 0,
            max: 3000
          },

          width: 320,
          height: 175,
        });
      } else {
        Tips.alert('未找到数据')
      }
    }).catch(err => {
      console.log(err)
    })

    // request.sendRequest(url, 'get', '', {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // }).then(res => {
    //   console.log('resss', res)
    //   if (res.data.code == 200) {
    //     let datas = res.data.data;
    //     console.log('获取书画家', datas)
    //     datas.forEach(e => {

    //       month.push(e.month);
    //       money.push(e.money)
    //       let sum_money = 0;
    //       sum_money += e.money
    //       console.log(sum_money)
    //       this.setData({
    //         sum_money: sum_money
    //       })
    //     })
    //     new Charts({
    //       canvasId: 'stock',
    //       type: 'column',
    //       categories: month,
    //       series: [{
    //         name: '成交量1',
    //         color: '#FF4427',
    //         data: money
    //       }],
    //       yAxis: {
    //         title: '营业额',
    //         format: function (val) {
    //           return val;
    //         },
    //         min: 0,
    //         max: 3000
    //       },

    //       width: 320,
    //       height: 175,
    //     });
    //   }
    //   else {
    //     Tips.alert('未找到数据')
    //   }
    // })

    // console.log('huoqud',month,money)

  },
  //上一年
  left() {
    let years = this.data.year;
    years -= 1
    this.setData({
      year: years
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear(); //年
    //月
    let month = [];
    let money = [];
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let store_id = app.globalData.shop.id
    app.agriknow.shop_money(store_id, years, M).then(res => {
      console.log('统计图', res)
      let price = res.data.data.turnover
      if (res.data.code == 0) {
        let datas = res.data.data;
        let all = Y + '-' + M
        console.log('all', all)
        month.push(all);
        money.push(price)
        // datas.forEach(e => {
        //   month.push(e.month);
        //   money.push(e.money)
        //   let sum_money = 0;
        //   sum_money += e.money
        //   console.log(sum_money)
        //   this.setData({
        //     sum_money: sum_money
        //   })
        // })
        new Charts({
          canvasId: 'stock',
          type: 'column',
          categories: month,
          series: [{
            name: '成交量1',
            color: '#FF4427',
            data: money
          }],
          yAxis: {
            title: '营业额',
            format: function(val) {
              return val;
            },
            min: 0,
            max: 3000
          },

          width: 320,
          height: 175,
        });
      } else {
        Tips.alert('未找到数据')
      }
    }).catch(err => {
      console.log(err)
    })
    // let userid = this.data.userid
    // let hpUrl = app.globalData.hpUrl;
    // let month = [];
    // let money = [];
    // let url = hpUrl + 'year_count?userid=' + userid + '&&year=' + years;
    // request.sendRequest(url, 'get', '', {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // }).then(res => {
    //   console.log('resss', res)
    //   if (res.data.code == 200) {
    //     let datas = res.data.data;
    //     console.log('获取书画家', datas)
    //     datas.forEach(e => {

    //       month.push(e.month);
    //       money.push(e.money)
    //       // this.setData({
    //       //   month:month,
    //       //   money:money
    //       // })
    //       let sum_money = 0;
    //       sum_money += e.money
    //       console.log(sum_money)
    //       this.setData({
    //         sum_money: sum_money
    //       })
    //     })
    //     new Charts({
    //       canvasId: 'stock',
    //       type: 'column',
    //       categories: month,
    //       series: [{
    //         name: '成交量1',
    //         color: '#FF4427',
    //         data: money
    //       }],
    //       yAxis: {
    //         title: '营业额',
    //         format: function(val) {
    //           return val;
    //         },
    //         min: 0,
    //         max: 3000
    //       },

    //       width: 320,
    //       height: 175,
    //     });
    //   } else {
    //     Tips.alert('未找到数据')
    //   }
    // })

  },

  //上一年
  right() {
    let years = this.data.year;
    years += 1
    this.setData({
      year: years
    })
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear(); //年
    //月
    let month = [];
    let money = [];
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let store_id = app.globalData.shop.id
    app.agriknow.shop_money(store_id, years, M).then(res => {
      console.log('统计图', res)
      let price = res.data.data.turnover
      if (res.data.code == 0) {
        let datas = res.data.data;
        let all = Y + '-' + M
        console.log('all', all)
        month.push(all);
        money.push(price)
        // datas.forEach(e => {
        //   month.push(e.month);
        //   money.push(e.money)
        //   let sum_money = 0;
        //   sum_money += e.money
        //   console.log(sum_money)
        //   this.setData({
        //     sum_money: sum_money
        //   })
        // })
        new Charts({
          canvasId: 'stock',
          type: 'column',
          categories: month,
          series: [{
            name: '成交量1',
            color: '#FF4427',
            data: money
          }],
          yAxis: {
            title: '营业额',
            format: function (val) {
              return val;
            },
            min: 0,
            max: 3000
          },

          width: 320,
          height: 175,
        });
      } else {
        Tips.alert('未找到数据')
      }
    }).catch(err => {
      console.log(err)
    })
    // let userid = this.data.userid
    // let hpUrl = app.globalData.hpUrl;
    // let month = [];
    // let money = [];
    // let url = hpUrl + 'year_count?userid=' + userid + '&&year=' + years;
    // request.sendRequest(url, 'get', '', {
    //   "Content-Type": "application/x-www-form-urlencoded"
    // }).then(res => {
    //   console.log('resss', res)
    //   if (res.data.code == 200) {
    //     let datas = res.data.data;
    //     console.log('获取书画家', datas)
    //     datas.forEach(e => {

    //       month.push(e.month);
    //       money.push(e.money)
    //       // this.setData({
    //       //   month:month,
    //       //   money:money
    //       // })
    //       let sum_money = 0;
    //       sum_money += e.money
    //       console.log(sum_money)
    //       this.setData({
    //         sum_money: sum_money
    //       })
    //     })
    //     new Charts({
    //       canvasId: 'stock',
    //       type: 'column',
    //       categories: month,
    //       series: [{
    //         name: '成交量1',
    //         color: '#FF4427',
    //         data: money
    //       }],
    //       yAxis: {
    //         title: '营业额',
    //         format: function(val) {
    //           return val;
    //         },
    //         min: 0,
    //         max: 3000
    //       },

    //       width: 320,
    //       height: 175,
    //     });
    //   } else {
    //     Tips.alert('未找到数据')
    //   }
    // })

  },

  // function(){
  //    new Charts({
  //         canvasId: 'stock',
  //         type: 'column',
  //         categories: month,
  //         series: [{
  //           name: '成交量1',
  //           color: '#FF4427',
  //           data: money
  //         }],
  //         yAxis: {
  //           title: '营业额',
  //           format: function (val) {
  //             return val;
  //           },
  //           min: 0,
  //           max: 3000
  //         },

  //         width: 320,
  //         height: 175,
  //       });
  // },


  onShow: function() {

  }
})