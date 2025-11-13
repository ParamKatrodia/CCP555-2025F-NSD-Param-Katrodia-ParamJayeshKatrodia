require('dotenv').config({ path: './env.jest' });

module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['./jest.setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/app.js',
    '<rootDir>/src/model/fragment.js',
    '<rootDir>/src/model/data/memory-db.js',
    '<rootDir>/src/routes/api/get-by-id.js',
    '<rootDir>/src/routes/api/post.js'
  ],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
};
