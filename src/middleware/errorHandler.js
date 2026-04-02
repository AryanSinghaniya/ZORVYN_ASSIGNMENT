const { ApiError } = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const isKnownError = Boolean(err.statusCode || err.status);
  const statusCode = err.statusCode || err.status || 500;
  const message = isKnownError ? err.message : "Internal server error";
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors: err.errors || null,
    stack: isDevelopment ? err.stack : undefined,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
