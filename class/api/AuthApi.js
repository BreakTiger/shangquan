import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';
const wxApi = require('./../utils/WxApi.js');
const app = getApp();
export default class AuthApi extends BaseApi {
  constructor() {
    super();
  }

  check() {
    const user = wx.getStorageSync('user');
    if (user == '') {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  }

  getCode() {
    return wxApi.wxLogin().then(res => {
      if (res.code == null || res.code == '') {
        return Promise.reject('登录失败');
      } else {
        return res.code;
      }
    });
  }

  login(code) {
    return this.get('wechat.code_to_session', {
      'code': code
    });
  }

  saveAuthInfo(auth) {
    console.log(auth);
    wx.setStorageSync('auth', auth);
  }

  userInfo() {
    return this.get('user.info');
  }

  syncUserInfo() {
    return this.get('user.info').then(data => {
      wx.setStorageSync('user', data)
    })
  }

  editUserInfo(nickname, summary, formId, avatar) {
    let that = this
    return this.post('user.update.info', {
      nickname: nickname,
      summary: summary,
      form_id: formId
    }).then(res => {
      if (avatar.length > 5) {
        return that.upload('user.update.avatar', avatar);
      } else {
        return Promise.all([]);
      }
    });
  }

  bindMobile(mobile, verifycode) {
    return this.post('user.bind.mobile', {
      mobile: mobile,
      verifycode: verifycode
    });
  }

  sendVerifyCode(mobile) {
    return this.post('user.send.verifycode', {
      mobile: mobile
    });
  }

  saveUserInfo(user) {
    let form_uid = wx.getStorageSync('form_uid')
    console.log('授权存入的 form_id', form_uid)
    let param = {
      'openid': user.openId,
      'nickname': user.nickName,
      'avatar': user.avatarUrl,
      'unionid': '',
      'inviter_id': form_uid
    };
    return this.post('wechat.register', param).then(user => {
      if (user) {
        wx.setStorageSync('user', user);
        wx.setStorageSync('token', user.token);
      } else {
        return Promise.reject('注册失败');
      }
    })

  }

  decryptUserInfo(encryptedData, iv) {
    const auth = wx.getStorageSync('auth');
    const openid = auth.openid;
    const param = {
      encryptedData: encryptedData,
      iv: iv,
      openid: openid
    };
    return this.post('wechat.decrypt', param);
  }

  cleanLoginStatus() {
    wx.removeStorageSync('user');
    wx.removeStorageSync('auth');
    wx.removeStorageSync('token');
  }
}