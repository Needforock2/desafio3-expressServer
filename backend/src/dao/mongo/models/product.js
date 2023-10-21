import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let collection = "products";
let schema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: String},
});
schema.plugin(mongoosePaginate);

const Product = model(collection, schema);
export default Product;