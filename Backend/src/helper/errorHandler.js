const sendError = (res, statusCode = 500, errors = {}) => {
  // Extract a single message for simple toast notifications on frontend
  let message = "An error occurred";
  if (typeof errors === "string") {
    message = errors;
  } else if (typeof errors === "object") {
    const values = Object.values(errors);
    if (values.length > 0) message = values[0];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: typeof errors === "string" ? { error: errors } : errors
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
  console.error("DEBUG - Internal Server Error:", error); // Stack trace log kela
  return sendError(res, 500, {
    server: error?.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? error?.stack : undefined // Dev madhe stack pan pathvu
  });
};

module.exports = {
  formatMongoError,
  handle404,
  handle401,
  handle422,
  handle500
};