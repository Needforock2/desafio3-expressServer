//CAPA DE SERVICIOS

import ProductPersistance from "../dao/persistance/products.persistance.js";

export default class ProductsService {
  constructor() {
    this.model = new ProductPersistance();
  }
  createService(data) {
    let response = this.model.createModel(data);
    return response;
  }
  readService(query, options) {
    let response = this.model.readModel(query, options);
    return response;
  }
  readOneService(data) {
    let response = this.model.readOneModel(data);
    return response;
  }
  updateService(id, data) {
    let response = this.model.updateModel(id, data);
    return response;
  }
  destroyService(data) {
    let response = this.model.destroyModel(data);
    return response;
  }
}
