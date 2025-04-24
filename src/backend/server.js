/**
 * Main Server Entry Point
 * 
 * This file serves as the executable entry point for the Node.js Hello World HTTP server.
 * It initializes the server, starts it on the configured port, and handles server
 * lifecycle events, including graceful shutdown and error handling.
 * 
 * @module server
 * @version 1.0.0
 */

// Import internal modules
const { startApp } = require('./app');
const { createLogger } = require('./utils/logger');
const { PORT } = require('./config');

// Create a logger instance for the server
const logger = createLogger();

/**
 * Main function that starts the application server and handles any startup errors
 * 
 * @returns {Promise<void>} Promise that resolves when the server has started or rejects on error
 */
async function main() {
  try {
    logger.info('Starting server application');
    
    // Start the application by initializing the server and beginning to listen for requests
    await startApp();
    
    logger.info(`Server successfully started and listening on port ${PORT}`);
  } catch (error) {
    logger.error(
      { error: error, stack: error.stack },
      `Failed to start server: ${error.message}`
    );
    
    // Exit process with error code to indicate startup failure
    process.exit(1);
  }
}

/**
 * Handles unhandled promise rejections to prevent application crashes
 * 
 * @param {Error} reason - The error that caused the rejection
 * @param {Promise} promise - The promise that was rejected
 */
function handleUnhandledRejections(reason, promise) {
  logger.error(
    { error: reason, stack: reason.stack, promise: promise },
    `Unhandled Promise Rejection: ${reason.message}`
  );
  
  // Exit the process with error code
  process.exit(1);
}

/**
 * Handles uncaught exceptions to prevent application crashes
 * 
 * @param {Error} error - The uncaught exception
 */
function handleUncaughtExceptions(error) {
  logger.error(
    { error: error, stack: error.stack },
    `Uncaught Exception: ${error.message}`
  );
  
  // Exit the process with error code
  process.exit(1);
}

// Register global error handlers
process.on('unhandledRejection', handleUnhandledRejections);
process.on('uncaughtException', handleUncaughtExceptions);

// Start the server by invoking the main function
main().catch(error => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});