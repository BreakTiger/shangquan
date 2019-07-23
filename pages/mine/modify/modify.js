import modals from '../../../class/base/modal.js'
import Tips from '../../../class/utils/Tips.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatar: ''
  },
  //去绑定手机号
  toBind() {
    modals.navigate('../bingPhone/bingPhone')
  },
  //修改头像
  chooseAvatar: function(e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        console.log('face', tempFilePaths)
        that.setData({
          avatar: tempFilePaths[0]
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let user = wx.getStorageSync('user')
    this.setData({
      userInfo: user
    })
    console.log('user', user)
  },
  loadUser: function() {
    let that = this;
    let user = wx.getStorageSync('user');
    this.setData({
      user: user
    })
  },
  saveUserInfo: function(e) {
    let that = this
    let nickname = e.detail.value.nickname;
    let summary = '';
    let form_id = e.detail.form_id;
    Tips.loading();
    app.authApi.editUserInfo(nickname, summary, form_id, this.data.avatar).then(res => {
    console.log('保存头像',res)
      Tips.loaded();
      Tips.toast('保存成功', function() {
        app.authApi.syncUserInfo().then(() => {
          that.loadUser();
          app.notification.postNotificationName("ON_USER_UPDATE");
        });

      })
    });
  }
})