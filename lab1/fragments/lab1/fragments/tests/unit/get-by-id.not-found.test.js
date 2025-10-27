// tests/unit/get-by-id.not-found.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id not found', () => {
  test('returns 404 JSON error for unknown id', async () => {
    const res = await request(app).get('/v1/fragments/does-not-exist')
      .auth('user1@email.com', 'password1'); // valid basic auth
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'error',
        error: expect.objectContaining({ code: 404 }),
      })
    );
  });
});
