import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const cart = new CartManager("src/files/carts.json");

const router = Router();

router.post("/", async (req, res) => {

  const result = await cart.createCart();
  if (result.status === "error") {
    return res.status(400).send(result);
  } else {
    return res.status(200).send(result);
  }
});

router.get('/:cid', async (req, res) => {
    let { cid } = req.params
    const result = await cart.getCartById(Number(cid));

    if (result.status === "error") {
      return res.status(400).send(result);
    } else {
      return res.status(200).send(result);
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
 let { cid, pid } = req.params;  
  const result = await cart.addProductToCart(Number(pid), Number(cid));  
  if (result.status === "error") {
    return res.status(400).send(result);
  } else {
    return res.status(200).send(result);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  const result = await cart.deleteProductFromCart(Number(pid), Number(cid));
  if (result.status === "error") {
    return res.status(400).send(result);
  } else {
    return res.status(200).send(result);
  }
});



export default router;