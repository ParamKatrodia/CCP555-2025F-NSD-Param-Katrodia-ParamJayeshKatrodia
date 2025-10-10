// jest.config.js
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app.js',
    'src/model/fragment.js',
    'src/model/data/memory-db.js',
    'src/routes/api/get-by-id.js',
    'src/routes/api/post.js'
  ],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85
    }
  }
};
