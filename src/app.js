import express from "express";
import productsRouter from './routes/products.router.js'
import handlebars from "express-handlebars";
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import __dirname from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(express.static(`${__dirname}/public`));


app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


app.use('/api/products', productsRouter)
app.use("/api/carts", cartsRouter);
app.use('/', viewsRouter)



const server = app.listen(8080, () => console.log("server up in 8080"));


export const io = new Server(server);
const manager = new ProductManager("src/files/products.json");
const products =  await manager.getProducts()
 io.on('connection', socket => {
     console.log('Nuevo cliente conectado');
     io.emit("message", products); // enviamos los productos una vez se conecte el cliente

     /* socket.on('message', data =>{
         console.log(data)
     });

     socket.emit('evento_socket_individual', "este mensaje solo debe recibirlo el socket");

     socket.broadcast.emit ('evento_todos_menos_actual', 'Lo verán todos menos el actual');

     io.emit('evento_todos', 'Este mensaje les llegará a todos los usuarios');
 */
 });