// tests/unit/health.test.js
const request = require('supertest');
const app = require('../../src/app');
const { version, author } = require('../../package.json');

describe('/ health check', () => {
  test('returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('sets Cache-Control no-cache', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cache-control']).toBe('no-cache');
  });

  test('status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.status).toBe('ok');
  });

  test('includes author, githubUrl, version', async () => {
    const res = await request(app).get('/');
    expect(res.body.author).toBe(author);
    expect(typeof res.body.githubUrl).toBe('string');
    expect(res.body.githubUrl.length).toBeGreaterThan(0);
    expect(res.body.version).toBe(version);
  });
});
