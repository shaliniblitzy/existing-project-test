/**
 * Error Handler Middleware
 * 
 * This module provides a centralized error handling middleware for the Node.js Hello World service.
 * It catches exceptions, logs them appropriately, and formats error responses to clients.
 * 
 * @module middleware/error-handler
 * @version 1.0.0
 */

// Import dependencies
const { HttpError } = require('../utils/http-errors');
const { createInternalServerError } = require('../utils/http-errors');
const { formatErrorResponse } = require('../utils/response-formatter');
const HTTP_STATUS = require('../constants/http-status');
const ERROR_MESSAGES = require('../constants/error-messages');
const { createLogger } = require('../utils/logger');

// Create a logger instance
const logger = createLogger();

/**
 * Helper function to log errors with appropriate level and context
 * 
 * @param {Error} err - The error object
 * @param {object} req - The HTTP request object
 */
function logError(err, req) {
  // Extract relevant request information for context
  const requestInfo = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    timestamp: new Date().toISOString()
  };

  // Create context object with error details and request info
  const errorContext = {
    error: {
      message: err.message,
      name: err.name,
      code: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
    },
    request: requestInfo
  };

  // Determine log level based on error status code
  if (err.statusCode === HTTP_STATUS.NOT_FOUND) {
    // Not Found errors are expected and logged at info level
    logger.info(errorContext, `404 Not Found: ${req.method} ${req.url}`);
  } else if (err.statusCode === HTTP_STATUS.METHOD_NOT_ALLOWED) {
    // Method Not Allowed errors are logged at warn level
    logger.warn(errorContext, `405 Method Not Allowed: ${req.method} ${req.url}`);
  } else {
    // Server errors (500) and any other errors are logged at error level with stack trace
    errorContext.error.stack = err.stack;
    logger.error(errorContext, `Server Error: ${err.message}`);
  }
}

/**
 * Middleware function that handles errors by logging them and sending appropriate HTTP responses
 * 
 * @param {Error} err - The error object
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @param {function} next - The next middleware function in the stack
 */
function errorHandler(err, req, res, next) {
  // Log the error with context
  logError(err, req);

  // Check if error is an instance of HttpError
  if (err instanceof HttpError) {
    // Use the status code and message from the HttpError
    formatErrorResponse(res, err.statusCode, err.message);
  } else {
    // For unknown errors, create a generic 500 Internal Server Error
    const serverError = createInternalServerError(err.message || ERROR_MESSAGES.DEFAULT_ERROR);
    formatErrorResponse(res, serverError.statusCode, serverError.message);
  }

  // Don't call next() as we've handled the error and sent a response
}

module.exports = errorHandler;