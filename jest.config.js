// App: Full-Stack Application
// Directory: api
// File: jest.config.js
// Version: 1.0.0
// Author: Bobwares CodeBot
// Date: 2025-06-12T06:58:30Z
// Description: Configure Jest testing framework with ES module support.

/**
 * @type {import('jest').Config}
 */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.ts',
    '!src/**/entities/*.ts',
    '!src/**/dtos/*.ts',
    '!src/**/migrations/**',
    '!src/**/customers.repository.ts',
    '!src/**/*.module.ts',
    '!src/logging/request-id.middleware.ts',
    '!src/health/*.ts',
    '!src/app.module.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};