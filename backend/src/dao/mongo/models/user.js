import mongoose, { model, Schema } from "mongoose";

let collection = "users";
let schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  photo: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/17/17004.png",
  },
  mail: { type: String, unique: true, index: true, required: true },
  age: { type: Number },
  role: { type: Number, default: 0 },
  password: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    default: null
  },
});

schema.pre("find", function () {
  this.populate("cart");
});

let User = model(collection, schema);
export default User;
