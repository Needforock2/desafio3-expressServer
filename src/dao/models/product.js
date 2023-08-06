import { model, Schema } from "mongoose";

let collection = "products";
let schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
  thumbnails: {type: [String] }
});

const Product = model(collection, schema)
export default Product
