/**
 * Unit Tests for Request Handlers
 * 
 * This file contains unit tests for the healthHandler and helloHandler functions.
 * Tests verify that the handlers correctly process requests and generate
 * appropriate responses based on the request method and path.
 * 
 * @version 1.0.0
 */

// Import handlers to test
const helloHandler = require('../../handlers/hello-handler');
const healthHandler = require('../../handlers/health-handler');

// Import mock request/response classes
const { MockRequest, MockResponse } = require('../mocks/http-mocks');

/**
 * Creates a mock request object for testing
 * @param {Object} options - Configuration options for the request
 * @returns {MockRequest} A mock request instance
 */
const createRequest = (options) => new MockRequest(options);

/**
 * Creates a mock response object for testing
 * @returns {MockResponse} A mock response instance
 */
const createResponse = () => new MockResponse();

describe('Hello Handler', () => {
  it('should return "Hello world" with 200 status for GET requests', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/hello' });
    const res = createResponse();
    
    // Act
    helloHandler(req, res);
    
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Hello world');
    expect(res.ended).toBe(true);
  });
  
  it('should return 405 Method Not Allowed for non-GET requests', () => {
    // Arrange
    const req = createRequest({ method: 'POST', url: '/hello' });
    const res = createResponse();
    
    // Act
    helloHandler(req, res);
    
    // Assert
    expect(res.statusCode).toBe(405);
    expect(res.body).toBe('Method Not Allowed');
    expect(res.ended).toBe(true);
  });
  
  it('should set security headers on the response', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/hello' });
    const res = createResponse();
    
    // Act
    helloHandler(req, res);
    
    // Assert
    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['X-Frame-Options']).toBe('DENY');
    expect(res.headers['Content-Security-Policy']).toBe("default-src 'none'");
    expect(res.headers['Cache-Control']).toBe('no-store');
  });
  
  it('should set Content-Type header to text/plain', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/hello' });
    const res = createResponse();
    
    // Act
    helloHandler(req, res);
    
    // Assert
    expect(res.headers['Content-Type']).toBe('text/plain');
  });
});

describe('Health Handler', () => {
  it('should return health data with 200 status for GET requests', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/health' });
    const res = createResponse();
    
    // Act
    healthHandler(req, res);
    
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.ended).toBe(true);
    
    // Parse the response body as JSON and validate structure
    const healthData = JSON.parse(res.body);
    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('uptime');
    expect(healthData).toHaveProperty('memory');
    expect(healthData).toHaveProperty('metrics');
    expect(healthData.metrics).toHaveProperty('requestCount');
    expect(healthData.metrics).toHaveProperty('errorCount');
    
    // Validate data types
    expect(typeof healthData.uptime).toBe('number');
    expect(typeof healthData.memory).toBe('object');
    expect(typeof healthData.metrics.requestCount).toBe('number');
    expect(typeof healthData.metrics.errorCount).toBe('number');
  });
  
  it('should return 405 Method Not Allowed for non-GET requests', () => {
    // Arrange
    const req = createRequest({ method: 'POST', url: '/health' });
    const res = createResponse();
    
    // Act
    healthHandler(req, res);
    
    // Assert
    expect(res.statusCode).toBe(405);
    expect(res.body).toBe('Method Not Allowed');
    expect(res.ended).toBe(true);
  });
  
  it('should set security headers on the response', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/health' });
    const res = createResponse();
    
    // Act
    healthHandler(req, res);
    
    // Assert
    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['X-Frame-Options']).toBe('DENY');
    expect(res.headers['Content-Security-Policy']).toBe("default-src 'none'");
    expect(res.headers['Cache-Control']).toBe('no-store');
  });
  
  it('should increment request count when called', () => {
    // Arrange
    const initialCount = healthHandler.incrementRequestCount();
    
    // Act
    const newCount = healthHandler.incrementRequestCount();
    
    // Assert
    expect(newCount).toBe(initialCount + 1);
  });
  
  it('should increment error count when called', () => {
    // Arrange
    const initialCount = healthHandler.incrementErrorCount();
    
    // Act
    const newCount = healthHandler.incrementErrorCount();
    
    // Assert
    expect(newCount).toBe(initialCount + 1);
  });
  
  it('should include memory usage data in the response', () => {
    // Arrange
    const req = createRequest({ method: 'GET', url: '/health' });
    const res = createResponse();
    
    // Act
    healthHandler(req, res);
    
    // Assert
    const healthData = JSON.parse(res.body);
    expect(healthData.memory).toHaveProperty('rss');
    expect(healthData.memory).toHaveProperty('heapTotal');
    expect(healthData.memory).toHaveProperty('heapUsed');
    expect(healthData.memory).toHaveProperty('external');
    
    // Check that memory values include "MB" unit
    expect(healthData.memory.rss).toMatch(/MB$/);
    expect(healthData.memory.heapTotal).toMatch(/MB$/);
    expect(healthData.memory.heapUsed).toMatch(/MB$/);
    expect(healthData.memory.external).toMatch(/MB$/);
  });
});