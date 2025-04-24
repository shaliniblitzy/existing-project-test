/**
 * Node.js Hello World HTTP Server Application
 * 
 * This file serves as the main entry point for the application.
 * It initializes the server, sets up global error handlers,
 * and manages the application lifecycle.
 * 
 * @module backend/index
 * @version 1.0.0
 */

// Import internal dependencies
const { startApp } = require('./app');
const { createLogger } = require('./utils/logger');
const { PORT, APP_NAME, APP_VERSION } = require('./config');

// Create a global logger instance
const logger = createLogger();

/**
 * Main function that starts the application server and handles any startup errors
 * 
 * @returns {Promise<void>} Promise that resolves when the server has started or rejects on error
 */
async function main() {
  try {
    // Log application startup with metadata
    logger.info(
      { name: APP_NAME, version: APP_VERSION },
      `Starting ${APP_NAME} v${APP_VERSION}`
    );

    // Start the application by initializing the HTTP server
    await startApp();

    // Log successful server startup
    logger.info(
      { port: PORT },
      `Server successfully started and listening on port ${PORT}`
    );
  } catch (error) {
    // Log any errors that occur during startup
    logger.error(
      { error: error.message, stack: error.stack },
      'Failed to start server'
    );
    
    // Exit the process with error code
    process.exit(1);
  }
}

/**
 * Handles unhandled promise rejections to prevent application crashes
 * 
 * @param {Error} reason - The error that caused the promise rejection
 * @param {Promise} promise - The promise that rejected
 */
function handleUnhandledRejections(reason, promise) {
  logger.error(
    { error: reason, stack: reason.stack },
    'Unhandled Promise Rejection'
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
    { error: error.message, stack: error.stack },
    'Uncaught Exception'
  );
  
  // Exit the process with error code
  process.exit(1);
}

// Register process-level error handlers
process.on('unhandledRejection', handleUnhandledRejections);
process.on('uncaughtException', handleUncaughtExceptions);

// Start the application
main().catch(error => {
  console.error('Fatal error during application startup:', error);
  process.exit(1);
});