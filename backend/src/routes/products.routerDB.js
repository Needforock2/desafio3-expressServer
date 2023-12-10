import { Router } from "express";
import { io } from "../app.js";
import Product from "../dao/mongo/models/product.js";
import auth from "../middlewares/auth.js";
import is_admin from "../middlewares/is_admin.js";
import verify_token from "../middlewares/verify_token.js";
import verify_token_cookies from "../middlewares/verify_token_cookies.js";
import passport from "passport";

const router = Router();

//CREATE
router.post("/", is_admin , passport.authenticate('jwt'), async (req, res, next) => {
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
  const { limit, page, query, title, sort } = req.query;

  const options = {
    limit: limit ? limit : 6,
    page: page ? page : 1,
    sort: sort ? { price: sort } : {},
  };

  let queryObject = {};
  let queryType;
  let queryValue;
  let queryStock;
  if (query) {
    const querySplitted = query.split("=");
    queryType = querySplitted[0] ? querySplitted[0] : null;
    queryValue = querySplitted[1] ? querySplitted[1] : null;

    if (queryType === "stock") {
      queryStock = { $gte: queryValue };
      queryObject[queryType] = queryStock;
    } else {
      queryObject[queryType] = queryValue;
    }
  }
   if (title) {
      queryObject["title"]= { $regex: title, $options: "i"}
    }
  

  try {
    const products = await Product.paginate(query || title ? queryObject : {}, options);
    const {
      docs,
      limit,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = products;
    let nextLink = hasNextPage
      ? `https://cachupines-backend.onrender.com/api/products?limit=${limit}&page=${nextPage}${
          sort ? `&sort=${sort}` : ""
        }${query ? `&query=${queryType}=${queryValue}` : ""}`
      : null;
    let prevLink = hasPrevPage
      ? `https://cachupines-backend.onrender.com/api/products?limit=${limit}&page=${prevPage}${
          sort ? `&sort=${sort}` : ""
        }${query ? `&query=${queryType}=${queryValue}` : ""}`
      : null;

    return res.status(200).json({
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      nextLink,
      prevLink,
    });
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
