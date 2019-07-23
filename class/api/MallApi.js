import BaseApi from './BaseApi.js';
import Pagination from './../utils/Pagination.js';

export default class MallApi extends BaseApi {
  constructor() {
    super();
  }

  navigation() {
    return this.get('navigation.list');
  }
}