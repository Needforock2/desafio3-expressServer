
import CartsRepository from "../repositories/carts.rep.js";

export default class CartsService {
  constructor() {
    this.repository = new CartsRepository();
  }
  create = (data) => this.repository.create(data);
  read = (cid) => this.repository.read(cid);
  update = (data) => this.repository.update(data);
  updateQty = (data, qty) => this.repository.updateQty(data, qty);
  delete = (data) => this.repository.delete(data);
  deleteAll = (data) => this.repository.deleteAll(data);
  deleteCart = (data) => this.repository.deleteCart(data);
  sumAll = (data) => this.repository.sumAll(data);
}