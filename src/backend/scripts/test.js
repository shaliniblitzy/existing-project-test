#!/usr/bin/env node

/**
 * @fileoverview This script executes the test suite for the backend application.
 * It serves as a simple wrapper around the jest command-line interface.
 * When executed through npm scripts (e.g., 'npm test'), it will run the jest test runner,
 * which will find and execute all files matching the test patterns defined in the jest configuration.
 */

// Import the jest CLI runner - jest version 29.7.0
const jest = require('jest');

/**
 * Run the Jest test suite with any command-line arguments that were passed to this script.
 * This allows for flexible test execution with various options like:
 * - Running specific test files
 * - Setting coverage reporting
 * - Configuring watch mode
 * - Other Jest CLI options
 */
jest.run(process.argv.slice(2));