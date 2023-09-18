import { Router } from "express";
import auth_router from "./auth.router.js";
import cartsRouterDB from "./carts.routerDB.js";
import productsRouterDB from "./products.routerDB.js";
import ProductRouter from "./products.myrouter.js";
import cookies_router from "./cookies.router.js";
import sessions_router from "./sessions.router.js";



const productsR = new ProductRouter();
const products_router = productsR.getRouter();


const router = Router()

router.use("/api/auth", auth_router)
router.use("/api/carts", cartsRouterDB)
//router.use("/api/products", productsRouterDB)
router.use("/api/cookies", cookies_router);
router.use("/api/sessions", sessions_router);
router.use('/api/products', products_router);

export default router;