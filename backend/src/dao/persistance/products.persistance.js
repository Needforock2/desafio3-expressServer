import Product from "../models/product.js";

export default class ProductPersistance {
  constructor() {}
  async createModel(data) {
    let one = await Product.create(data);
    return {
      status: "success",
      message: "product created",
      response: { product_id: one._id },
    };
  }
  async readModel(query, options) {
    const products = await Product.paginate(query, options);
    return products;
  }
  async readOneModel(data) {
    const one = await Product.findById(data);
    if (one) {
      return one;
    } else {
      return null;
    }
    }
    async updateModel(id, data) {
        let one = await Product.findByIdAndUpdate(id, data);
        if (one) {
            return {
              success: true,
              message: `product id: ${one._id} modified`,
            };
        } else {
            return  null
        }
    }
  async destroyModel(data) {
    let one = await Product.findByIdAndDelete(data);
    if (one) {
      return {
        success: true,
        message: `product id: ${one._id} deleted`,
      };
    } else {
        return null
      }
  }
}
