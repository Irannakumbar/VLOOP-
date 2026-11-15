const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  console.error(`[Error Handler] ${req.method} ${req.url} ->`, err);

  // Mongoose Duplicate Key Error (e.g. duplicate user or duplicate participation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'userId' || err.message.includes('userId_1_giveawayId_1')) {
      message = 'You have already participated in this giveaway with this account.';
    } else {
      message = `Duplicate entry detected for field: ${field || 'resource'}.`;
    }
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 'Validation Failed', 400, validationErrors);
  }

  // Mongoose Invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found or invalid identifier: ${err.value}`;
  }

  // JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token signature.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;

