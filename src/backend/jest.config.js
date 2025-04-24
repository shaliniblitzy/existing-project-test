/**
 * Jest configuration file for the Node.js Hello World application.
 * This file defines the test environment, test patterns, coverage settings, 
 * and other options used by Jest when running tests.
 * 
 * @type {import('jest').Config}
 * @version Jest ^29.7.0
 */

module.exports = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: '../coverage',
  
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  
  // The test environment that will be used for testing (Node.js for server-side tests)
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: ['**/*.test.js'],
};