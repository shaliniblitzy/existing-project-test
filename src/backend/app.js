/**
 * Main Application Module
 * 
 * This is the entry point for the Node.js Hello World HTTP server application.
 * It creates the server, sets up request handling, and starts listening for
 * incoming HTTP requests.
 * 
 * @module backend/app
 * @version 1.0.0
 */

// Import server creation and management functions
const { createServer, startServer } = require('./core/http-server');

// Import request handler
const handleRequest = require('./core/request-handler');

// Import shutdown manager
const { setupGracefulShutdown } = require('./core/shutdown-manager');

// Import error handler
const errorHandler = require('./middleware/error-handler');

// Import logger utility
const { createLogger } = require('./utils/logger');

// Create logger instance
const logger = createLogger();

/**
 * Initializes and starts the application by creating the server, setting up
 * request handling, and starting to listen for requests.
 * 
 * @returns {Promise<void>} A promise that resolves when the server has started successfully.
 */
async function startApp() {
  try {
    logger.info('Starting application');
    
    // Create the HTTP server instance
    const server = createServer();
    
    // Set up graceful shutdown for the server
    setupGracefulShutdown(server, () => {
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error({ error: err }, `Error closing server: ${err.message}`);
            reject(err);
            return;
          }
          logger.info('Server closed successfully');
          resolve();
        });
      });
    });
    
    // Start the server listening on the configured port
    await startServer(server);
    
    logger.info('Application started successfully');
  } catch (error) {
    logger.error({ error }, `Failed to start application: ${error.message}`);
    throw error;
  }
}

// Export the startApp function
module.exports = { startApp };