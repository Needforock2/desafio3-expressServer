import logger from "../config/logger/logger.js";

const error_handler = (error, req, res, next) => {

  req.logger = logger;
  console.log("error", error)
    if (`${error.statusCode}`.startsWith("4")) {
      req.logger.ERROR(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - ${
          error.message
        }`
      );
       return res.status(error.statusCode).json({
         method: req.method,
         path: req.url,
         message: error.message,
       });
    } else {
      req.logger.FATAL(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()} - ${
          error.message
        }`
      );
       return res.status(500).json({
         method: req.method,
         path: req.url,
         message: error.message,
       });
  }

 
};

export default error_handler;
