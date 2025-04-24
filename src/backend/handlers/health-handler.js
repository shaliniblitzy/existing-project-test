/**
 * Health Check Endpoint Handler
 * 
 * Provides a health check endpoint that returns basic system health information
 * about the running application, including uptime, memory usage, and request metrics.
 * This handler supports monitoring and observability of the application.
 * 
 * @module handlers/health-handler
 * @version 1.0.0
 */

const { OK } = require('../constants/http-status');
const { 
    formatSuccessResponse, 
    formatMethodNotAllowedResponse,
    setSecurityHeaders 
} = require('../utils/response-formatter');

// Initialize metrics for health checks
const startTime = new Date();
let requestCount = 0;
let errorCount = 0;

/**
 * Handles HTTP requests to the health endpoint, providing basic application health information.
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
function handleHealthRequest(req, res) {
    // Only allow GET requests to health endpoint
    if (req.method !== 'GET') {
        return formatMethodNotAllowedResponse(res);
    }

    // Collect health metrics
    const uptime = getUptimeInSeconds();
    const memoryUsage = getMemoryUsage();
    
    // Create health status object
    const healthStatus = {
        status: 'ok',
        uptime: uptime,
        memory: memoryUsage,
        metrics: {
            requestCount,
            errorCount
        }
    };

    // Convert to JSON string
    const responseBody = JSON.stringify(healthStatus);
    
    // Set security headers
    setSecurityHeaders(res);
    
    // Set content type for JSON response
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = OK;
    res.end(responseBody);
}

/**
 * Increments the global request counter for health metrics.
 * 
 * @returns {number} The new request count after incrementing
 */
function incrementRequestCount() {
    return ++requestCount;
}

/**
 * Increments the global error counter for health metrics.
 * 
 * @returns {number} The new error count after incrementing
 */
function incrementErrorCount() {
    return ++errorCount;
}

/**
 * Calculates the application uptime in seconds since server start.
 * 
 * @returns {number} The number of seconds the application has been running
 */
function getUptimeInSeconds() {
    const currentTime = new Date();
    const uptimeMs = currentTime - startTime;
    return Math.floor(uptimeMs / 1000); // Convert ms to seconds
}

/**
 * Retrieves current memory usage statistics from the Node.js process.
 * 
 * @returns {object} An object containing formatted memory usage statistics
 */
function getMemoryUsage() {
    const memoryData = process.memoryUsage();
    
    // Convert bytes to MB for readability
    return {
        rss: (memoryData.rss / 1024 / 1024).toFixed(2) + ' MB',
        heapTotal: (memoryData.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        heapUsed: (memoryData.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        external: (memoryData.external / 1024 / 1024).toFixed(2) + ' MB'
    };
}

// Export the handler as default and the utility functions as named exports
module.exports = handleHealthRequest;
module.exports.incrementRequestCount = incrementRequestCount;
module.exports.incrementErrorCount = incrementErrorCount;