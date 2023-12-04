import Product from "./models/product.js";

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
    console.log(query)
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
  async updateModel(id, data, owner) {
    try {
      if (owner.role === 1) {
        let one = await Product.findByIdAndUpdate(id, data);
        if (one) {
          return {
            success: true,
            message: `product id: ${one._id} modified`,
          };
        } else {
          return null;
        }
      } else {
        let one = await Product.findById(id);
        if (one) {
          if (one.owner === owner.mail) {
            await Product.findOneAndUpdate(
              { _id: id, owner: owner.mail },
              data
            );
            return {
              success: true,
              message: `product id: ${one._id} modified`,
            };
          } else {
            return {
              success: false,
              message: "no authorized",
            };
          }
        } else {
          return null;
        }
      }
    } catch (error) {
      return error;
    }
  }
  async destroyModel(id, owner) {
    try {
      if (owner.role === 1) {
        let one = await Product.findByIdAndDelete(id);
        if (one) {
          return {
            success: true,
            message: `product id: ${one._id} deleted`,
          };
        } else {
          return null;
        }
      } else {
        let one = await Product.findById(id);
        if (one) {
          if (one.owner === owner.mail) {
           await Product.findOneAndDelete({_id: id});
            return {
              success: true,
              message: `product id: ${one._id} deleted`,
            };
          } else {
            return {
              success: false,
              message: "no authorized",
            };
          }
        } else {
          return null;
        }
      }
    } catch (error) {
      return error;
    }
  }
}
