//CAPA DE SERVICIOS
import ProductsRepository from "../repositories/products.rep.js";
export default class ProductsService {
  constructor() {
    this.repository = new ProductsRepository();
  }
  createService(data) {
    let response = this.repository.createRep(data);
    return response;
  }
  readService(query, options) {
    let response = this.repository.readRep(query, options);
    return response;
  }
  readOneService(data) {
    let response = this.repository.readOneRep(data);
    return response;
  }
  updateService(id, data, owner) {
    let response = this.repository.updateRep(id, data, owner);
    return response;
  }
  destroyService(data,owner) {
    let response = this.repository.destroyRep(data,owner);
    return response;
  }
}
