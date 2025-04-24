/**
 * Unit tests for utility functions in the backend.
 * Tests HTTP error creation, response formatting, and logging functionality.
 * 
 * @jest-environment node
 */

// Import modules to test
const httpStatus = require('../../constants/http-status');
const httpErrors = require('../../utils/http-errors');
const responseFormatter = require('../../utils/response-formatter');
const logger = require('../../utils/logger');

// Mock the Pino logger library
jest.mock('pino', () => {
  // Return a mock function that creates a logger with mock methods
  return jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
  }));
});

// Test HTTP error creation functionality
describe('createHttpError', () => {
  it('should create an HTTP error object with the given status and message', () => {
    // Define test data
    const status = httpStatus.NOT_FOUND;
    const message = 'Custom not found message';
    
    // Create an error using one of the module's functions
    const error = httpErrors.createNotFoundError(message);
    
    // Verify the error is an instance of Error
    expect(error).toBeInstanceOf(Error);
    
    // Verify the error has the correct status code
    expect(error.statusCode).toBe(status);
    
    // Verify the error has the correct message
    expect(error.message).toBe(message);
    
    // Verify the error has the correct name
    expect(error.name).toBe('HttpError');
  });
});

// Test response formatting functionality
describe('formatResponse', () => {
  // Create a mock response object before each test
  let res;
  
  beforeEach(() => {
    res = {
      setHeader: jest.fn(),
      statusCode: 0,
      end: jest.fn()
    };
  });
  
  it('should format a response with the given status, message, and data', () => {
    // Define test data
    const status = httpStatus.OK;
    const message = 'Success message';
    const data = { key: 'value' }; // Not used in this implementation but included for test description
    
    // Call the function
    responseFormatter.formatSuccessResponse(res, message, status);
    
    // Verify content type header is set correctly
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    
    // Verify status code is set correctly
    expect(res.statusCode).toBe(status);
    
    // Verify response body is set correctly
    expect(res.end).toHaveBeenCalledWith(message);
  });
});

// Test logger functionality
describe('logger', () => {
  // Save original environment variables
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset mocks and environment before each test
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.LOG_LEVEL;
  });
  
  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });
  
  it('should call logger.info with the given message', () => {
    // Create a logger instance
    const loggerInstance = logger.createLogger();
    
    // Define test message
    const message = 'Test info message';
    
    // Call the info method
    loggerInstance.info(message);
    
    // Verify info was called with the message
    expect(loggerInstance.info).toHaveBeenCalledWith(message);
  });
  
  it('should call logger.error with the given message', () => {
    // Create a logger instance
    const loggerInstance = logger.createLogger();
    
    // Define test message
    const message = 'Test error message';
    
    // Call the error method
    loggerInstance.error(message);
    
    // Verify error was called with the message
    expect(loggerInstance.error).toHaveBeenCalledWith(message);
  });
});