import crypto from "crypto"; //modulo nativo de nodejs para crear codigos aleatorios
import args from "../config/arguments.js"; //necesito saber la persistencia

export default class ProductDto {
  constructor(obj) {
    this.title = obj.title;
    this.description = obj.description;
    this.code = obj.code;
    this.price = obj.price;
    this.status = obj.status;
    this.stock = obj.stock;
    this.category = obj.category;
    this.thumbnails = obj.thumbnails;
    this.owner = obj.owner
    if (args.persistance === "FS") {
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.__v = 0;
      this._id = crypto.randomBytes(12).toString("hex");
    }
  }
}
