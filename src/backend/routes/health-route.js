/**
 * Health Route Module
 * 
 * Defines the route for the health endpoint that provides application health status information
 * including uptime, memory usage, and request metrics for monitoring purposes.
 *
 * @module routes/health-route
 * @version 1.0.0 
 */

// Import the express module to create a router
const express = require('express'); // version 4.18.2

// Import the health request handler
const handleHealthRequest = require('../handlers/health-handler');

/**
 * Creates and configures an Express router for the /health endpoint
 * 
 * @returns {object} Express router instance configured with the health endpoint
 */
function healthRoute() {
  // Create a new router instance
  const router = express.Router();
  
  // Define a route for GET requests to the root path ('/')
  router.get('/', handleHealthRequest);
  
  // Return the configured router
  return router;
}

// Export the healthRoute function
module.exports = healthRoute;