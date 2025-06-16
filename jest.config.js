export default {
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^\\.{1,2}/(lib|handlers)/(.+)\\.js$': '<rootDir>/src/$1/$2.ts',
  },
};
