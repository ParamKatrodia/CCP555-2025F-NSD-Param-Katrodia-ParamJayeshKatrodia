const {
  createErrorResponse,
  createSuccessResponse,
  createSuccessResponseData,
} = require('../../src/response');

test('createSuccessResponse()', () => {
  expect(createSuccessResponse()).toEqual({ status: 'ok' });
});

test('createSuccessResponseData(data)', () => {
  const data = { a: 1 };
  expect(createSuccessResponseData(data)).toEqual({ status: 'ok', data });
});

test('createErrorResponse()', () => {
  const r = createErrorResponse();
  expect(r.status).toBe('error');
  expect(r.error.code).toBeDefined();
  expect(r.error.message).toBeDefined();
});
