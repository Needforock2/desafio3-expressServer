import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { io } from "../app.js";


const manager = new ProductManager("src/files/products.json");
const router = Router()


router.get("/", async (req, res) => {
  const products = await manager.getProducts()
  let { limit } = req.query;
  limit ? res.send(products.slice(0, limit)) : res.send(products);
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;
  const product = await manager.getProductById(Number(pid));
  res.send(product);
});

router.post("/", async (req, res) => {
    const product = req.body

    const result = await manager.addProduct(product)
    if (result.status === "error") {
        return res.status(400).send(result);
    } else {
      io.emit('message', result.products)
      //console.log("deberia emitir aqui")
        return res.status(200).send(result);
    }
    
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params
    const modification = req.body
    const result = await manager.updateProduct(Number(pid), modification)
    return res.status(200).send(result)
})

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params
    const result = await manager.deleteProduct(Number(pid));
    if (result.status === "error") {
      return res.status(400).send(result);
    } else {
      io.emit("message", result.products);
      return res.status(200).send(result);
    }
})
export default router
