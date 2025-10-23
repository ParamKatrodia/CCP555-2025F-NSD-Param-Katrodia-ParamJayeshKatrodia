// tests/unit/error-handler.test.js
const request = require('supertest');
const app = require('../../src/app');

// We will force the GET /v1/fragments handler to error by making Fragment.byUser throw
jest.mock('../../src/model/fragment', () => {
  const actual = jest.requireActual('../../src/model/fragment');
  return {
    ...actual,
    byUser: jest.fn(() => {
      throw new Error('boom');
    }),
  };
});

describe('App global error handler', () => {
  test('returns JSON 500 with status=error for thrown route errors', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1'); // from tests/.htpasswd

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'error',
        error: expect.objectContaining({
          message: expect.any(String),
          code: 500,
        }),
      })
    );
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.headers['cache-control']).toMatch(/no-store/);
  });
});
