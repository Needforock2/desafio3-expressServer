import "dotenv/config.js";
import express from "express";
import sessions from "./config/sessions/factory.js";
import compression from "express-compression"
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import Product from "./dao/mongo/models/product.js";
import Cart from "./dao/mongo/models/cart.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import inicializePassport from "./middlewares/passport.js";
import router from "./routes/index.js";
import program from "./config/arguments.js";
import config from "./config/env.js";
import error_handler from "./middlewares/errorHandler.js";
import winston from "./middlewares/winston.js";
import not_found_handler from "./middlewares/not_found_handler.js";
import swaggerOptions from "./config/swagger.js";
import swaggerJSDoc from "swagger-jsdoc"
import { serve, setup } from "swagger-ui-express"
import cluster from "cluster";
import { cpus } from "os";

const numberOfProcess = cpus().length;

const port = program.p;
const environment = program.mode;

const PORT = process.env.PORT || port;
const ready = () => {
  console.log("mode", environment);
  console.log("server ready on port " + PORT);

};




const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${process.env.FRONT_HOST}`); // Reemplaza con tu origen
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

app.use(cookieParser(config.SECRET_COOKIE));
app.use(sessions);

inicializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(winston);
//documentacion --->
const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", serve, setup(specs));
//<---- documentacion
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`));
app.use("/", router);



//! INICIO tests de estress
//operacion simple
app.get("/simple", (req, res) => {
  let counter = 0;
  for (let i = 1; i <= 100; i++) {
    counter = counter + i;
  }
  return res.status(200).json({ counter });
});
//operacion compleja
app.get("/complex", (req, res) => {
  let counter = 0;
  for (let i = 1; i <= 1000000000; i++) {
    counter = counter + i;
  }
  return res.status(200).json({ counter });
});


//!  FIN tests de estress


app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//File System
/* app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); */

//MONGO
//app.use("/api/products", productsRouterDB);
/* app.use("/api/carts", cartsRouterDB);
app.use("/", viewsRouter);
app.use("/api/cookies", cookies_router);
app.use("/api/sessions", sessions_router);
app.use("/api/auth", auth_router); */
app.use(error_handler);
app.use(not_found_handler);
let server=null
if (cluster.isPrimary) {
  console.log("primary")
  for (let i=1; i <= numberOfProcess / 2; i++) {
    cluster.fork()
  }
} else {
  console.log("worker", process.pid);
  server = app.listen(PORT, ready);
}


export const io = new Server(server);
const fetchCart = async (cid) => {
  const cart = await Cart.findById(cid);
  return cart;
};
/* const manager = new ProductManager("src/files/products.json");
const products = await manager.getProducts(); */
const products = await Product.find();
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  io.emit("message", products); // enviamos los productos una vez se conecte el cliente

  socket.on("cartId", async (cid) => {
    const cart = await Cart.findById(cid);
    socket.emit("cart", cart);
  });
  /*
     socket.emit('evento_socket_individual', "este mensaje solo debe recibirlo el socket");

     socket.broadcast.emit ('evento_todos_menos_actual', 'Lo verán todos menos el actual');

     io.emit('evento_todos', 'Este mensaje les llegará a todos los usuarios');
 */
});
