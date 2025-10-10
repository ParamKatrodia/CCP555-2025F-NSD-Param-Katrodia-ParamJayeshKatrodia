const passport = require('passport');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const BearerStrategy = require('passport-http-bearer');
const authorize = require('./auth-middleware');

let verifier;

function configure() {
  if (!verifier) {
    const userPoolId = process.env.AWS_COGNITO_POOL_ID;
    const clientId = process.env.AWS_COGNITO_CLIENT_ID;

    if (!userPoolId || !clientId) {
      throw new Error('Missing AWS_COGNITO_POOL_ID or AWS_COGNITO_CLIENT_ID in .env');
    }

    verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'access',
      clientId,
    });

    passport.use(
      new BearerStrategy(async (token, done) => {
        try {
          const payload = await verifier.verify(token);
          done(null, { email: payload.username || payload.email, sub: payload.sub });
        } catch (_e) {
          done(null, false);
        }
      })
    );
  }
  return passport.initialize();
}

module.exports.authenticate = () => authorize('bearer');
module.exports.strategy = configure;
