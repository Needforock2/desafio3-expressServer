import args from "../arguments.js";
import { format, transports, addColors } from "winston";
const { colorize, simple } = format;

const levels = { FATAL: 1, ERROR: 2, INFO: 3, HTTP: 4 };

const colors = { FATAL: "red", ERROR: "yellow", INFO: "blue", HTTP: "white" };
addColors(colors);

let logger = { levels: levels };

switch (args.mode) {
  case "dev":
    logger.format = colorize()
        logger.transports= [
            new transports.Console({ level: "HTTP", format: simple() }),
          ]
        break
    case "prod":
        logger.transports = [
          new transports.Console({ level: "HTTP", format: simple() }),
          new transports.File({
            level: "ERROR",
            format: simple(),
            filename: "./errors.log",
          }),
        ];
        break
}

export default logger