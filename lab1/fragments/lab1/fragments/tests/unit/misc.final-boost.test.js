// tests/unit/misc.final-boost.test.js
const logger = require('../../src/logger');
const dataIndex = require('../../src/model/data/index');

describe('final misc coverage boost', () => {
  test('logger exports expected methods', () => {
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('debug');
  });

  test('data index exposes all expected functions', () => {
    // ✅ check that key data access methods exist
    expect(typeof dataIndex.readFragment).toBe('function');
    expect(typeof dataIndex.writeFragment).toBe('function');
    expect(typeof dataIndex.readFragmentData).toBe('function');
    expect(typeof dataIndex.writeFragmentData).toBe('function');

    // ✅ and that new generic helpers exist
    expect(typeof dataIndex.read).toBe('function');
    expect(typeof dataIndex.write).toBe('function');
    expect(typeof dataIndex.readData).toBe('function');
    expect(typeof dataIndex.writeData).toBe('function');
  });
});
