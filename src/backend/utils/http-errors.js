/**
 * HTTP Error Utilities
 * 
 * This module provides a standardized way to create HTTP error objects with
 * appropriate status codes and messages. These error objects are used throughout
 * the application for consistent error handling.
 *
 * @module utils/http-errors
 * @version 1.0.0
 */

// Import HTTP status codes and standardized error messages
const { NOT_FOUND, METHOD_NOT_ALLOWED, INTERNAL_SERVER_ERROR } = require('../constants/http-status');
const { 
  NOT_FOUND: NOT_FOUND_MESSAGE, 
  METHOD_NOT_ALLOWED: METHOD_NOT_ALLOWED_MESSAGE, 
  INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR_MESSAGE, 
  DEFAULT_ERROR 
} = require('../constants/error-messages');

/**
 * Custom error class that extends Error to include HTTP status code and standardized error messages
 * @class HttpError
 * @extends Error
 */
class HttpError extends Error {
  /**
   * Creates a new HttpError instance with the specified status code and message
   * @param {number} statusCode - HTTP status code for the error
   * @param {string} message - Error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
    
    // Capture stack trace if available in the environment
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

/**
 * Creates a 404 Not Found HTTP error with the standard error message
 * @param {string} [message] - Custom error message (optional)
 * @returns {HttpError} A new HttpError instance with 404 status code and Not Found message
 */
const createNotFoundError = (message) => {
  return new HttpError(NOT_FOUND, message || NOT_FOUND_MESSAGE);
};

/**
 * Creates a 405 Method Not Allowed HTTP error with the standard error message
 * @param {string} [message] - Custom error message (optional)
 * @returns {HttpError} A new HttpError instance with 405 status code and Method Not Allowed message
 */
const createMethodNotAllowedError = (message) => {
  return new HttpError(METHOD_NOT_ALLOWED, message || METHOD_NOT_ALLOWED_MESSAGE);
};

/**
 * Creates a 500 Internal Server Error HTTP error with the standard error message
 * @param {string} [message] - Custom error message (optional)
 * @returns {HttpError} A new HttpError instance with 500 status code and Internal Server Error message
 */
const createInternalServerError = (message) => {
  return new HttpError(INTERNAL_SERVER_ERROR, message || INTERNAL_SERVER_ERROR_MESSAGE);
};

// Export the error class and factory functions
module.exports = {
  HttpError,
  createNotFoundError,
  createMethodNotAllowedError,
  createInternalServerError
};