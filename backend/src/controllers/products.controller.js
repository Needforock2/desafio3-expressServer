//Capa controladora

import ProductsService from "../services/products.service.js";

export default class ProductsController {
  constructor() {
    this.service = new ProductsService();
  }
  createController(data) {
    let response = this.service.createService(data);
    return response;
  }
  readController(query, options) {
    let response = this.service.readService(query, options);
    return response;
  }
  readOneController(data) {
    let response = this.service.readOneService(data);
    return response;
  }
  updateController(id, data, owner) {
    let response = this.service.updateService(id, data, owner);
    return response;
  }
  destroyController(data, owner) {
    let response = this.service.destroyService(data, owner);
    return response;
  }
}
