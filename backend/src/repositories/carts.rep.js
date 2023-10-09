import dao from "../dao/factory.js";
import CartDto from "../dto/carts.dto.js";

const { Cart } = dao;
export default class CartsRepository {
  constructor() {
    this.model = new Cart();
  }
  create = (data) => {
    let dataDto = new CartDto(data);
    return this.model.createModel(dataDto);
  };
  read = (cid) => this.model.readModel(cid);
  update = (data) => this.model.updateModel(data);
  updateQty = (data, qty) => this.model.updateQtyModel(data, qty);
  delete = (data) => this.model.deleteModel(data);
  deleteAll = (data) => this.model.deleteAllModel(data);
  deleteCart = (data) => this.model.deleteCart(data);
  sumAll = (data) => this.model.sumAllModel(data);
}
