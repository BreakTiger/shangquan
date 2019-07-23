import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class UserApi extends BaseApi {
  constructor() {
    super();
  }

  orderList() {
    return new Pagination('user.order.list');
  }

  orderDetail(order_id) {
    return this.get('user.order.detail', {
      order_id: order_id
    });
  }

  couponList() {
    return new Pagination('user.coupon.list');
  }

  canUsedCouponList(amount) {
    return this.get('user.coupon.can_used_list', {
      'amount': amount
    });
  }

}