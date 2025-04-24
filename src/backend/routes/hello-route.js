/**
 * Hello Route Module
 * 
 * Defines the route for the /hello endpoint that returns 'Hello world' when accessed via HTTP GET request.
 * This module creates and configures an Express router specifically for the /hello endpoint.
 * 
 * @module routes/hello-route
 * @version 1.0.0
 */

// Import external dependencies
const express = require('express'); // v4.18.2

// Import internal dependencies
const handleHello = require('../handlers/hello-handler');

/**
 * Creates and configures an Express router for the /hello endpoint.
 * 
 * @returns {object} Express router instance configured with the hello endpoint
 */
function helloRoute() {
  // Create a new Express router instance
  const router = express.Router();
  
  // Define a route for all requests to the root path ('/')
  // This lets the handler function handle method validation
  router.all('/', handleHello);
  
  // Return the configured router
  return router;
}

// Export the hello route creator function
module.exports = { helloRoute };