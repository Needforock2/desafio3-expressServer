import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";



const manager = new ProductManager("src/files/products.json");
const router = Router();


router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('index', {
        products
    })
})

router.get("/realtimeproducts", async (req, res) => {
 
  res.render("realTimeProducts")
});



export default router;