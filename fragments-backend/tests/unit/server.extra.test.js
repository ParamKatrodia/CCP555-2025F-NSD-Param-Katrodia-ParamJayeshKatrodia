// ✅ tests/unit/server.extra.test.js
// Final version matching your actual server.js

jest.mock('stoppable', () => jest.fn((server) => server));

jest.mock('../../src/app', () => {
  const fakeApp = {};
  fakeApp.listen = jest.fn((port) => {
    return { on: jest.fn(), close: jest.fn(), address: () => ({ port }) };
  });
  return fakeApp;
});

describe('server.js behavior', () => {
  let stoppable;
  let app;

  beforeEach(() => {
    jest.resetModules();
    stoppable = require('stoppable');
    app = require('../../src/app');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls app.listen() with given port and wraps it with stoppable()', () => {
    process.env.PORT = '9090';
    const server = require('../../src/server');

    // ✅ Only port argument expected, no callback
    expect(app.listen).toHaveBeenCalledWith('9090');
    expect(stoppable).toHaveBeenCalled();
    expect(server).toBeDefined();
  });

  test('uses default port 8080 when PORT not set', () => {
    delete process.env.PORT;
    const server = require('../../src/server');

    expect(app.listen).toHaveBeenCalledWith(8080);
    expect(stoppable).toHaveBeenCalled();
    expect(server).toBeDefined();
  });
});
