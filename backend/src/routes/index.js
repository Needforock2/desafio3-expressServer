import { Router } from "express";
import auth_router from "./auth.router.js";
import cartsRouterDB from "./carts.routerDB.js";
import productsRouterDB from "./products.routerDB.js";
import ProductRouter from "./api/products.myrouter.js";
import cookies_router from "./cookies.router.js";
import sessions_router from "./sessions.router.js";
import AuthRouter from "./api/auth.myrouter.js";
import CartsRouter from "./api/carts.myrouter.js";


const productsR = new ProductRouter();
const authR = new AuthRouter()
const cartR = new CartsRouter()


const router = Router();

//router.use("/api/auth", auth_router);
//router.use("/api/carts", cartsRouterDB);
//router.use("/api/products", productsRouterDB)
//router.use("/api/cookies", cookies_router);
router.use("/api/sessions", sessions_router);
router.use("/api/products", productsR.getRouter());
router.use("/api/auth", authR.getRouter()); //router default de users
router.use("/api/carts", cartR.getRouter()) //router default de carts

//router.user('/api/mail') para envio de correo

export default router;
