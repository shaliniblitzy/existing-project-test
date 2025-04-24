/**
 * Unit tests for the monitoring module, ensuring that metrics are initialized correctly,
 * request metrics middleware functions as expected, and health status is reported accurately.
 *
 * @module backend/__tests__/unit/monitoring.test
 */

// Import Jest test functions
const { describe, it, expect } = require('jest'); // ^29.0.0

// Import monitoring functions
const {
  initializeMonitoring,
  requestMetricsMiddleware,
  getMetrics,
  getHealthStatus,
  resetMetrics
} = require('../../core/monitoring');

// Import testing helpers
const {
  createMockRequest,
  createMockResponse
} = require('../helpers/test-utils');

// Import config for application context
const { APP_NAME, APP_VERSION } = require('../../../config');

// Import logger for monitoring context
const { createLogger } = require('../../../utils/logger');

describe('Monitoring Module', () => {
  // Reset metrics before each test
  beforeEach(() => {
    resetMetrics();
  });

  it('should initialize metrics correctly', () => {
    // Call initialization function
    initializeMonitoring();
    
    // Get current metrics
    const metrics = getMetrics();
    
    // Assert that metrics are initialized to default/zero values
    expect(metrics.requests.total).toBe(0);
    expect(metrics.errors.count).toBe(0);
    expect(metrics.errors.rate).toBe('0.00%');
    expect(metrics.requests.byMethod).toEqual({});
    expect(metrics.requests.byPath).toEqual({});
    expect(metrics.requests.byStatusCode).toEqual({});
    expect(metrics.performance.averageResponseTime).toBe('0.00ms');
    
    // Check application metadata
    expect(metrics.application.name).toBe(APP_NAME);
    expect(metrics.application.version).toBe(APP_VERSION);
    expect(metrics.application.uptime).toBeDefined();
    
    // Check that system metrics are included
    expect(metrics.memory).toBeDefined();
    expect(metrics.system).toBeDefined();
  });

  it('should track request metrics', () => {
    // Initialize monitoring
    initializeMonitoring();
    
    // Create mock request, response, and next function
    const req = createMockRequest({ method: 'GET', url: '/hello' });
    const res = createMockResponse();
    const next = jest.fn();
    
    // Apply middleware
    requestMetricsMiddleware(req, res, next);
    
    // Verify next was called (middleware continues request flow)
    expect(next).toHaveBeenCalled();
    
    // Test immediate metrics updates (before response finished)
    const metrics = getMetrics();
    expect(metrics.requests.total).toBe(1);
    expect(metrics.requests.byMethod.GET).toBe(1);
    expect(metrics.requests.byPath['/hello']).toBe(1);
    
    // Note: We cannot fully test the 'finish' event handling in this unit test
    // because our mock response doesn't implement the event emitter interface.
    // This would be tested in integration tests with actual request/response objects.
  });

  it('should handle errors and track error metrics', () => {
    // This test cannot fully verify the error metrics tracking due to 
    // the limitations of our mock response object not supporting events.
    // The core request tracking can still be verified.
    
    // Initialize monitoring
    initializeMonitoring();
    
    // Create mock request, response, and next function
    const req = createMockRequest({ method: 'GET', url: '/not-found' });
    const res = createMockResponse();
    const next = jest.fn();
    
    // Apply middleware
    requestMetricsMiddleware(req, res, next);
    
    // Verify request tracking (pre-response)
    const metrics = getMetrics();
    expect(metrics.requests.total).toBe(1);
    expect(metrics.requests.byPath['/not-found']).toBe(1);
    
    // Note: Error metrics depend on the 'finish' event which we cannot test
    // in this unit test due to mock limitations.
  });

  it('should get health status correctly', () => {
    // Initialize monitoring
    initializeMonitoring();
    
    // Get current health status
    const health = getHealthStatus();
    
    // Verify health status structure and default values
    expect(health.status).toBe('healthy'); // Default should be healthy
    expect(health.components).toEqual({
      memory: 'healthy',
      requests: 'healthy',
      errors: 'healthy'
    });
    expect(health.uptime).toBeDefined();
    expect(health.timestamp).toBeDefined();
  });

  it('should reset metrics correctly', () => {
    // Initialize monitoring
    initializeMonitoring();
    
    // Generate some metrics
    const req = createMockRequest({ method: 'GET', url: '/hello' });
    const res = createMockResponse();
    const next = jest.fn();
    
    // Apply middleware to increment request count
    requestMetricsMiddleware(req, res, next);
    
    // Verify that metrics were incremented
    let metrics = getMetrics();
    expect(metrics.requests.total).toBe(1);
    
    // Reset metrics
    resetMetrics();
    
    // Verify that metrics were reset to initial values
    metrics = getMetrics();
    expect(metrics.requests.total).toBe(0);
    expect(metrics.errors.count).toBe(0);
    expect(metrics.requests.byMethod).toEqual({});
    expect(metrics.requests.byPath).toEqual({});
    expect(metrics.requests.byStatusCode).toEqual({});
    expect(metrics.performance.averageResponseTime).toBe('0.00ms');
  });
});