/**
 * HTTP Status Code Constants
 * 
 * This module defines constants for standard HTTP status codes to ensure
 * consistent usage throughout the application. Using these constants instead
 * of magic numbers helps maintain code readability and consistency.
 * 
 * @version 1.0.0
 */

/**
 * HTTP status codes used in the application
 * @constant {Object} HTTP_STATUS
 */
const HTTP_STATUS = {
  /**
   * 200 OK - The request has succeeded
   * Used when returning successful "Hello world" response
   */
  OK: 200,
  
  /**
   * 404 Not Found - The server cannot find the requested resource
   * Used when client requests an undefined route
   */
  NOT_FOUND: 404,
  
  /**
   * 500 Internal Server Error - The server encountered an unexpected condition
   * Used for unhandled errors and server-side problems
   */
  INTERNAL_SERVER_ERROR: 500,
  
  /**
   * 405 Method Not Allowed - The request method is not supported by the target resource
   * Used when client uses non-GET methods on the /hello endpoint
   */
  METHOD_NOT_ALLOWED: 405
};

module.exports = HTTP_STATUS;