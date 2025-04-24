/**
 * HTTP Mocks for Testing
 * 
 * This module provides mock implementations of HTTP request and response objects
 * for testing purposes. These mocks simulate the behavior of Node.js HTTP objects
 * while allowing for easier testing and inspection of their usage.
 * 
 * @module http-mocks
 * @version 1.0.0
 */

const url = require('url'); // built-in
const HTTP_STATUS = require('../../constants/http-status');

/**
 * A mock implementation of the Node.js HTTP request object for testing purposes
 * @class MockRequest
 */
class MockRequest {
  /**
   * Creates a new MockRequest instance with the specified options
   * @param {Object} options - Configuration options for the request
   * @param {string} [options.method='GET'] - The HTTP method
   * @param {string} [options.url='/'] - The request URL
   * @param {Object} [options.headers={}] - HTTP headers
   */
  constructor(options = {}) {
    // Set default options if none provided
    options = options || {};
    
    // Set this.method to options.method or default to 'GET'
    this.method = options.method || 'GET';
    
    // Set this.url to options.url or default to '/'
    this.url = options.url || '/';
    
    // Set this.headers to options.headers or default to empty object
    this.headers = options.headers || {};
    
    // Set this.socket to a mock socket object with remoteAddress property
    this.socket = {
      remoteAddress: '127.0.0.1'
    };
  }
}

/**
 * A mock implementation of the Node.js HTTP response object for testing purposes
 * @class MockResponse
 */
class MockResponse {
  /**
   * Creates a new MockResponse instance
   */
  constructor() {
    // Initialize this.headers as an empty object
    this.headers = {};
    
    // Set this.statusCode to HTTP_STATUS.OK (200) as default
    this.statusCode = HTTP_STATUS.OK;
    
    // Set this.ended to false
    this.ended = false;
    
    // Set this.body to null
    this.body = null;
  }

  /**
   * Sets a header value on the response
   * @param {string} name - The header name
   * @param {string} value - The header value
   * @returns {MockResponse} - Returns this for method chaining
   */
  setHeader(name, value) {
    // Set this.headers[name] = value
    this.headers[name] = value;
    
    // Return this for method chaining
    return this;
  }

  /**
   * Gets a header value from the response
   * @param {string} name - The header name
   * @returns {string|undefined} - The header value or undefined if not set
   */
  getHeader(name) {
    // Return this.headers[name]
    return this.headers[name];
  }

  /**
   * Removes a header from the response
   * @param {string} name - The header name
   * @returns {MockResponse} - Returns this for method chaining
   */
  removeHeader(name) {
    // Delete this.headers[name]
    delete this.headers[name];
    
    // Return this for method chaining
    return this;
  }

  /**
   * Sets the status code and headers on the response
   * @param {number} statusCode - The HTTP status code
   * @param {Object} [headers] - Optional headers to set
   * @returns {MockResponse} - Returns this for method chaining
   */
  writeHead(statusCode, headers) {
    // Set this.statusCode to statusCode
    this.statusCode = statusCode;
    
    // If headers is provided, merge them with this.headers
    if (headers) {
      this.headers = { ...this.headers, ...headers };
    }
    
    // Return this for method chaining
    return this;
  }

  /**
   * Sets the status code on the response
   * @param {number} statusCode - The HTTP status code
   * @returns {MockResponse} - Returns this for method chaining
   */
  status(statusCode) {
    // Set this.statusCode to statusCode
    this.statusCode = statusCode;
    
    // Return this for method chaining
    return this;
  }

  /**
   * Writes data to the response body
   * @param {string} data - The data to write
   * @returns {MockResponse} - Returns this for method chaining
   */
  write(data) {
    // If this.body is null, set it to an empty string
    if (this.body === null) {
      this.body = '';
    }
    
    // Append data to this.body
    this.body += data;
    
    // Return this for method chaining
    return this;
  }

  /**
   * Ends the response with optional data
   * @param {string} [data] - Optional data to write before ending
   * @returns {MockResponse} - Returns this for method chaining
   */
  end(data) {
    // If data is provided, call this.write(data)
    if (data) {
      this.write(data);
    }
    
    // Set this.ended to true
    this.ended = true;
    
    // Return this for method chaining
    return this;
  }
}

module.exports = {
  MockRequest,
  MockResponse
};