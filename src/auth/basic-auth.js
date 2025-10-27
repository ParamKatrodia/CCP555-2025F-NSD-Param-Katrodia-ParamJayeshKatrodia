// src/auth/basic-auth.js
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');           // <— supports hashed passwords
const authorize = require('./auth-middleware');

// Load users from HTPASSWD_FILE (supports clear text or bcrypt), else lab defaults
function loadUsers() {
  const defaults = new Map([
    ['user1@email.com', 'password1'],
    ['user2@email.com', 'password2'],
  ]);

  const file = process.env.HTPASSWD_FILE;
  if (!file) return defaults;

  try {
    const text = fs.readFileSync(path.resolve(file), 'utf8');
    const map = new Map();

    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;

      // Allow "user:pass" OR "user:hash"
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const user = line.slice(0, idx).trim();
      const secret = line.slice(idx + 1).trim();

      if (user && secret) map.set(user, secret);
    }

    return map.size ? map : defaults;
  } catch {
    return defaults;
  }
}

const users = loadUsers();

function verifyPassword(stored, provided) {
  // If the stored value looks like a bcrypt hash, compare with bcrypt
  if (typeof stored === 'string' && stored.startsWith('$2')) {
    try {
      return bcrypt.compareSync(provided, stored);
    } catch {
      return false;
    }
  }
  // Otherwise treat as clear text
  return stored === provided;
}

passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      const stored = users.get(username);
      if (!stored) return done(null, false);
      if (!verifyPassword(stored, password)) return done(null, false);

      // Passport "user" – our auth middleware will hash email onto req.user
      return done(null, { email: username });
    } catch (e) {
      return done(e);
    }
  })
);

// Export a function returning the middleware the app/router can use.
module.exports.authenticate = () => authorize('basic');