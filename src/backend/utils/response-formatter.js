/**
 * Response Formatter Utility
 * 
 * Provides utility functions for formatting HTTP responses, ensuring consistency
 * in response structure and headers across the application.
 * 
 * @module utils/response-formatter
 * @version 1.0.0
 */

const HTTP_STATUS = require('../constants/http-status');

/**
 * Formats a successful HTTP response with the given message and status code.
 * 
 * @param {object} res - The HTTP response object
 * @param {string} message - The message to send in the response body
 * @param {number} statusCode - The HTTP status code (defaults to 200 OK)
 */
function formatSuccessResponse(res, message, statusCode = HTTP_STATUS.OK) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = statusCode;
  res.end(message);
}

/**
 * Formats an HTTP 405 Method Not Allowed response with a default message.
 * 
 * @param {object} res - The HTTP response object
 */
function formatMethodNotAllowedResponse(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = HTTP_STATUS.METHOD_NOT_ALLOWED;
  res.end('Method Not Allowed');
}

/**
 * Formats an HTTP error response with the given status code and message.
 * 
 * @param {object} res - The HTTP response object
 * @param {number} statusCode - The HTTP status code for the error
 * @param {string} message - The error message to send in the response body
 */
function formatErrorResponse(res, statusCode, message) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = statusCode;
  res.end(message);
}

/**
 * Sets security headers in the HTTP response to prevent common attacks.
 * These headers are recommended in the security architecture section
 * to establish basic protection measures.
 * 
 * @param {object} res - The HTTP response object
 */
function setSecurityHeaders(res) {
  // Prevents MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevents clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Restricts resource loading
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  
  // Prevents response caching
  res.setHeader('Cache-Control', 'no-store');
}

module.exports = {
  formatSuccessResponse,
  formatMethodNotAllowedResponse,
  formatErrorResponse,
  setSecurityHeaders
};