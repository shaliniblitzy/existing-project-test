/**
 * Error Handling Integration Tests
 * 
 * Tests error handling scenarios to ensure that the server returns appropriate error
 * responses for different types of errors, such as invalid routes or methods.
 * 
 * @module backend/__tests__/integration/error-handling.test
 * @version 1.0.0
 */

// Import test utilities
const supertest = require('supertest'); // v6.3.3
const { setupTestServer, teardownTestServer } = require('../../__tests__/helpers/test-server');
const { createNotFoundError, createMethodNotAllowedError } = require('../../utils/http-errors');
const { PORT } = require('../../config');

// Test variables
let request;

// Setup and teardown
beforeAll(() => {
  request = setupTestServer();
});

afterAll(async () => {
  await teardownTestServer();
});

// Test cases for 404 Not Found errors
describe('404 Not Found Error Handling', () => {
  test('should return 404 status code for non-existent routes', async () => {
    const response = await request.get('/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
    expect(response.headers['content-type']).toContain('text/plain');
  });
  
  test('should return 404 status code for partial match of hello route', async () => {
    const response = await request.get('/hell');
    
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});

// Test cases for 405 Method Not Allowed errors
describe('405 Method Not Allowed Error Handling', () => {
  test('should return 405 status code for POST requests to /hello', async () => {
    const response = await request.post('/hello');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
    expect(response.headers['content-type']).toContain('text/plain');
  });
  
  test('should return 405 status code for PUT requests to /hello', async () => {
    const response = await request.put('/hello');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
    expect(response.headers['content-type']).toContain('text/plain');
  });
  
  test('should return 405 status code for DELETE requests to /hello', async () => {
    const response = await request.delete('/hello');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
    expect(response.headers['content-type']).toContain('text/plain');
  });
  
  test('should return 405 status code for PATCH requests to /hello', async () => {
    const response = await request.patch('/hello');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });
});

// Test error handling for health endpoint
describe('Health Endpoint Error Handling', () => {
  test('should return 405 status code for POST requests to /health', async () => {
    const response = await request.post('/health');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });
  
  test('should return 405 status code for PUT requests to /health', async () => {
    const response = await request.put('/health');
    
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });
});

// Test security headers in error responses
describe('Security Headers in Error Responses', () => {
  test('should include security headers in 404 error responses', async () => {
    const response = await request.get('/nonexistent');
    
    // Check for security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });
  
  test('should include security headers in 405 error responses', async () => {
    const response = await request.post('/hello');
    
    // Check for security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    expect(response.headers['cache-control']).toBe('no-store');
  });
});

// Test error response format consistency
describe('Error Response Format Consistency', () => {
  test('should maintain consistent plain text format for error responses', async () => {
    // Get a 404 error response
    const notFoundResponse = await request.get('/nonexistent');
    
    // Get a 405 error response
    const methodNotAllowedResponse = await request.post('/hello');
    
    // Both should have text/plain content type
    expect(notFoundResponse.headers['content-type']).toContain('text/plain');
    expect(methodNotAllowedResponse.headers['content-type']).toContain('text/plain');
  });
});