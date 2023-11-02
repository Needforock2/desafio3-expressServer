import { Router } from "express";
import Cart from "../dao/mongo/models/cart.js";
import User from "../dao/mongo/models/user.js";
import { io } from "../app.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import passport from "passport";


const router = Router();

//CREATE CART
router.post("/",  passport.authenticate('jwt'),  async (req, res, next) => {
  try {
    const one = await Cart.create(req.body);
    const user= req.user
   //console.log("id del carrito",one.id)
    const cartObjectId = new ObjectId(one.id);
    const carrito = { cart: cartObjectId };
  //  console.log("carrito", carrito)
    user.cart.push(carrito)
    
    const usuario = await User.updateOne({ _id: user.id }, user );

    return res.status(201).json({
      success: true,
      message: `cart created with id: ${one.id}`,
      cid: one.id,
    });
  } catch (error) {
    next(error);
  }
});

//READ CART
router.get("/:cid", async (req, res) => {
  let { cid } = req.params;
  try {
    const cart = await Cart.find({ _id: cid });
    //Ordenamos los productos en base a Title
    const sortedProducts = cart[0].products.sort((a, b) =>
      a.product.title.localeCompare(b.product.title)
    );
    return res.status(200).send(sortedProducts);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `cart id: ${cid} not found`,
    });
  }
});

//UPDATE CART WITH A PRODUCT
router.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt"),
  async (req, res, next) => {
    let { cid, pid } = req.params;
    try {
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
      io.emit("cart", cart);
      return res.status(200).json({
        success: true,
        message: `cart id: ${cid} modified`,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `cart id: ${cid} not found`,
      });
    }
  }
);

//ACTUALIZAR LA CANTIDAD DE UN PRODUCTO
router.put("/:cid/products/:pid", async (req, res, next) => {
  let { cid, pid } = req.params;
  let {qty} =req.body

  try {
    const cart = await Cart.findOne({ _id: cid });
    const productObjectId = new ObjectId(pid);
    const productoExistente = cart.products.find(
      (item) => item.product.toString() === productObjectId.toString()
    );

    if (productoExistente) {
      //Si el producto existe en el cerrito le sumamos la cantidad
      productoExistente.quantity = qty ;
    } else {
      //sino, lo agregamos con cantidad 1
      const product = { product: productObjectId, quantity: qty };
      cart.products.push(product);
    }
    await Cart.updateOne({ _id: cid }, cart);
    io.emit("cart", cart);
    return res.status(200).json({
      success: true,
      message: `cart id: ${cid} modified`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `cart id: ${cid} not found`,
    });
  }
});


//ELIMINAR UN PRODUCTO DE UN CARRITO
router.delete("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  try {
    const cart = await Cart.findOne({ _id: cid });
    const productObjectId = new ObjectId(pid);
    const result = await Cart.updateOne(
      { _id: cid },
      { $pull: { products: { product: productObjectId } } }
    )

    io.emit("cart", cart);
    return res.status(200).json({
      success: true,
      message: `cart id: ${cid} modified`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `cart id: ${cid} not found`,
    });
  }
});

//ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO

router.delete("/:cid", async (req, res, next) => {
  let { cid } = req.params;
  try {
    const cart = await Cart.findOne({ _id: cid });
    cart.products = [];
    await Cart.updateOne({ _id: cid }, cart);
    return res.status(200).send(cart.products);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `cart id: ${cid} not found`,
    });
  }
});

//LEER EL TOTAL A PAGAR EN UN CARRITO
router.get("/bills/:cid", async (req, res, next) => {
  let { cid } = req.params
  try {
    let cart = await Cart.aggregate([
      {
        $match: { _id: new ObjectId(cid) },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: { //mergeamos los datos de products con el del carrito
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

    return res.status(200).json(cart[0])
    
  } catch (error) {
     return res.status(400).json({
       success: false,
       message: `cart id: ${cid} not found`,
     });
  }
})

export default router;
