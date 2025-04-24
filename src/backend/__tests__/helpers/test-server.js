/**
 * Test Server Helper
 * 
 * Helper functions to set up and tear down a test server for integration and unit tests.
 * This module provides a consistent way to manage the lifecycle of a test server,
 * ensuring that tests run in a clean and predictable environment.
 * 
 * @module backend/__tests__/helpers/test-server
 * @version 1.0.0
 */

// Import supertest for making HTTP requests to the test server
const supertest = require('supertest'); // v6.3.3

// Import functions to start and stop the application
const { startApp, stopApp } = require('src/backend/app');

// Import configuration to get the port number
const { PORT } = require('src/backend/config/index');

/**
 * Sets up a test server before running tests.
 * It starts the application and returns a supertest agent for making HTTP requests.
 * 
 * @returns {object} A supertest agent for making HTTP requests to the test server.
 */
function setupTestServer() {
  // Start the application
  startApp();
  
  // Create a supertest agent for making HTTP requests
  const agent = supertest(`http://localhost:${PORT}`);
  
  // Return the supertest agent
  return agent;
}

/**
 * Tears down the test server after running tests.
 * It stops the application to clean up resources and prevent port conflicts.
 * 
 * @returns {Promise<void>} A promise that resolves when the application is stopped.
 */
async function teardownTestServer() {
  // Stop the application
  await stopApp();
}

module.exports = {
  setupTestServer,
  teardownTestServer
};