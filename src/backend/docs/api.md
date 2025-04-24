# Node.js Hello World API Documentation

This document describes the HTTP API endpoints provided by the Node.js Hello World service.

## Overview

The Node.js Hello World service provides a simple REST API that demonstrates basic HTTP server functionality. The service is designed as an educational tool and reference implementation for Node.js web services.

## Base URL

All API endpoints are relative to the base URL of the deployed service:

```
http://localhost:3000
```

The port may vary based on the PORT environment variable configuration.

## Endpoints

### GET /hello

Returns a simple "Hello world" message.

#### Request

```
GET /hello HTTP/1.1
Host: localhost:3000
```

No request parameters or body required.

#### Response

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

#### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Success. Returns the "Hello world" message. |
| 405 Method Not Allowed | The request used an HTTP method other than GET. |

### GET /health

Returns the health status of the application, including uptime, memory usage, and request statistics.

#### Request

```
GET /health HTTP/1.1
Host: localhost:3000
```

No request parameters or body required.

#### Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "uptime": 60,
  "memoryUsage": {
    "rss": 25,
    "heapTotal": 15,
    "heapUsed": 10,
    "external": 5
  },
  "requestCount": 100,
  "errorCount": 0
}
```

| Field | Description |
|-------|-------------|
| uptime | Time in seconds since the server started |
| memoryUsage | Memory usage statistics in MB |
| requestCount | Total number of requests processed |
| errorCount | Total number of errors encountered |

#### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Success. Returns the health status of the application. |

## Error Handling

The API uses standard HTTP status codes to indicate success or failure of requests.

### Error Response Format

Error responses are returned as plain text with an appropriate HTTP status code.

```
HTTP/1.1 404 Not Found
Content-Type: text/plain
Content-Length: 9

Not Found
```

### Common Error Codes

| Status Code | Description | Possible Cause |
|-------------|-------------|----------------|
| 404 Not Found | The requested resource was not found | Invalid endpoint URL |
| 405 Method Not Allowed | The HTTP method is not supported | Using POST, PUT, etc. on the `/hello` endpoint |
| 500 Internal Server Error | An unexpected error occurred on the server | Server-side exception or failure |

## Usage Examples

### cURL

Requesting the `/hello` endpoint:

```bash
curl -X GET http://localhost:3000/hello
```

Requesting the `/health` endpoint:

```bash
curl -X GET http://localhost:3000/health
```

### JavaScript (Fetch)

```javascript
// Get Hello endpoint
fetch('http://localhost:3000/hello')
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get Health status
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Node.js (HTTP)

```javascript
const http = require('http');

// Request Hello endpoint
http.get('http://localhost:3000/hello', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data); });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
```