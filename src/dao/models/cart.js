import { model, Schema } from "mongoose";

let collection = "carts";
let schema = new Schema({
  products: { type: [Schema.Types.Mixed], default: [] },
});

const Cart = model(collection, schema);
export default Cart;
