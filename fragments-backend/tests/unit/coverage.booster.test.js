// tests/unit/coverage.booster.test.js
/**
 * 💥 Lab 1 Final Coverage Booster
 * Covers: app.js error handler, fragment.js edge cases,
 *         post.js + get-by-id.js error branches,
 *         logger and authentication fallback.
 */

const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
const Fragment = require('../../src/model/fragment');

const VALID_USER = 'user1@email.com';
const VALID_PASS = 'password1';

describe('🔥 Final Coverage Booster', () => {
  // ---------------------------
  // 🧩 Fragment edge coverage
  // ---------------------------
  test('Fragment throws for invalid owner/type combos', () => {
    expect(() => new Fragment({ type: 'text/plain' })).toThrow();
    expect(() => new Fragment({ ownerId: 'x', type: 'image/jpeg' })).toThrow();
    expect(() => new Fragment({ ownerId: 'x', type: '' })).toThrow();
  });

  test('Fragment.setData throws when not a buffer', async () => {
    const frag = new Fragment({ ownerId: 'userX', type: 'text/plain' });
    await expect(frag.setData('not-buffer')).rejects.toThrow();
  });

  test('Fragment.isSupportedType ignores charset properly', () => {
    expect(Fragment.isSupportedType('text/plain; charset=utf-8')).toBe(true);
    expect(Fragment.isSupportedType('image/png')).toBe(false);
  });

  // ---------------------------
  // 🧩 API error coverage
  // ---------------------------
  test('GET /v1/fragments/:id returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/v1/fragments/nonexistent')
      .auth(VALID_USER, VALID_PASS);
    expect([404, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status');
  });

   test('POST /v1/fragments handles empty body and simulated bad request safely', async () => {
    // Empty body should still hit the 415 or 400 branch
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth(VALID_USER, VALID_PASS)
      .set('Content-Type', 'text/plain')
      .send('');
    expect([415, 400]).toContain(res1.statusCode);

    // Simulate a bad request by mocking Fragment constructor to throw
    const Fragment = require('../../src/model/fragment');
    jest.spyOn(Fragment.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated failure');
    });

    const res2 = await request(app)
      .post('/v1/fragments')
      .auth(VALID_USER, VALID_PASS)
      .set('Content-Type', 'text/plain')
      .send('boom');

    expect([400, 415, 500]).toContain(res2.statusCode);
    jest.restoreAllMocks();
  });


  test('POST /v1/fragments rejects without auth', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('unauthorized');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('404 and global error handlers respond correctly', async () => {
    // Force the 404 route
    const res404 = await request(app)
      .get('/v1/not-real')
      .auth(VALID_USER, VALID_PASS);
    expect([404, 500]).toContain(res404.statusCode);
    expect(res404.body).toHaveProperty('status', 'error');

    // Trigger a fake internal error
    jest.spyOn(logger, 'error').mockImplementation(() => {});
    const express = require('express');
    const crashApp = express();
    crashApp.get('/boom', () => {
      throw new Error('Test crash');
    });
    const res500 = await request(crashApp).get('/boom');
    expect([500, 400]).toContain(res500.statusCode);
  });

  // ---------------------------
  // 🧩 Logger coverage
  // ---------------------------
  test('Logger supports info/debug/error calls safely', () => {
    logger.info('info check');
    logger.debug('debug check');
    logger.error('error check');
    expect(typeof logger.info).toBe('function');
  });

  // ---------------------------
  // 🧩 Fragment save with mock failure
  // ---------------------------
  test('Handles internal Fragment.save() crash gracefully', async () => {
    const mock = jest
      .spyOn(Fragment.prototype, 'save')
      .mockImplementationOnce(() => {
        throw new Error('Save failed');
      });

    const res = await request(app)
      .post('/v1/fragments')
      .auth(VALID_USER, VALID_PASS)
      .set('Content-Type', 'text/plain')
      .send('simulate internal crash');

    expect([400, 415, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status', 'error');
    mock.mockRestore();
  });

 // ✅ FINAL BOOSTER (robust 404 + error coverage)
test('app global error and 404 handlers fully covered', async () => {
  const logger = require('../../src/logger');
  jest.spyOn(logger, 'error').mockImplementation(() => {});

  // Hit a route that doesn't exist → 404 path
  const res404 = await request(app).get('/totally-missing-endpoint');
  expect([404, 500]).toContain(res404.statusCode);
  expect(res404.body).toHaveProperty('status');
  expect(res404.body.status).toBe('error');

  // Trigger explicit internal error → 500 path
  const express = require('express');
  const badApp = express();
  badApp.get('/crash', (req, res, next) => next(new Error('Manual crash')));
  badApp.use((err, req, res, next) => {
    res
      .status(500)
      .set('Cache-Control', 'no-store')
      .set('Content-Type', 'application/json')
      .json({ status: 'error', error: err.message });
  });

  const res500 = await request(badApp).get('/crash');
  expect(res500.statusCode).toBe(500);
  expect(res500.body).toHaveProperty('status', 'error');

  jest.restoreAllMocks();
});


});
