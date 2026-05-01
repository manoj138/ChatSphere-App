const sendError = (res, statusCode = 500, errors = {}) => {
  return res.status(statusCode).json({
    success: false,
    errors
  });
};

/**
 * Formats Mongoose errors
 */
const formatMongoError = (res, error) => {
  let errors = {};

  // Validation Error
  if (error.name === "ValidationError") {
    Object.values(error.errors).forEach((err) => {
      errors[err.path] = err.message;
    });
    return sendError(res, 422, errors);
  }

  // Duplicate Key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    errors[field || "duplicate"] = `${field} already exists`;
    return sendError(res, 409, errors); // better status
  }

  // Cast Error (Invalid ObjectId)
  if (error.name === "CastError") {
    errors[error.path] = `Invalid ${error.path}`;
    return sendError(res, 400, errors);
  }

  // Fallback
  return handle500(res, error);
};

/**
 * 404
 */
const handle404 = (res, message = "Resource not found") => {
  return sendError(res, 404, { route: message });
};

/**
 * 401
 */
const handle401 = (res, message = "Unauthorized") => {
  return sendError(res, 401, { auth: message });
};

/**
 * 422 (manual)
 */
const handle422 = (res, errors = {}) => {
  return sendError(res, 422, errors);
};

/**
 * 500
 */
const handle500 = (res, error) => {
  console.error("Internal Server Error:", error);

  return sendError(res, 500, {
    server: error?.message || "Internal Server Error"
  });
};

module.exports = {
  formatMongoError,
  handle404,
  handle401,
  handle422,
  handle500
};