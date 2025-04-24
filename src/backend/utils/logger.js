/**
 * Logger utility module for the Node.js Hello World application.
 * Provides a centralized logging configuration using Pino.
 * @module utils/logger
 */

// Import the Pino logger package
const pino = require('pino'); // v8.14.2

/**
 * Creates and configures a Pino logger instance with the specified log level.
 * Uses environment variable LOG_LEVEL if set, otherwise defaults to 'info'.
 * 
 * @returns {object} A Pino logger instance
 */
function createLogger() {
  // Get log level from environment variables or use 'info' as default
  const logLevel = process.env.LOG_LEVEL || 'info';

  // Create the logger instance with the configured log level
  const logger = pino({
    level: logLevel,
    // Use Pino's default timestamp format
    timestamp: true,
    // Include minimal but useful context in log output
    base: {
      pid: process.pid,
      hostname: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    }
  });

  return logger;
}

module.exports = { createLogger };