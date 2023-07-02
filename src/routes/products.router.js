import { Router } from "express";
import ProductManager from "../ProductManager.js";



const manager = new ProductManager("src/products.json");
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
    console.log("producto", product)
    const result = await manager.addProduct(product)
    if (result.status === "error") {
        return res.status(400).send(result);
    } else {
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
      return res.status(200).send(result);
    }
})
export default router
