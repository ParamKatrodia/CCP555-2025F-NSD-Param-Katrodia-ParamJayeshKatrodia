const request = require('supertest');
const app = require('../../src/app');

test('GET / returns health check JSON and is not cacheable', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
  expect(res.headers['cache-control']).toMatch(/no-store/);
  expect(res.body.status).toBe('ok');
});
