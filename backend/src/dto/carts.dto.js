import crypto from "crypto"; //modulo nativo de nodejs para crear codigos aleatorios
import args from "../config/arguments.js"; //necesito saber la persistencia

export default class CartDto {
  constructor(obj) {
    this.products = obj.products
    if (args.persistance === "FS") {
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.__v = 0;
      this._id = crypto.randomBytes(12).toString("hex");
    }
  }
}
