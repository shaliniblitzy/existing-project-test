/**
 * ESLint Configuration
 * 
 * This configuration defines linting rules and code quality standards for the Node.js Hello World application.
 * It ensures consistent code style, prevents common errors, and enforces best practices across the project.
 * 
 * @version 1.0.0
 */

module.exports = {
  // Define environments where the code will run
  env: {
    node: true,     // Node.js global variables and Node.js scoping
    es2022: true,   // Enables ES2022 syntax and global variables
    jest: true      // Jest global variables for testing
  },

  // Extend existing ESLint configurations
  extends: [
    'eslint:recommended',     // ESLint recommended rules
    'plugin:jest/recommended', // Jest-specific recommended rules
    'prettier'                // Disables ESLint rules that conflict with Prettier
  ],

  // JavaScript language options
  parserOptions: {
    ecmaVersion: 2022,  // Parse ECMAScript 2022 (ES13) features
    sourceType: 'module' // Code is in ECMAScript modules
  },

  // ESLint plugins to use
  plugins: [
    'jest' // Plugin for Jest testing framework
  ],

  // Custom ESLint rules for the project
  rules: {
    // Allow console for this simple application
    'no-console': 'off',

    // Prevent unused variables except those prefixed with underscore
    'no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_', 
      'varsIgnorePattern': '^_' 
    }],

    // Allow constant conditions in loops
    'no-constant-condition': ['error', { 'checkLoops': false }],
    
    // Possible errors
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-semi': 'error',
    'no-func-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-obj-calls': 'error',
    'no-prototype-builtins': 'error',
    'no-regex-spaces': 'error',
    'no-sparse-arrays': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    
    // Best practices
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'complexity': ['warn', 10],
    'consistent-return': 'error',
    'curly': ['error', 'all'],
    'dot-notation': 'error',
    'eqeqeq': ['error', 'always'],
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-else-return': 'error',
    'no-empty-function': ['error', { 'allow': ['arrowFunctions'] }],
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'radix': 'error',
    'wrap-iife': ['error', 'any'],
    'yoda': 'error'
  },

  // Special rule configurations for specific file patterns
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off',
        'max-len': 'off'
      }
    }
  ]
};