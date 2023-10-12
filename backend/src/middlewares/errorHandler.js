const error_handler = (error, req, res, next) => {
  return res.status(error.statusCode).json({
    method: req.method,
    path: req.url,
    message: error.message,
  });
};

export default error_handler;
