import Tips from './Tips.js';
const baseURL = 'https://circle.didu86.com/mall/';
//const baseURL = 'https://route.didu86.com/machine/';
export default class Http {
  constructor() {

  }

  /**
   * 
   */
  static request(method, url, data) {
    return new Promise((resolve, reject) => {
      let header = this.createAuthHeader();
      if (!data) {
        data = {};
      }

      data.app_id = 'wx4fc77edb4cb4d89b';

      if (wx.getStorageSync('user')) {
        let user = wx.getStorageSync('user');
        data.user_id = user.id;
      }

      if (wx.getStorageSync('device_code')) {
        let device_code = wx.getStorageSync('device_code');
        data.device_code = device_code;
      }

      if (method.toUpperCase() == 'POST') {
        header = Object.assign(header, {
          'content-type': 'application/x-www-form-urlencoded'
        });
      }

      wx.request({
        url: baseURL + url,
        method: method,
        header: header,
        data: data,
        success: (res) => {
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            reject(res)
          } else {
            const wxData = res.data;
            const code = wxData.code;
            if (code != 0) {
              if (code == 403) {
                wx.reLaunch({
                  url: '/pages/customer/login/login',
                })
              }
              reject(wxData);
            } else {
              const serverData = wxData.data;
              resolve(serverData);
            }
          }
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  }

  static createAuthHeader() {
    var header = {};
    if (wx.getStorageSync('token') != '') {
      header.Authorization = 'Bearer ' + wx.getStorageSync('token');
    }
    return header;
  }

  static upload(url, file, data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        data = {};
      }

      data.app_id = 'wx22989ec61e3a7264';

      if (wx.getStorageSync('user')) {
        let user = wx.getStorageSync('user');
        data.user_id = user.id;
      }

      if (wx.getStorageSync('device_code')) {
        let device_code = wx.getStorageSync('device_code');
        data.device_code = device_code;
      }

      wx.uploadFile({
        url: baseURL + url,
        filePath: file,
        name: 'files',
        method: 'POST',
        formData: data,
        header: {
          "content-type": "multipart/form-data"
        },
        success: (res) => {
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            console.log('request error', res)
            reject(res)
          } else {
            const wxData = JSON.parse(res.data);
            const code = wxData.code;
            if (code != 0) {
              console.log('logic error', res)
              reject(wxData);
            } else {
              const serverData = wxData.data;
              resolve(serverData);
            }
          }
        },
        fail: (res) => {
          console.log('request error', res)
          reject(res);
        }
      })
    });
  }

  static get(url, data) {
    return this.request("GET", url, data);
  }

  static put(url, data) {
    return this.request("PUT", url, data);
  }

  static post(url, data) {
    return this.request("POST", url, data);
  }

  static patch(url, data) {
    return this.request("PATCH", url, data);
  }

  static delete(url, data) {
    return this.request("DELETE", url, data);
  }
}