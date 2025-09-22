// tests/unit/health.test.js
const request = require('supertest');
const app = require('../../src/app');
const { version, author } = require('../../package.json');

describe('/ health check', () => {
  test('returns HTTP 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('sets Cache-Control: no-cache', async () => {
    const res = await request(app).get('/');
    expect(res.headers['cache-control']).toEqual('no-cache');
  });

  test('includes status: ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.status).toBe('ok');
  });

  test('includes version, githubUrl, and author', async () => {
    const res = await request(app).get('/');
    expect(res.body.author).toEqual(author);
    // just check it’s a string and non-empty; tweak if your route returns a specific url
    expect(typeof res.body.githubUrl).toBe('string');
    expect(res.body.githubUrl.length).toBeGreaterThan(0);
    expect(res.body.version).toEqual(version);
  });
});
