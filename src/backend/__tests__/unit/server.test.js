/**
 * Server Unit Tests
 *
 * Tests for the main server functionality, including server startup, shutdown, and error handling.
 *
 * @module backend/__tests__/unit/server.test
 * @version 1.0.0
 */

// Create mock server
const mockServer = {
  listen: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  close: jest.fn(),
  address: jest.fn(),
  listening: true
};

// Create mock logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock dependencies
jest.mock('http', () => ({
  createServer: jest.fn().mockReturnValue(mockServer)
}));

jest.mock('../../utils/logger', () => ({
  createLogger: jest.fn().mockReturnValue(mockLogger)
}));

jest.mock('../../core/request-handler', () => jest.fn());

// After mocking dependencies, import the modules we want to test
const http = require('http');
const { startApp } = require('../../app');
const { createServer, startServer, stopServer } = require('../../core/http-server');
const { setupGracefulShutdown } = require('../../core/shutdown-manager');
const { PORT } = require('../../config');

// Set up mock server address
mockServer.address.mockReturnValue({ port: PORT, address: '127.0.0.1' });

describe('HTTP Server Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Server Creation', () => {
    it('should create a valid HTTP server instance', () => {
      const server = createServer();
      
      expect(http.createServer).toHaveBeenCalled();
      expect(server).toBe(mockServer);
      expect(mockLogger.info).toHaveBeenCalledWith('Creating HTTP server instance');
      expect(mockLogger.info).toHaveBeenCalledWith('HTTP server instance created successfully');
    });

    it('should set up error handler on server creation', () => {
      const server = createServer();
      
      expect(server.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('Server Startup', () => {
    it('should start server on the configured port', async () => {
      // Configure the listen method to call the callback
      mockServer.listen.mockImplementationOnce((port, callback) => {
        callback();
        return mockServer;
      });
      
      const server = createServer();
      await startServer(server);
      
      expect(server.listen).toHaveBeenCalledWith(PORT, expect.any(Function));
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({ port: PORT }),
        expect.stringContaining(`Server is running and listening on port ${PORT}`)
      );
    });

    it('should handle port already in use error', async () => {
      // Configure once to simulate a port in use error
      mockServer.once.mockImplementationOnce((event, callback) => {
        if (event === 'error') {
          const error = new Error('Port already in use');
          error.code = 'EADDRINUSE';
          callback(error);
        }
      });
      
      const server = createServer();
      await expect(startServer(server)).rejects.toThrow('Port already in use');
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ port: PORT }),
        expect.stringContaining(`Port ${PORT} is already in use`)
      );
    });

    it('should handle other startup errors', async () => {
      // Configure once to simulate a generic error
      mockServer.once.mockImplementationOnce((event, callback) => {
        if (event === 'error') {
          callback(new Error('Generic server error'));
        }
      });
      
      const server = createServer();
      await expect(startServer(server)).rejects.toThrow('Generic server error');
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Object) }),
        expect.stringContaining('Error starting server')
      );
    });

    it('should handle startup timeout', async () => {
      // Mock setTimeout to immediately execute the callback
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback) => {
        callback();
        return 1;
      });
      
      // Configure listen to NOT call the callback, simulating a hanging startup
      mockServer.listen.mockImplementationOnce(() => mockServer);
      
      try {
        const server = createServer();
        await expect(startServer(server)).rejects.toThrow('Server startup timed out');
      } finally {
        // Restore the original setTimeout
        global.setTimeout = originalSetTimeout;
      }
    });
  });

  describe('Server Shutdown', () => {
    it('should stop server gracefully', async () => {
      // Configure close to call the callback
      mockServer.close.mockImplementationOnce((callback) => {
        callback();
      });
      
      const server = createServer();
      server.listening = true;
      
      await stopServer(server);
      
      expect(server.close).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Stopping server gracefully...');
      expect(mockLogger.info).toHaveBeenCalledWith('Server stopped successfully');
    });

    it('should handle errors during shutdown', async () => {
      // Configure close to call the callback with an error
      mockServer.close.mockImplementationOnce((callback) => {
        callback(new Error('Error closing server'));
      });
      
      const server = createServer();
      server.listening = true;
      
      await expect(stopServer(server)).rejects.toThrow('Error closing server');
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Object) }),
        expect.stringContaining('Error closing server')
      );
    });

    it('should handle shutdown when server is not running', async () => {
      const server = createServer();
      server.listening = false;
      
      await stopServer(server);
      
      expect(server.close).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Server is already stopped');
    });

    it('should handle shutdown when server is null', async () => {
      await stopServer(null);
      
      expect(mockLogger.warn).toHaveBeenCalledWith('Attempted to stop a server that does not exist');
    });
  });

  describe('Server Error Handling', () => {
    it('should handle server-level errors', () => {
      const server = createServer();
      
      // Get the error handler registered with server.on
      const errorHandler = server.on.mock.calls.find(call => call[0] === 'error')[1];
      
      // Create a test error
      const testError = new Error('Test server error');
      
      // Call the error handler directly
      errorHandler(testError);
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ 
          error: testError,
          stack: testError.stack 
        }),
        expect.stringContaining('Server error: Test server error')
      );
    });

    it('should handle port in use errors specifically', () => {
      const server = createServer();
      
      // Get the error handler registered with server.on
      const errorHandler = server.on.mock.calls.find(call => call[0] === 'error')[1];
      
      // Create a port in use error
      const testError = new Error('Port already in use');
      testError.code = 'EADDRINUSE';
      
      // Call the error handler directly
      errorHandler(testError);
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining(`Port ${PORT} is already in use`)
      );
    });
  });

  describe('Application Integration', () => {
    // Mock the server methods for application tests
    let startServerSpy;
    let createServerSpy;
    let setupGracefulShutdownSpy;
    
    beforeEach(() => {
      // Create spies on the methods we're calling in startApp
      createServerSpy = jest.spyOn(require('../../core/http-server'), 'createServer').mockReturnValue(mockServer);
      startServerSpy = jest.spyOn(require('../../core/http-server'), 'startServer').mockResolvedValue(mockServer);
      setupGracefulShutdownSpy = jest.spyOn(require('../../core/shutdown-manager'), 'setupGracefulShutdown');
    });
    
    afterEach(() => {
      // Restore the original methods
      createServerSpy.mockRestore();
      startServerSpy.mockRestore();
      setupGracefulShutdownSpy.mockRestore();
    });

    it('should start the application successfully', async () => {
      await startApp();
      
      // Verify createServer was called
      expect(createServerSpy).toHaveBeenCalled();
      
      // Verify setupGracefulShutdown was called
      expect(setupGracefulShutdownSpy).toHaveBeenCalled();
      
      // Verify startServer was called
      expect(startServerSpy).toHaveBeenCalled();
      
      // Verify success was logged
      expect(mockLogger.info).toHaveBeenCalledWith('Application started successfully');
    });

    it('should handle errors during application startup', async () => {
      // Make startServer reject with an error
      startServerSpy.mockRejectedValueOnce(new Error('Failed to start server'));
      
      await expect(startApp()).rejects.toThrow('Failed to start server');
      
      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Object) }),
        expect.stringContaining('Failed to start application')
      );
    });
  });
});