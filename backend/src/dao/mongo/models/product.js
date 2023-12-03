import mongoose,{ model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let collection = "products";
let schema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  code: { type: String, unique: false },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: String },
  owner: { type: String, required: true, default:"admin" },
});
schema.plugin(mongoosePaginate);

const Product = model(collection, schema);
export default Product;
