/**
 * Request Handlers Module
 * 
 * Centralizes and exports all request handlers for the Node.js HTTP server application.
 * This module aggregates the hello endpoint handler and health endpoint handler,
 * providing a single import point for all request handlers used throughout the application.
 * 
 * @module handlers/index
 * @version 1.0.0
 */

// Import handlers
const handleHello = require('./hello-handler');
const handleHealthRequest = require('./health-handler');
const { incrementRequestCount, incrementErrorCount } = require('./health-handler');

// Export all handlers and utility functions
module.exports = {
  handleHello,
  handleHealthRequest,
  incrementRequestCount,
  incrementErrorCount
};