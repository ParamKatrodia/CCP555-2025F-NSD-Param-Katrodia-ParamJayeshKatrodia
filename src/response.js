/**
 * Helpers for consistent API responses
 */
const createErrorResponse = (code = 500, message = 'unable to process request') => ({
  status: 'error',
  error: { code, message },
});

const createSuccessResponse = () => ({
  status: 'ok',
});

const createSuccessResponseData = (data) => ({
  status: 'ok',
  data,
});

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  createSuccessResponseData,
};