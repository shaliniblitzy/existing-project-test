/**
 * Unit tests for the configuration module.
 * Tests verify that configuration is loaded correctly from environment variables
 * and that default values are used when environment variables are not set.
 */

// Import the configuration modules to test
const { PORT, NODE_ENV, LOG_LEVEL } = require('src/backend/config/index.js');
const environment = require('src/backend/config/environment.js');

// Preserve original environment values for restoration after tests
let originalEnv;

describe('config', () => {
  // Save original environment before each test
  beforeEach(() => {
    originalEnv = {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      LOG_LEVEL: process.env.LOG_LEVEL
    };
  });

  // Restore original environment after each test
  afterEach(() => {
    if (originalEnv.PORT === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalEnv.PORT;
    }

    if (originalEnv.NODE_ENV === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalEnv.NODE_ENV;
    }

    if (originalEnv.LOG_LEVEL === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = originalEnv.LOG_LEVEL;
    }
  });

  it('should load default values when environment variables are not set', () => {
    // Delete environment variables to test defaults
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;

    // Re-import to get fresh config with updated environment
    jest.resetModules();
    const config = require('src/backend/config/index.js');

    // Verify default values are used
    expect(config.PORT).toBe(3000);
    expect(config.NODE_ENV).toBe('development');
    expect(config.LOG_LEVEL).toBe('info');
  });

  it('should load values from environment variables when they are set', () => {
    // Set environment variables
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'debug';

    // Re-import to get fresh config with updated environment
    jest.resetModules();
    const config = require('src/backend/config/index.js');

    // Verify environment values are used
    expect(config.PORT).toBe(4000);
    expect(config.NODE_ENV).toBe('production');
    expect(config.LOG_LEVEL).toBe('debug');
  });
  
  it('should validate PORT to be within valid range', () => {
    // Test invalid port
    process.env.PORT = 'invalid';
    jest.resetModules();
    const configWithInvalidPort = require('src/backend/config/index.js');
    
    // Should use default port when invalid
    expect(configWithInvalidPort.PORT).toBe(3000);
    
    // Test out of range port
    process.env.PORT = '70000'; // Outside valid range (1-65535)
    jest.resetModules();
    const configWithOutOfRangePort = require('src/backend/config/index.js');
    
    // Should use default port when out of range
    expect(configWithOutOfRangePort.PORT).toBe(3000);
    
    // Test valid port
    process.env.PORT = '8080';
    jest.resetModules();
    const configWithValidPort = require('src/backend/config/index.js');
    
    // Should use the provided port when valid
    expect(configWithValidPort.PORT).toBe(8080);
  });
  
  it('should validate NODE_ENV to be one of the valid environments', () => {
    // Test invalid environment
    process.env.NODE_ENV = 'invalid';
    jest.resetModules();
    const configWithInvalidEnv = require('src/backend/config/index.js');
    
    // Should use default environment when invalid
    expect(configWithInvalidEnv.NODE_ENV).toBe('development');
    
    // Test valid environments
    const validEnvironments = ['development', 'production', 'test'];
    
    validEnvironments.forEach(env => {
      process.env.NODE_ENV = env;
      jest.resetModules();
      const config = require('src/backend/config/index.js');
      expect(config.NODE_ENV).toBe(env);
    });
  });
  
  it('should set environment state flags correctly', () => {
    // Test production environment
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const prodConfig = require('src/backend/config/index.js');
    
    expect(prodConfig.IS_PRODUCTION).toBe(true);
    expect(prodConfig.IS_DEVELOPMENT).toBe(false);
    expect(prodConfig.IS_TEST).toBe(false);
    
    // Test development environment
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    const devConfig = require('src/backend/config/index.js');
    
    expect(devConfig.IS_PRODUCTION).toBe(false);
    expect(devConfig.IS_DEVELOPMENT).toBe(true);
    expect(devConfig.IS_TEST).toBe(false);
    
    // Test test environment
    process.env.NODE_ENV = 'test';
    jest.resetModules();
    const testConfig = require('src/backend/config/index.js');
    
    expect(testConfig.IS_PRODUCTION).toBe(false);
    expect(testConfig.IS_DEVELOPMENT).toBe(false);
    expect(testConfig.IS_TEST).toBe(true);
  });
});