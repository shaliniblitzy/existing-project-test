/**
 * Routes Index Module
 * 
 * Centralizes and exports all route modules for the Node.js HTTP server application.
 * This module aggregates the hello endpoint router and health endpoint router,
 * providing a single import point for all routes used throughout the application.
 * 
 * @module routes/index
 * @version 1.0.0
 */

// Import external dependencies
const express = require('express'); // v4.18.2

// Import internal route modules
const { helloRoute } = require('./hello-route');
const healthRoute = require('./health-route');

/**
 * Creates and configures the main Express router with all application routes.
 * 
 * @returns {object} Express router instance configured with all application routes
 */
function setupRoutes() {
  // Create a new Express router instance
  const router = express.Router();
  
  // Mount the hello endpoint router at '/hello'
  router.use('/hello', helloRoute());
  
  // Mount the health endpoint router at '/health'
  router.use('/health', healthRoute());
  
  // Return the configured router
  return router;
}

// Export the setup function as default and re-export the route modules
module.exports = setupRoutes;
module.exports.helloRoute = helloRoute;
module.exports.healthRoute = healthRoute;