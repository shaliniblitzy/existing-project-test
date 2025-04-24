/**
 * Integration Tests for Health Endpoint
 * 
 * This module tests the /health endpoint to verify that it correctly provides
 * application health status information including uptime, memory usage, and request metrics.
 * 
 * @module backend/__tests__/integration/health-endpoint.test
 * @version 1.0.0
 */

// Import test packages
const supertest = require('supertest'); // v6.3.3

// Import test helpers and configuration
const { setupTestServer, teardownTestServer } = require('../../__tests__/helpers/test-server');
const { PORT } = require('../../config');

describe('Health Endpoint', () => {
  let request;

  // Set up the test server before running tests
  beforeAll(() => {
    request = setupTestServer();
  });

  // Tear down the test server after tests complete
  afterAll(async () => {
    await teardownTestServer();
  });

  // Test GET /health returns 200 OK
  it('GET /health should return 200 OK', async () => {
    const response = await request.get('/health');
    expect(response.status).toBe(200);
  });

  // Test GET /health returns JSON with health information
  it('GET /health should return a JSON response with health information', async () => {
    const response = await request.get('/health');
    
    // Verify content type is application/json
    expect(response.headers['content-type']).toContain('application/json');
    
    // Parse response body
    const body = response.body;
    
    // Check that response contains expected properties
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('uptime');
    expect(body).toHaveProperty('memory');
    expect(body).toHaveProperty('metrics');
    
    // Check that status is 'ok'
    expect(body.status).toBe('ok');
    
    // Check that uptime is a number
    expect(typeof body.uptime).toBe('number');
    
    // Check that memory contains expected properties
    expect(body.memory).toHaveProperty('rss');
    expect(body.memory).toHaveProperty('heapTotal');
    expect(body.memory).toHaveProperty('heapUsed');
    expect(body.memory).toHaveProperty('external');
    
    // Check that metrics contains expected properties
    expect(body.metrics).toHaveProperty('requestCount');
    expect(body.metrics).toHaveProperty('errorCount');
    
    // Check that requestCount and errorCount are numbers
    expect(typeof body.metrics.requestCount).toBe('number');
    expect(typeof body.metrics.errorCount).toBe('number');
  });

  // Test GET /health includes security headers
  it('GET /health should include security headers', async () => {
    const response = await request.get('/health');
    
    // Check for security headers
    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
    expect(response.headers).toHaveProperty('content-security-policy');
    expect(response.headers).toHaveProperty('cache-control', 'no-store');
  });

  // Test POST /health returns 405 Method Not Allowed
  it('POST /health should return 405 Method Not Allowed', async () => {
    const response = await request.post('/health');
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });

  // Test PUT /health returns 405 Method Not Allowed
  it('PUT /health should return 405 Method Not Allowed', async () => {
    const response = await request.put('/health');
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });

  // Test DELETE /health returns 405 Method Not Allowed
  it('DELETE /health should return 405 Method Not Allowed', async () => {
    const response = await request.delete('/health');
    expect(response.status).toBe(405);
    expect(response.text).toBe('Method Not Allowed');
  });
});