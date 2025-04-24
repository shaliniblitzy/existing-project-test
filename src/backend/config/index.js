/**
 * Central configuration module for the Node.js Hello World application.
 * Aggregates all application configuration settings from environment variables
 * and application constants, providing a unified configuration interface.
 * 
 * @module config
 */

// Import environment-specific configuration
const environment = require('./environment');

/**
 * Application name constant
 * @constant {string}
 */
const APP_NAME = 'node-hello-world';

/**
 * Application version constant
 * @constant {string}
 */
const APP_VERSION = '1.0.0';

/**
 * Unified configuration object that combines environment variables
 * and application constants for use throughout the application.
 * 
 * @constant {Object}
 */
const config = {
  // Environment-specific configuration
  PORT: environment.PORT,
  NODE_ENV: environment.NODE_ENV,
  LOG_LEVEL: environment.LOG_LEVEL,
  
  // Environment state flags
  IS_PRODUCTION: environment.IS_PRODUCTION,
  IS_DEVELOPMENT: environment.IS_DEVELOPMENT,
  IS_TEST: environment.IS_TEST,
  
  // Application constants
  APP_NAME,
  APP_VERSION
};

// Freeze the config object to prevent modifications during runtime
Object.freeze(config);

module.exports = config;