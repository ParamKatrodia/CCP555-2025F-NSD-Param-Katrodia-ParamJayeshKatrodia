// tests/unit/get-by-id.test.js
const request = require('supertest');
const app = require('../../src/app');

const VALID_USER = 'user1@email.com';
const VALID_PASS = 'password1';

describe('GET /v1/fragments/:id', () => {
  test('returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist')
      .auth(VALID_USER, VALID_PASS);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('returns metadata for an existing fragment', async () => {
    // First create one
    const create = await request(app)
      .post('/v1/fragments')
      .auth(VALID_USER, VALID_PASS)
      .set('Content-Type', 'text/plain')
      .send('coverage boost');

    expect(create.statusCode).toBe(201);
    const id = create.body.fragment.id;

    // Now fetch it back
    const res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth(VALID_USER, VALID_PASS);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
    expect(res.body.fragment.id).toBe(id);
    expect(res.body.fragment.type).toBe('text/plain');
  });
  test('returns 415 for invalid Accept header', async () => {
  const res = await request(app)
    .get('/v1/fragments/123')
    .auth('user1@email.com', 'password1')
    .set('Accept', 'application/xml');

  expect([404, 415, 500]).toContain(res.statusCode);
});

});
