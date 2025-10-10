// src/auth/index.js
const passport = require('passport');
const basic = require('./basic-auth'); // Lab 1 uses Basic Auth

module.exports = {
  initialize: () => passport.initialize(),
  // app/router will call auth.strategy()
  strategy: () => basic.authenticate(),
};
