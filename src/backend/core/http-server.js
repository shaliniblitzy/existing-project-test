/**
 * HTTP Server Module
 * 
 * Core module that creates, configures, and manages the HTTP server for the
 * Node.js Hello World application. It handles server initialization, request routing,
 * and graceful shutdown procedures.
 * 
 * @module backend/core/http-server
 * @version 1.0.0
 */

// Import Node.js core modules
const http = require('http'); // built-in

// Import internal modules
const { PORT } = require('../config');
const { createLogger } = require('../utils/logger');
const handleRequest = require('./request-handler');
const { setupGracefulShutdown } = require('./shutdown-manager');
const { INTERNAL_SERVER_ERROR } = require('../constants/http-status');

// Create logger instance for the server
const logger = createLogger();

/**
 * Maximum time in milliseconds to wait for server startup before timing out
 * @constant {number}
 */
const SERVER_STARTUP_TIMEOUT_MS = 3000;

/**
 * Creates and configures an HTTP server instance with the request handler
 * 
 * @returns {object} Configured HTTP server instance
 */
function createServer() {
  logger.info('Creating HTTP server instance');
  
  // Create HTTP server with the request handler function
  const server = http.createServer(handleRequest);
  
  // Set up error handler for server-level errors
  server.on('error', handleServerError);
  
  logger.info('HTTP server instance created successfully');
  return server;
}

/**
 * Starts the HTTP server listening on the configured port
 * 
 * @param {object} server - The HTTP server instance to start
 * @returns {Promise<object>} Promise that resolves to the running server instance
 */
function startServer(server) {
  return new Promise((resolve, reject) => {
    // Create a timeout to catch hanging server start
    const startupTimeout = setTimeout(() => {
      reject(new Error(`Server startup timed out after ${SERVER_STARTUP_TIMEOUT_MS}ms`));
    }, SERVER_STARTUP_TIMEOUT_MS);
    
    logger.info(`Starting server on port ${PORT}`);
    
    // Start the server listening on the configured port
    server.listen(PORT, () => {
      // Clear the timeout since the server started successfully
      clearTimeout(startupTimeout);
      
      const address = server.address();
      logger.info(
        { port: address.port, address: address.address }, 
        `Server is running and listening on port ${address.port}`
      );
      
      // Set up graceful shutdown handling
      setupGracefulShutdown(server, () => stopServer(server));
      
      // Resolve the promise with the server instance
      resolve(server);
    });
    
    // Handle errors during server startup
    server.once('error', (err) => {
      // Clear the timeout since we got an error response
      clearTimeout(startupTimeout);
      
      // Handle specific error for port already in use
      if (err.code === 'EADDRINUSE') {
        logger.error(
          { port: PORT, error: err.message },
          `Port ${PORT} is already in use. Choose a different port.`
        );
      } else {
        logger.error(
          { error: err },
          `Error starting server: ${err.message}`
        );
      }
      
      // Reject the promise with the error
      reject(err);
    });
  });
}

/**
 * Gracefully stops the HTTP server, closing all connections
 * 
 * @param {object} server - The HTTP server instance to stop
 * @returns {Promise<void>} Promise that resolves when the server has been stopped
 */
function stopServer(server) {
  return new Promise((resolve, reject) => {
    if (!server) {
      logger.warn('Attempted to stop a server that does not exist');
      resolve();
      return;
    }
    
    if (!server.listening) {
      logger.info('Server is already stopped');
      resolve();
      return;
    }
    
    logger.info('Stopping server gracefully...');
    
    server.close((err) => {
      if (err) {
        logger.error({ error: err }, `Error closing server: ${err.message}`);
        reject(err);
        return;
      }
      
      logger.info('Server stopped successfully');
      resolve();
    });
  });
}

/**
 * Handles server-level errors to prevent crashes
 * 
 * @param {Error} error - The error object
 */
function handleServerError(error) {
  logger.error(
    { error: error, stack: error.stack },
    `Server error: ${error.message}`
  );
  
  // Check for specific error types
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Choose a different port.`);
  } else {
    logger.error(
      { statusCode: INTERNAL_SERVER_ERROR },
      'An unexpected server error occurred'
    );
  }
}

// Export the server management functions
module.exports = {
  createServer,
  startServer,
  stopServer
};