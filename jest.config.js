/** @type {import('jest').Config} */
export default {
  // Use the ESM-aware preset
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  // Let ts-jest read the real tsconfig instead of an inline override
  injectGlobals: true,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.json'
      }
    ]
  },
  moduleNameMapper: {
    // keep relative imports intact (e.g., './foo.js' → './foo')
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/test/unit/**/*.test.ts', '**/test/unit/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['<rootDir>/src/handlers/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.ts',
    '!src/**/entities/*.ts',
    '!src/**/dtos/*.ts',
    '!src/**/migrations/**',
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