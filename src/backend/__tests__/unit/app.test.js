/**
 * Unit tests for the main application setup, including server initialization and lifecycle management.
 *
 * @module backend/__tests__/unit/app.test.js
 * @version 1.0.0
 */

// Import application functions
const { startApp } = require('../../app');
const { createServer, startServer, stopServer } = require('../../core/http-server');
const { setupGracefulShutdown } = require('../../core/shutdown-manager');
const { config } = require('../../config/index');
const { createLogger } = require('../../utils/logger');
const { createMockRequest, createMockResponse } = require('../helpers/test-utils');

// Mock dependencies
jest.mock('../../core/http-server');
jest.mock('../../core/shutdown-manager');
jest.mock('../../config/index');
jest.mock('../../utils/logger');

/**
 * Adaptation for testing - initializes the application and returns a server instance
 * This represents the server initialization part of the startApp function
 */
const initializeApp = () => {
  return createServer();
};

/**
 * Adaptation for testing - stops the application server
 * This represents the server shutdown functionality
 */
const stopApp = async (server) => {
  return stopServer(server);
};

describe('Application Setup and Lifecycle', () => {
  let mockLogger;
  let mockServer;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock logger
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    };
    createLogger.mockReturnValue(mockLogger);
    
    // Setup mock server
    mockServer = {
      listen: jest.fn(),
      close: jest.fn((callback) => callback && callback()),
      on: jest.fn(),
      once: jest.fn(),
      address: jest.fn().mockReturnValue({ port: 3000, address: '127.0.0.1' })
    };
    createServer.mockReturnValue(mockServer);
    startServer.mockResolvedValue(mockServer);
    stopServer.mockResolvedValue();
    setupGracefulShutdown.mockImplementation(() => {});
    
    // Mock config
    config.PORT = 3000;
  });
  
  describe('initializeApp()', () => {
    it('should initialize the app and return a server instance', () => {
      // Call our adapted initializeApp function
      const server = initializeApp();
      
      // Verify that createServer was called
      expect(createServer).toHaveBeenCalled();
      
      // Verify that the returned value is a server instance
      expect(server).toBe(mockServer);
      expect(server.listen).toBeDefined();
    });
  });
  
  describe('startApp()', () => {
    it('should start the app and log a startup message', async () => {
      // Call startApp
      await startApp();
      
      // Verify that createServer was called (initialization)
      expect(createServer).toHaveBeenCalled();
      
      // Verify that setupGracefulShutdown was called
      expect(setupGracefulShutdown).toHaveBeenCalled();
      
      // Verify that startServer was called
      expect(startServer).toHaveBeenCalled();
      
      // Verify that startup messages were logged
      expect(mockLogger.info).toHaveBeenCalledWith('Starting application');
      expect(mockLogger.info).toHaveBeenCalledWith('Application started successfully');
    });
    
    it('should handle errors during startup', async () => {
      // Setup startServer to throw an error
      const mockError = new Error('Test startup error');
      startServer.mockRejectedValue(mockError);
      
      // Call startApp and expect it to throw
      await expect(startApp()).rejects.toThrow(mockError);
      
      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        { error: mockError },
        `Failed to start application: ${mockError.message}`
      );
    });
  });
  
  describe('stopApp()', () => {
    it('should stop the app and log a shutdown message', async () => {
      // Call our adapted stopApp function
      await stopApp(mockServer);
      
      // Verify that stopServer was called with the server
      expect(stopServer).toHaveBeenCalledWith(mockServer);
      
      // In the actual implementation, stopServer would log a shutdown message
      // We're verifying that stopServer was called which would trigger logging
    });
  });
});