// src/auth/index.js
// Choose which auth strategy to use based on env vars

const hasCognito = !!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID);
const hasBasic = !!process.env.HTPASSWD_FILE;

if (hasCognito && hasBasic) {
  throw new Error(
    'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
  );
}

if (hasCognito) {
  module.exports = require('./cognito');
} else if (hasBasic && process.env.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
} else {
  throw new Error('missing env vars: no authorization configuration found');
}
