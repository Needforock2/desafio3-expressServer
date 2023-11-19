import args from "../config/arguments.js";
import MongoConnect from "../config/mongo.js";
import env from "../config/env.js";
let dao = {}

switch (args.persistance) {
  case "MEMORY":
    console.log("memory: connected");
    break;
  case "FS":
    console.log("file system: connected");
    const mongoFs = new MongoConnect(env.DATABASE_URL);
    mongoFs.connect_mongo();
    // const { default: ProductFs } = await import("./fs/products.fs.js")
    const { default: ProductFs } = await import("./fs/products.fs.js");
     const { default: UserFs } = await import("./mongo/auth.mongo.js");
    const { default: CartFs } = await import("./fs/carts.fs.js");
    dao = { Product: ProductFs , User: UserFs, Cart: CartFs };
    break;
  default:
    const mongo = new MongoConnect(env.DATABASE_URL);
    mongo.connect_mongo();
    const { default: ProductMongo } = await import("./mongo/products.mongo.js");
    const { default: UserMongo } = await import("./mongo/auth.mongo.js")
    const { default: CartMongo } = await import("./mongo/carts.mongo.js");
    const { default: TicketMongo} = await import("./mongo/ticket.mongo.js")
    dao = {Product: ProductMongo, User: UserMongo, Cart: CartMongo, Ticket: TicketMongo}
    break
}

export default dao