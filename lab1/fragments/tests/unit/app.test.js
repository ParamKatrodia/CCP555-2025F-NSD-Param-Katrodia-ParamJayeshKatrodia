// tests/unit/app.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('API Endpoints', () => {
  test('GET / should return 404 for unknown route', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.error).toHaveProperty('message', 'not found');
  });
});
