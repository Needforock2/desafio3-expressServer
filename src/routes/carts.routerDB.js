import { Router } from "express";
import Cart from "../dao/models/cart.js";
import { io } from "../app.js";


const router = Router();


//CREATE CART
router.post("/", async (req, res, next) => {
  try {
    const one = await Cart.create(req.body)
    console.log(one)
     return res.status(201).json({
       success: true,
       message: `cart created with id: ${one.id}`,
     });
  } catch (error) {
    next(error)
  }

});


//READ CART
router.get('/:cid', async (req, res) => {
  let { cid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (req.accepts("html")) {
     
      io.emit("cart", cart.products);
     res.render("realTimeCart");
   } else {
     return res.send(cart.products);     
   }
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `cart id: ${cid} not found`,
    });
  }
})


router.post("/:cid/product/:pid", async (req, res, next) => {
  let { cid, pid } = req.params;  
  
  try {
    const cart = await Cart.findOne({ _id: cid })
    const productoExistente = cart.products.find(
      (item) => item.id === pid
    );
    if (productoExistente) { //Si el producto existe en el cerrito le sumamos la cantidad
      productoExistente.quantity += 1

  
    } else {//sino, lo agregamos con cantidad 1
      const product = { id: pid, quantity: 1 };
      cart.products.push(product)
     
    }
    await Cart.updateOne({ _id: cid }, cart)
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

router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
/*   const result = await cart.deleteProductFromCart(Number(pid), Number(cid));
  if (result.status === "error") {
    return res.status(400).send(result);
  } else {
    return res.status(200).send(result);
  } */
});



export default router;