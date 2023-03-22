export default {
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/utils/test/setup-test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
