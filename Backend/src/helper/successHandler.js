const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * 200 OK
 */
const handle200 = (res, data = null, message = "Success") => {
  return sendSuccess(res, 200, message, data);
};

/**
 * 201 Created
 */
const handle201 = (res, data = null, message = "Resource created successfully") => {
  return sendSuccess(res, 201, message, data);
};

/**
 * 204 No Content
 */
const handle204 = (res) => {
  return res.status(204).send(); // ✅ no body
};

module.exports = {
  sendSuccess,
  handle200,
  handle201,
  handle204
};