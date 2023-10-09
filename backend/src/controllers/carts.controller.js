import CartsService from "../services/carts.service.js";

export default class CartsController {
  constructor() {
    this.service = new CartsService();
  }
  create = (data) => this.service.create(data);
  read = (cid) => this.service.read(cid);
  update = (data) => this.service.update(data);
  updateQty = (data, qty) => this.service.updateQty(data, qty);
  delete = (data) => this.service.delete(data);
  deleteAll = (data) => this.service.deleteAll(data);
  deleteCart = (data) => this.service.deleteCart(data);
  sumAll = (data) => this.service.sumAll(data);
}