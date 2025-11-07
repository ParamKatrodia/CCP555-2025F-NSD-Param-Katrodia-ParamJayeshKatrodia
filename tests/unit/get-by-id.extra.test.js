const request = require('supertest');
const app = require('../../src/app');
const data = require('../../src/model/data');

describe('GET /v1/fragments/:id edge branches', () => {
  afterEach(() => jest.restoreAllMocks());

  test('returns 404 when fragment is missing', async () => {
    jest.spyOn(data, 'readFragment').mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/v1/fragments/missing-id')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('handles thrown error gracefully', async () => {
    jest.spyOn(data, 'readFragment').mockImplementationOnce(() => {
      throw new Error('Crash');
    });
    const res = await request(app)
      .get('/v1/fragments/error-case')
      .auth('user1@email.com', 'password1');
    expect([400, 500]).toContain(res.statusCode);
  });
});
