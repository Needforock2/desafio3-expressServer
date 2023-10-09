import mongoose, { model, Schema } from "mongoose";

let collection = "carts";
let schema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1, 
        },
      },
    ],
    default: [],
  },
});

schema.pre("find", function () {
  this.populate("products.product");
});

const Cart = model(collection, schema);
export default Cart;
