const request = require('supertest');
const app = require('../../src/app');

describe('API routes final branch coverage', () => {
  test('returns 404 for unknown API subroute', async () => {
    const res = await request(app)
      .get('/v1/unknown-path')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });

  test('handles malformed request gracefully', async () => {
    const res = await request(app)
      .post('/v1/fragments?weird=true')
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1')
      .send('{"invalid');
    expect([400, 415, 500]).toContain(res.statusCode);
  });
});
