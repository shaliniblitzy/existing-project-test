/**
 * Error Messages
 * 
 * This module defines standardized error messages used throughout the application
 * for consistent error reporting. These messages are used in HTTP responses for
 * various error conditions to ensure a uniform experience for API consumers.
 *
 * @module constants/error-messages
 */

/**
 * Standardized error messages organized by error type
 * @constant {Object} ERROR_MESSAGES
 */
const ERROR_MESSAGES = {
  /**
   * Used for 404 responses when a requested resource cannot be found
   */
  NOT_FOUND: 'Not Found',
  
  /**
   * Used for 405 responses when the HTTP method is not supported for the endpoint
   */
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  
  /**
   * Used for 500 responses when an unexpected server error occurs
   */
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  
  /**
   * Used as a fallback message when a more specific error message is not available
   */
  DEFAULT_ERROR: 'Something went wrong'
};

// Export the error messages object to make it available to other modules
module.exports = ERROR_MESSAGES;