/**
 * Hello Endpoint Handler
 * 
 * Handles requests to the /hello endpoint and generates appropriate responses.
 * Validates that the request method is GET and returns "Hello world" for valid requests.
 * 
 * @module handlers/hello-handler
 * @version 1.0.0
 */

// Import required dependencies
const { OK, METHOD_NOT_ALLOWED } = require('../constants/http-status');
const { 
  formatSuccessResponse, 
  formatMethodNotAllowedResponse, 
  setSecurityHeaders 
} = require('../utils/response-formatter');
const { createLogger } = require('../utils/logger');

/**
 * Handles requests to the /hello endpoint, validating the HTTP method
 * and returning 'Hello world' for GET requests.
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleHello(req, res) {
  // Create logger instance
  const logger = createLogger();
  
  // Log incoming request
  logger.info({
    method: req.method,
    path: req.url
  }, 'Request received for /hello endpoint');
  
  // Set security headers to prevent common attacks
  setSecurityHeaders(res);
  
  // Check if the request method is GET
  if (req.method === 'GET') {
    // For GET requests, return "Hello world" with 200 OK status
    formatSuccessResponse(res, 'Hello world', OK);
    logger.info({
      statusCode: OK
    }, 'Successfully processed GET request to /hello endpoint');
  } else {
    // For non-GET requests, return 405 Method Not Allowed
    formatMethodNotAllowedResponse(res);
    logger.warn({
      method: req.method,
      statusCode: METHOD_NOT_ALLOWED
    }, 'Method not allowed for /hello endpoint');
  }
  
  // Log the completion of request handling
  logger.info('Request handling completed');
}

// Export the hello endpoint handler
module.exports = handleHello;