/**
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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
