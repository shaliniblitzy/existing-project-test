/**
 * Unit tests for the error handling middleware
 * 
 * @jest-environment node
 * @version 1.0.0
 */

const errorHandler = require('../../middleware/error-handler');
const { MockRequest, MockResponse } = require('../mocks/http-mocks');

// Create httpMocks object with createMocks function
const httpMocks = {
  /**
   * Creates mock request, response, and next objects for testing
   * @param {Object} [reqOptions] - Options for the mock request
   * @returns {Object} Object containing mock request, response, and next function
   */
  createMocks: (reqOptions = {}) => {
    const req = new MockRequest(reqOptions);
    const res = new MockResponse();
    
    // Add JSON method for API responses
    res.json = jest.fn(function(data) {
      this.setHeader('Content-Type', 'application/json');
      this.body = JSON.stringify(data);
      this.end();
      return this;
    });
    
    // Mock methods for test spying
    res.status = jest.fn(function(code) {
      this.statusCode = code;
      return this;
    });
    
    const next = jest.fn();
    
    return { req, res, next };
  }
};

describe('Error Handler Middleware', () => {
  test('errorHandler middleware should handle errors and send a JSON response', () => {
    // Create mock request, response, and next objects using httpMocks.createMocks()
    const { req, res, next } = httpMocks.createMocks();
    
    // Define an error object with a message and status code
    const error = new Error('Test error message');
    error.statusCode = 400;
    
    // Call the errorHandler middleware with the error, request, response, and next objects
    errorHandler(error, req, res, next);
    
    // Assert that the response.status() method is called with the error's status code
    expect(res.status).toHaveBeenCalledWith(error.statusCode);
    
    // Assert that the response.json() method is called with an object containing the error message
    expect(res.json).toHaveBeenCalledWith({
      message: error.message
    });
  });
  
  test('errorHandler middleware should handle errors without a status code', () => {
    // Create mock request, response, and next objects using httpMocks.createMocks()
    const { req, res, next } = httpMocks.createMocks();
    
    // Define an error object with only a message
    const error = new Error('Generic error message');
    
    // Call the errorHandler middleware with the error, request, response, and next objects
    errorHandler(error, req, res, next);
    
    // Assert that the response.status() method is called with the default status code 500
    expect(res.status).toHaveBeenCalledWith(500);
    
    // Assert that the response.json() method is called with an object containing the error message
    expect(res.json).toHaveBeenCalledWith({
      message: expect.any(String)
    });
  });
});