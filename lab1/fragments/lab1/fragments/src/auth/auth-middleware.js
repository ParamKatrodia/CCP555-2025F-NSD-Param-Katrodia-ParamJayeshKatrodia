// src/auth/auth-middleware.js
const passport = require('passport');
const hash = require('../hash');

// Wraps a passport strategy and attaches a hashed user id to req.user.
// On failure, returns a 401 JSON error (as tests expect).
module.exports = (strategyName) => (req, res, next) => {
  const handler = passport.authenticate(strategyName, { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', error: { message: 'unauthorized', code: 401 } });
    }
    const email = user.email || user;        // allow string or { email }
    req.user = hash(email);                  // store hashed id on req.user
    next();
  });

  handler(req, res, next);
};