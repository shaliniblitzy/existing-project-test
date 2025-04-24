/**
 * Module that manages environment-specific configuration values for the Node.js Hello World application.
 * Loads and validates environment variables, providing default values when necessary,
 * and exposes derived environment state flags.
 * 
 * @module environment
 */

// Default values for environment configuration
const DEFAULT_PORT = 3000;
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_LOG_LEVEL = 'info';
const VALID_NODE_ENVS = ['development', 'production', 'test'];

/**
 * Validates that the port number is within the valid range (1-65535)
 * 
 * @param {string} portStr - The port value as a string from environment variables
 * @returns {number} - Valid port number
 */
function validatePort(portStr) {
  const port = parseInt(portStr, 10);
  
  // Check if port is a valid number and within the allowed range
  if (!isNaN(port) && port >= 1 && port <= 65535) {
    return port;
  } else {
    // If invalid, log a warning and return the default port
    console.warn(`Invalid PORT value: "${portStr}". Using default port ${DEFAULT_PORT}.`);
    return DEFAULT_PORT;
  }
}

// Validate and normalize the NODE_ENV value
let nodeEnv = (process.env.NODE_ENV || DEFAULT_NODE_ENV).toLowerCase();
if (!VALID_NODE_ENVS.includes(nodeEnv)) {
  console.warn(`Invalid NODE_ENV value: "${nodeEnv}". Using default environment "${DEFAULT_NODE_ENV}".`);
  nodeEnv = DEFAULT_NODE_ENV;
}

/**
 * Environment configuration object containing validated environment variables
 * and derived environment state flags.
 */
const environment = {
  // Main configuration values with validation and defaults
  PORT: validatePort(process.env.PORT),
  NODE_ENV: nodeEnv,
  LOG_LEVEL: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  
  // Derived environment state flags for easy environment checking
  IS_PRODUCTION: nodeEnv === 'production',
  IS_DEVELOPMENT: nodeEnv === 'development',
  IS_TEST: nodeEnv === 'test'
};

// Freeze the object to prevent modifications during runtime
Object.freeze(environment);

module.exports = environment;