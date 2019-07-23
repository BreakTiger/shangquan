import AuthApi from '/class/api/AuthApi.js';
import UserApi from '/class/api/UserApi.js';
import MallApi from '/class/api/MallApi.js';
import StoreApi from '/class/api/StoreApi.js';
import Router from '/class/utils/Router.js';
import agriknow from './class/api/agriknow .js'

const authApi = new AuthApi();

const userApi = new UserApi();
const mallApi = new MallApi();
const storeApi = new StoreApi();
const router = new Router();
import Tips from './class/utils/Tips.js';
const notification = require('./class/utils/WxNotificationCenter.js');

App({
  notification: notification,
  authApi: authApi,
  userApi: userApi,
  mallApi: mallApi,
  storeApi: storeApi,
  router: router,
  onLaunch: function(options) {
    let path = options.path;
    let query = options.query;
    let shareTicket = options.shareTicket;
    // console.log('options', options);
  },
  globalData: {
    userInfo: null,
    api: 'https://circle.didu86.com/',
    imagebox: [],
    shop: [],
    area: [],
    addText: '玩命加载中...',
    endText: '—————  我也是有底线的  —————',
    myInfo: [],
    Scavenging: '',
    isChecked1: true
  },
  agriknow: new agriknow()
})