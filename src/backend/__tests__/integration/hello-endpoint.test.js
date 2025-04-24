/**
 * Hello Endpoint Integration Tests
 *
 * This module contains integration tests for the /hello endpoint, verifying that it 
 * correctly returns 'Hello world' for GET requests and appropriate error responses
 * for other HTTP methods.
 *
 * @module backend/__tests__/integration/hello-endpoint.test
 * @version 1.0.0
 */

// Import test utilities for setting up and tearing down the test server
const { setupTestServer, teardownTestServer } = require('../helpers/test-server');

// Import HTTP status codes and error messages for assertions
const { OK, METHOD_NOT_ALLOWED } = require('../../constants/http-status');
const { METHOD_NOT_ALLOWED: METHOD_NOT_ALLOWED_MESSAGE } = require('../../constants/error-messages');

// Import supertest for making HTTP requests
const supertest = require('supertest'); // v6.3.3

// Store the supertest agent for making requests
let request;

describe('Hello Endpoint Integration Tests', () => {
  // Before all tests, set up the test server
  beforeAll(() => {
    request = setupTestServer();
  });

  // After all tests, tear down the test server
  afterAll(async () => {
    await teardownTestServer();
  });

  // Test that GET /hello returns 'Hello world' with status 200
  it("should return 'Hello world' with status 200 for GET /hello", async () => {
    const response = await request.get('/hello');
    
    expect(response.status).toBe(OK);
    expect(response.text).toBe('Hello world');
  });

  // Test that POST /hello returns 405 Method Not Allowed
  it('should return 405 Method Not Allowed for POST /hello', async () => {
    const response = await request.post('/hello');
    
    expect(response.status).toBe(METHOD_NOT_ALLOWED);
    expect(response.text).toBe(METHOD_NOT_ALLOWED_MESSAGE);
  });

  // Test that PUT /hello returns 405 Method Not Allowed
  it('should return 405 Method Not Allowed for PUT /hello', async () => {
    const response = await request.put('/hello');
    
    expect(response.status).toBe(METHOD_NOT_ALLOWED);
    expect(response.text).toBe(METHOD_NOT_ALLOWED_MESSAGE);
  });

  // Test that DELETE /hello returns 405 Method Not Allowed
  it('should return 405 Method Not Allowed for DELETE /hello', async () => {
    const response = await request.delete('/hello');
    
    expect(response.status).toBe(METHOD_NOT_ALLOWED);
    expect(response.text).toBe(METHOD_NOT_ALLOWED_MESSAGE);
  });

  // Test that PATCH /hello returns 405 Method Not Allowed
  it('should return 405 Method Not Allowed for PATCH /hello', async () => {
    const response = await request.patch('/hello');
    
    expect(response.status).toBe(METHOD_NOT_ALLOWED);
    expect(response.text).toBe(METHOD_NOT_ALLOWED_MESSAGE);
  });
});