import "dotenv/config.js";
import express from "express";
import productsRouterDB from "./routes/products.routerDB.js";
import handlebars from "express-handlebars";
import cartsRouterDB from "./routes/carts.routerDB.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import { connect } from "mongoose";
import Product from "./dao/models/product.js";
import Cart from "./dao/models/cart.js";
import cookies_router from "./routes/cookies.router.js";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import sessions_router from "./routes/sessions.router.js";
import sessionFileStore from "session-file-store";
import MongoStore from "connect-mongo";
import auth_router from "./routes/auth.router.js";

const PORT = 8080;
const ready = () => {
  console.log("server ready on pot " + PORT);
  connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => console.log(err));
};

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Reemplaza con tu origen
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser(process.env.SECRET_COOKIE));
const FileStore = sessionFileStore(expressSession);
app.use(
  expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      ttl: 1000 * 60 * 60 * 24 * 7,
    }),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//File System
/* app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); */

//MONGO
app.use("/api/products", productsRouterDB);
app.use("/api/carts", cartsRouterDB);
app.use("/", viewsRouter);
app.use("/api/cookies", cookies_router);
app.use("/api/sessions", sessions_router);
app.use("/api/auth", auth_router)
const server = app.listen(PORT, ready);

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
