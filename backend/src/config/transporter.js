import { createTransport } from "nodemailer";
import args from "./arguments.js";
import config from "./env.js";

const port = process.env.PORT || args.port;

console.log({port})
export default createTransport({
  service: "gmail",
  port,
  auth: {
    user: config.G_MAIL,
    pass: config.G_PASS,
  },
});
