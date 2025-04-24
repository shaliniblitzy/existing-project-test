/**
 * Shutdown Manager Module
 * 
 * Manages the graceful shutdown process for the Node.js HTTP server application.
 * Handles termination signals (SIGINT, SIGTERM), ensures all active connections
 * are properly closed, and coordinates the shutdown sequence to prevent data loss
 * or connection interruptions.
 *
 * @module core/shutdown-manager
 */

// Import the logger utility
const { createLogger } = require('../utils/logger');

// Create a logger instance for the shutdown manager
const logger = createLogger();

// Constants
const SHUTDOWN_TIMEOUT_MS = 5000; // 5 seconds timeout for graceful shutdown

// Track if shutdown process is already in progress
let isShuttingDown = false;

// Callback to be executed during shutdown (will be set by the server)
let serverShutdownCallback = null;

/**
 * Sets up signal handlers for graceful shutdown of the HTTP server
 * 
 * @param {object} server - The HTTP server instance
 * @param {Function} shutdownCallback - Callback function to close server connections
 */
function setupGracefulShutdown(server, shutdownCallback) {
  // Register the provided shutdownCallback for later use
  registerShutdownCallback(shutdownCallback);

  // Handle SIGINT signal (Ctrl+C)
  process.on('SIGINT', () => {
    logger.info('Received SIGINT signal (Ctrl+C)');
    shutdown(server, 'SIGINT');
  });

  // Handle SIGTERM signal (termination request)
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM signal');
    shutdown(server, 'SIGTERM');
  });

  logger.info('Graceful shutdown handlers registered');
}

/**
 * Performs the actual shutdown sequence for the application
 * 
 * @param {object} server - The HTTP server instance
 * @param {string} signal - The signal that triggered the shutdown
 * @returns {Promise<void>} Promise that resolves when shutdown completes
 */
async function shutdown(server, signal) {
  // Prevent multiple shutdown attempts
  if (isShuttingDown) {
    logger.info('Shutdown already in progress, ignoring additional signals');
    return;
  }

  // Mark shutdown as in progress
  isShuttingDown = true;

  logger.info(`Initiating graceful shutdown (signal: ${signal})`);

  try {
    // Execute server shutdown callback if registered
    if (serverShutdownCallback && typeof serverShutdownCallback === 'function') {
      logger.info('Closing HTTP server connections');
      await serverShutdownCallback();
      logger.info('HTTP server closed successfully');
    } else {
      logger.warn('No shutdown callback registered, server may not close gracefully');
    }

    // Set a timeout for the graceful shutdown
    logger.info(`Server shutdown completed, process will exit in ${SHUTDOWN_TIMEOUT_MS}ms if not done`);
    
    // Allow any remaining operations to complete, then exit
    setTimeout(() => {
      logger.info('Exiting Node.js process');
      process.exit(0);
    }, SHUTDOWN_TIMEOUT_MS);
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    // Exit with error code if shutdown fails
    process.exit(1);
  }
}

/**
 * Returns the current shutdown status of the server
 * 
 * @returns {boolean} True if server is in the process of shutting down, false otherwise
 */
function isServerShuttingDown() {
  return isShuttingDown;
}

/**
 * Registers a callback function to be called during shutdown
 * 
 * @param {Function} callback - Function to execute during shutdown
 */
function registerShutdownCallback(callback) {
  if (typeof callback !== 'function') {
    logger.warn('Invalid shutdown callback provided, must be a function');
    return;
  }
  serverShutdownCallback = callback;
}

module.exports = {
  setupGracefulShutdown,
  isServerShuttingDown,
  registerShutdownCallback
};