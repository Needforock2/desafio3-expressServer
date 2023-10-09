import dotenv from "dotenv";
import command from "./arguments.js";

const environment = command.mode;
const path = environment === "dev" ? "./.env.dev" : "./.env.prod";
dotenv.config({ path });

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_COOKIE: process.env.SECRET_COOKIE,
  SECRET_SESSION: process.env.SECRET_SESSION,
  SECRET_TOKEN: process.env.SECRET_KEY,
  GH_APP_ID: process.env.GH_APP_ID,
  GH_CLIENT_ID: process.env.GH_CLIENT_ID,
  GH_CB: process.env.GH_CB,
  GH_SECRET: process.env.GH_SECRET,
  G_MAIL: process.env.G_MAIL,
  G_PASS: process.env.G_PASS,
};
