/**
 * Test utility functions for the Node.js Hello World application.
 * 
 * This module provides helper functions for creating mock HTTP objects and
 * performing common assertions in tests.
 * 
 * @module test-utils
 * @version 1.0.0
 */

// Import dependencies
const { expect } = require('jest'); // ^29.0.0
const { MockRequest, MockResponse } = require('../../__tests__/mocks/http-mocks');

/**
 * Creates a mock HTTP request object for testing purposes
 * 
 * @param {Object} options - Configuration options for the request
 * @param {string} [options.method='GET'] - The HTTP method
 * @param {string} [options.url='/'] - The request URL
 * @param {Object} [options.headers={}] - HTTP headers
 * @returns {MockRequest} A mock HTTP request object
 */
function createMockRequest(options = {}) {
  return new MockRequest(options);
}

/**
 * Creates a mock HTTP response object for testing purposes
 * 
 * @returns {MockResponse} A mock HTTP response object
 */
function createMockResponse() {
  return new MockResponse();
}

/**
 * Asserts that the response is a success (200 OK) and contains the expected data
 * 
 * @param {MockResponse} res - The mock response object to check
 * @param {string} expectedData - The expected response body
 */
function expectSuccessResponse(res, expectedData) {
  expect(res.statusCode).toBe(200);
  expect(res.body).toBe(expectedData);
}

/**
 * Asserts that the response is an error and contains the expected error message and status code
 * 
 * @param {MockResponse} res - The mock response object to check
 * @param {number} expectedStatus - The expected HTTP status code
 * @param {string} expectedMessage - The expected error message
 */
function expectErrorResponse(res, expectedStatus, expectedMessage) {
  expect(res.statusCode).toBe(expectedStatus);
  expect(res.body).toBe(expectedMessage);
}

/**
 * Asserts that the response is a 404 Not Found error and contains the expected error message
 * 
 * @param {MockResponse} res - The mock response object to check
 * @param {string} expectedMessage - The expected error message
 */
function expectNotFoundResponse(res, expectedMessage) {
  expect(res.statusCode).toBe(404);
  expect(res.body).toBe(expectedMessage);
}

/**
 * Asserts that the response is a 405 Method Not Allowed error and contains the expected error message
 * 
 * @param {MockResponse} res - The mock response object to check
 * @param {string} expectedMessage - The expected error message
 */
function expectMethodNotAllowedResponse(res, expectedMessage) {
  expect(res.statusCode).toBe(405);
  expect(res.body).toBe(expectedMessage);
}

// Export utility functions
module.exports = {
  createMockRequest,
  createMockResponse,
  expectSuccessResponse,
  expectErrorResponse,
  expectNotFoundResponse,
  expectMethodNotAllowedResponse
};