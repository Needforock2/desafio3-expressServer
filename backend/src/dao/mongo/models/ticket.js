import mongoose, { model, Schema } from "mongoose";

let collection = "tickets";
let schema = new Schema({
  paymentDate: { type: Date, required: true },
  total: { type: Number, required: true },
  sortedProducts: {
    type: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        title: { type: String },
        description: { type: String },
        code: { type: String },
        price: { type: Number },
        status: { type: Boolean },
        stock: { type: Number },
        category: { type: String },
        thumbnails: { type: String },
        owner: { type: String },
        __v: { type: Number },
        quantity: { type: Number },
      },
    ],
  },
  user: {
    type: {
      id: { type: mongoose.Schema.Types.ObjectId },
      first_name: { type: String },
      last_name: { type: String },
      mail: { type: String },
    },
  },
});

const Ticket = model(collection, schema);
export default Ticket;