import { Router } from "express";
import auth_router from "./auth.router.js";
import cartsRouterDB from "./carts.routerDB.js";
import productsRouterDB from "./products.routerDB.js";
import ProductRouter from "./api/products.myrouter.js";
import cookies_router from "./cookies.router.js";
import sessions_router from "./sessions.router.js";
import AuthRouter from "./api/auth.myrouter.js";
import CartsRouter from "./api/carts.myrouter.js";
import logger from "../config/logger/logger.js";
import mocking from "../mock/mock.js";
import TicketRouter from "./api/ticket.myrouter.js";
import paymentRouter from "./api/payments.router.js"

const productsR = new ProductRouter();
const authR = new AuthRouter();
const cartR = new CartsRouter();
const TicketR = new TicketRouter()

const router = Router();


router.use("/api/sessions", sessions_router);
router.use("/api/products", productsR.getRouter());
router.use("/api/auth", authR.getRouter()); //router default de users
router.use("/api/carts", cartR.getRouter()); //router default de carts
router.use("/api/ticket", TicketR.getRouter());
router.use("/api/payments", paymentRouter);
router.use("/api/mockingproducts", (req, res, next) => {
    mocking()
    return res.status(200).json({
        success: true,
        message: "productos mockeados"
    })
})
router.use("/api/loggers", (req, res, next) => {
  req.logger = logger;
  req.logger.HTTP(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - HTTP`
  );
  req.logger.INFO(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - INFO`
  );
  req.logger.ERROR(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - ERROR`
  );
  req.logger.FATAL(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - FATAL`
  );
    return res.status(200).json({
        success: true,
        message: "probando los loggers, ver consola del server"
  });
});

//router.user('/api/mail') para envio de correo

export default router;
