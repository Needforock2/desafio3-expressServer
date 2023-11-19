
import Cart from "./models/cart.js";
import { ObjectId } from "mongodb";

export default class CartPersistance {
  constructor() {}
  //create
  async createModel(data) {
    const one = await Cart.create(data);
    return {
      success: true,
      message: `cart created with id: ${one._id}`,
      cid: one._id,
    };
  }
  
  // READ
  async readModel(cid) {
    const cartT = await Cart.find({ _id: cid })

    //Ordenamos los productos en base a Title
    const sortedProducts = cartT[0].products.sort((a, b) =>
      a.product.title.localeCompare(b.product.title)
    );
    const cart = await Cart.aggregate([
      { $match: { _id: new ObjectId(cid) } },
      { $unwind: "$products" },
      {
        $lookup: {
          //mergeamos los datos de products con el del carrito
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productsData", //lo guardamos aqui
        },
      },
      {
        $unwind: "$productsData", // Desglosar el array de productos resultante
      },
      {
        $addFields: {
          productTotal: {
            $multiply: ["$productsData.price", "$products.quantity"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalAmount: { $sum: "$productTotal" },
          products: { $push: "$productsData" },
          quantity: { $push: "$products.quantity" },
        },
      },
      {
        $project: {
          _id: "$_id",
          total: "$totalAmount",
          date: new Date(),
          sortedProducts: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  {
                    quantity: {
                      $arrayElemAt: [
                        "$quantity",
                        { $indexOfArray: ["$products", "$$product"] },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);
     return {
       cart: cart[0]

    };
  }



  //Update Cart with product

  async updateModel(data) {
    let { cid, pid } = data;
    console.log(cid)
    const cart = await Cart.findOne({ _id: cid });
    const productObjectId = new ObjectId(pid);
    const productoExistente = cart.products.find(
      (item) => item.product.toString() === productObjectId.toString()
    );

    if (productoExistente) {
      //Si el producto existe en el cerrito le sumamos la cantidad
      productoExistente.quantity += 1;
    } else {
      //sino, lo agregamos con cantidad 1
      const product = { product: productObjectId, quantity: 1 };
      cart.products.push(product);
    }
    await Cart.updateOne({ _id: cid }, cart);
    return {
      success: true,
      message: `cart id: ${cid} modified`,
    };
  }

  //UPDATE THE QUANTITY OF A PRODUCT IN THE CART

  async updateQtyModel(data, qty) {
    let { cid, pid } = data;
    const cart = await Cart.findOne({ _id: cid });
    const productObjectId = new ObjectId(pid);
    const productoExistente = cart.products.find(
      (item) => item.product.toString() === productObjectId.toString()
    );
    /*  */
    if (productoExistente) {
      //Si el producto existe en el cerrito le sumamos la cantidad
      productoExistente.quantity = qty;
    } else {
      //sino, lo agregamos con cantidad 1
      const product = { product: productObjectId, quantity: qty };
      cart.products.push(product);
    }
    await Cart.updateOne({ _id: cid }, cart);
    return {
      success: true,
      message: `cart id: ${cid} modified`,
    };
  }

  //DELETE ONE PRODUCT FROM THE CART
  async deleteModel(data) {
    let { cid, pid } = data;
    const cart = await Cart.findOne({ _id: cid });

    const productObjectId = new ObjectId(pid);
    const result = await Cart.updateOne(
      { _id: cid },
      { $pull: { products: { product: productObjectId } } }
    );
    return {
      success: true,
      message: `cart id: ${cid} modified`,
    };
  }

  
  //DELETE ALL PRODUCTS FROM THE CART
  async deleteAllModel(data) {
    let { cid } = data;
    const cart = await Cart.findOne({ _id: cid });
    cart.products = [];
    await Cart.updateOne({ _id: cid }, cart);
    return {
      success: true,
      message: `cart id: ${cid} cleared`,
    };
  }

  //DELETE ONE CART

  async deleteCart(data) {
    let { cid } = data;
    const totalAmount= await this.sumAllModel(cid)
    const cartAgg = await Cart.aggregate([
      { $match: { _id: new ObjectId(cid) } },
      { $unwind: "$products" },
      {
        $lookup: {
          //mergeamos los datos de products con el del carrito
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productsData", //lo guardamos aqui
        },
      },
      {
        $unwind: "$productsData", // Desglosar el array de productos resultante
      },
      {
        $addFields: {
          productTotal: {
            $multiply: ["$productsData.price", "$products.quantity"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalAmount: { $sum: "$productTotal" },
          products: { $push: "$productsData" },
          quantity: { $push: "$products.quantity" },
        },
      },
      {
        $lookup: {
          //mergeamos los datos de user con el del carrito
          from: "users",
          localField: "_id",
          foreignField: "cart",
          as: "user", //lo guardamos aqui
        },
      },
      {
        $project: {
          _id: "$_id",
          user: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$user",
                  as: "userData",
                  in: {
                    id: "$$userData._id",
                    first_name: "$$userData.first_name",
                    last_name: "$$userData.last_name",
                    mail: "$$userData.mail",
                  },
                },
              },
              0,
            ],
          },
          total: "$totalAmount",
          paymentDate: new Date(),
          sortedProducts: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  {
                    quantity: {
                      $arrayElemAt: [
                        "$quantity",
                        { $indexOfArray: ["$products", "$$product"] },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $merge: { into: "tickets" } },
    ]);
    const resp = await Cart.find({ _id: cid });
    const cart = await Cart.deleteOne({ _id: cid });
    
    if (cart.deletedCount === 1) {
      return {
        success: true,
        message: `cart id: ${cid} deleted`,
        cart: resp,
        total: totalAmount
      };
    } else {
      return {
        success: false,
        message: `cart id: ${cid} not found`,
      };
    }
  }

  // SUM the CART TOTAL
  async sumAllModel(data) {
    let cart = await Cart.aggregate([
      { $match: { _id: new ObjectId(data) } },
      { $unwind: "$products" },
      {
        $lookup: {
          //mergeamos los datos de products con el del carrito
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productsData", //lo guardamos aqui
        },
      },
      {
        $unwind: "$productsData", // Desglosar el array de productos resultante
      },
      {
        $addFields: {
          productTotal: {
            $multiply: ["$productsData.price", "$products.quantity"],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalAmount: { $sum: "$productTotal" },
        },
      },
    ]);

    return cart[0];
  }
}
