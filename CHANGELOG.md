# Changelog

All notable changes to the Hello World service will be documented in this file.

## Format

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-30

### Changed
- Migrated the entire application from Node.js (CommonJS, native `http` module) to Python 3.12 with the Flask framework, using the application-factory pattern (`create_app()`) and Blueprints.
- Production serving now uses Gunicorn (`gunicorn wsgi:app`) instead of `node index.js`.
- Test suite migrated from Jest + SuperTest to pytest (with pytest-flask), using Flask's `test_client`.
- Container image rebased from `node:18-alpine` to `python:3.12-slim`; CI/CD re-pointed from `npm` to `pip` + `pytest`.
- Corrected the `/health` API documentation to match the implemented response shape `{status, uptime, memory, metrics}`.

### Added
- Python/Flask application package under `src/backend/app/` (factory, hello/health blueprints, config, error handlers, response helpers + security headers, in-memory metrics, logging).
- Python dependency manifests: `requirements.txt`, `requirements-dev.txt`, and `pyproject.toml` (with pytest configuration).
- WSGI entry point `src/backend/wsgi.py` exposing `app` for Gunicorn.

### Removed
- Node.js runtime and toolchain: npm, Jest, SuperTest, ESLint, Prettier, nodemon.
- All Node.js source modules under `src/backend/` (replaced by the Flask `app/` package) and the vestigial Express route modules.

### Preserved (behavioral parity)
The external HTTP contract is preserved exactly — identical status codes, content types, response bodies, and headers across all seven scenarios:
- `GET /hello` → `200`, `Content-Type: text/plain`, body `Hello world`.
- Non-GET `/hello` (any method other than GET) → `405`, `Content-Type: text/plain`, body `Method Not Allowed`.
- `GET /health` → `200`, `Content-Type: application/json`, body `{status:"ok", uptime, memory:{rss,heapTotal,heapUsed,external}, metrics:{requestCount,errorCount}}`.
- Non-GET `/health` (any method other than GET) → `405`, `Content-Type: text/plain`, body `Method Not Allowed`.
- Unmatched route → `404`, `Content-Type: text/plain`, body `Not Found`.
- Unhandled exception → `500`, `Content-Type: text/plain`, body `Internal Server Error`.
- Four security headers on every response: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy: default-src 'none'`, `Cache-Control: no-store`.
- Default port `3000`; environment-variable-driven configuration.

## [1.0.0] - 2023-07-15

### Added
- Initial release of the Node.js Hello World service
- HTTP server implementation using Node.js core modules
- Single `/hello` endpoint returning "Hello world" text response
- Server startup and shutdown handling
- Basic error handling for server operations
- Environment variable configuration for server port
- Comprehensive documentation including README and API docs
- Unit and integration tests with Jest
- ESLint and Prettier for code quality
- CI/CD pipeline configuration

## [0.2.0] - 2023-07-01

### Added
- Testing infrastructure with Jest
- ESLint and Prettier configuration
- Error handling middleware
- Graceful shutdown handling

### Changed
- Improved logging with structured format
- Refactored request routing for better maintainability

## [0.1.0] - 2023-06-15

### Added
- Initial project setup
- Basic HTTP server implementation
- Simple `/hello` endpoint
- Project documentation structure