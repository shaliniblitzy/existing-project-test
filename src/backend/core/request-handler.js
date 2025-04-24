/**
 * Request Handler Module
 * 
 * Core module that handles incoming HTTP requests, routes them to appropriate handlers
 * based on URL path, and manages error handling. This module serves as the central
 * request processing component for the Node.js Hello World application.
 * 
 * @module backend/core/request-handler
 * @version 1.0.0
 */

// Import Node.js core modules
const url = require('url'); // built-in

// Import internal modules
const setupRoutes = require('../routes');
const { createNotFoundError } = require('../utils/http-errors');
const errorHandler = require('../middleware/error-handler');
const { createLogger } = require('../utils/logger');
const { setSecurityHeaders } = require('../utils/response-formatter');

// Create logger instance for request logging
const logger = createLogger();

// Setup router with all application routes
const router = setupRoutes();

/**
 * Parses the URL from the request and returns the pathname
 * 
 * @param {object} req - The HTTP request object
 * @returns {string} The pathname from the URL
 */
function parseUrl(req) {
  // Extract the URL from the request
  const requestUrl = req.url;
  
  // Parse the URL using the url module
  const parsedUrl = url.parse(requestUrl, true);
  
  // Return the pathname portion of the URL
  return parsedUrl.pathname;
}

/**
 * Routes the request to the appropriate handler based on the URL path
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @param {string} path - The URL path
 * @returns {boolean} True if a route was matched, false otherwise
 */
function routeRequest(req, res, path) {
  // Check if the path starts with '/hello'
  if (path === '/hello' || path.startsWith('/hello/')) {
    // Route to the hello handler
    // Add original path info to request for logging purposes
    req.originalUrl = req.url;
    
    // Prepare the request for routing by adjusting the path
    // This ensures that the Express router can handle it correctly
    if (path === '/hello') {
      req.url = '/';
    } else {
      req.url = path.substring('/hello'.length);
    }
    
    // Forward the request to the router
    router(req, res, (err) => {
      if (err) throw err;
      // If next() is called without error, the route didn't handle the request
    });
    
    // Restore the original URL
    req.url = req.originalUrl;
    return true;
  }
  
  // Check if the path starts with '/health'
  if (path === '/health' || path.startsWith('/health/')) {
    // Route to the health handler
    // Add original path info to request for logging purposes
    req.originalUrl = req.url;
    
    // Prepare the request for routing
    if (path === '/health') {
      req.url = '/';
    } else {
      req.url = path.substring('/health'.length);
    }
    
    // Forward the request to the router
    router(req, res, (err) => {
      if (err) throw err;
      // If next() is called without error, the route didn't handle the request
    });
    
    // Restore the original URL
    req.url = req.originalUrl;
    return true;
  }
  
  // If no route matches, return false
  return false;
}

/**
 * Main request handler function that processes incoming HTTP requests,
 * routes them to appropriate handlers, and handles errors
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleRequest(req, res) {
  try {
    // Set security headers on the response using setSecurityHeaders(res)
    setSecurityHeaders(res);
    
    // Parse the URL from the request
    const path = parseUrl(req);
    
    // Log the incoming request with method and path
    logger.info({
      method: req.method,
      path: path
    }, 'Incoming request received');
    
    // Try to route the request using the router
    const routeHandled = routeRequest(req, res, path);
    
    // If no route matches, create a 404 Not Found error
    if (!routeHandled) {
      throw createNotFoundError();
    }
  } catch (err) {
    // Catch any errors that occur during processing
    
    // Pass errors to the error handler middleware
    errorHandler(err, req, res);
  }
}

// Export the main request handler function
module.exports = handleRequest;