// tests/unit/app.extra.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('app global error and 404 coverage', () => {
  test('handles invalid route with proper 404 JSON', async () => {
    const res = await request(app).get('/v1/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('not found');
  });

  test('triggers global error handler', async () => {
    // Force an error to bubble up into global handler
    app.get('/v1/error', () => {
      throw new Error('Boom!');
    });

    const res = await request(app).get('/v1/error');
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toMatch(/Boom!/);
  });
});
