import { Router } from "express";
import { io } from "../app.js";
import Product from "../dao/models/product.js";

const router = Router();

//CREATE
router.post("/", async (req, res, next) => {
  try {
    const product = req.body;
    let one = await Product.create(product);
    const products = await Product.find();
    io.emit("message", products);
    return res
      .status(201)
      .json({ status: "success", message: "product created", products });
  } catch (error) {
    next(error);
  }
});

//READ ALL
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    let { limit } = req.query;
    return limit ? res.send(products.slice(0, limit)) : res.send(products);
  } catch (error) {
    next(error);
  }
});

//READ ONE BY ID
router.get("/:pid", async (req, res, next) => {
  let { pid } = req.params;
  try {
    const product = await Product.findById(pid);
    return res.send(product);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `product id: ${pid}} not found`,
    });
  }
});

//UPDATE
router.put("/:pid", async (req, res, next) => {
  let { pid } = req.params;
  try {
    let data = req.body;
    let one = await Product.findByIdAndUpdate(pid, data);
    return res.status(200).json({
      success: true,
      message: `movie id: ${one._id} modified`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `movie id: ${pid} not found`,
    });
  }
});

//DELETE
router.delete("/:pid", async (req, res) => {
  let { pid } = req.params;
  try {
    let one = await Product.findByIdAndDelete(pid);
    const products = await Product.find();
    io.emit("message", products);
    return res.status(200).json({
      success: true,
      message: `product id: ${one._id} deleted`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `product id: ${pid} not found`,
    });
  }
});
export default router;
