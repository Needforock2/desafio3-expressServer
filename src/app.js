import express from "express";
import ProductManager from "./ProductManager.js"

const manager = new ProductManager("src/products.json");

const app = express();
app.use(express.urlencoded({extended: true}))

app.get("/products", async (req, res) => {
  const products = await manager.getProducts()
  let { limit } = req.query;
  limit ? res.send(products.slice(0, limit)) : res.send(products); 
});

app.get("/products/:pid", async (req, res) => {
  let {pid} = req.params
  const product = await manager.getProductById(Number(pid))
  res.send(product);
});


app.listen(8080, () => console.log("server up in 8080"));
