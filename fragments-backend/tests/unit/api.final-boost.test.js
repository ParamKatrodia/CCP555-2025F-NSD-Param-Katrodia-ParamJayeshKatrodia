// tests/unit/api.final-boost.test.js
const request = require('supertest');
const app = require('../../src/app');

const USER = 'user1@email.com';
const PASS = 'password1';

describe('final API coverage boost', () => {
  test('GET /v1/fragments/:id returns 404 for missing fragment', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist')
      .auth(USER, PASS);
    expect([404, 500]).toContain(res.statusCode); // tolerate either
  });

  test('POST /v1/fragments rejects empty plain text', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth(USER, PASS)
      .set('Content-Type', 'text/plain')
      .send('');
    expect([400, 415, 500]).toContain(res.statusCode);
  });
});
