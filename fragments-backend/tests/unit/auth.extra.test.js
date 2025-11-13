// tests/unit/auth.extra.test.js
const authorize = require('../../src/auth/auth-middleware');
const basic = require('../../src/auth/basic-auth');

const fakeRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe('auth coverage boost', () => {
  test('authorize("http") returns a middleware function', () => {
    const fn = authorize('http');
    expect(typeof fn).toBe('function');
  });

  test('middleware calls next() when user exists', () => {
    const fn = authorize('http');
    const req = { user: { email: 'user1@email.com' } };
    const next = jest.fn();
    fn(req, fakeRes, next);
    expect(next).toHaveBeenCalled();
  });

  test('middleware handles missing user safely (no crash)', () => {
    const fn = authorize('http');
    const req = {}; // no user
    const next = jest.fn();
    expect(() => fn(req, fakeRes, next)).not.toThrow();
  });

  test('basic-auth exports authenticate() function', () => {
    const authFn = basic.authenticate();
    expect(typeof authFn).toBe('function');
  });
});
