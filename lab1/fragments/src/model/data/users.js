// src/model/data/users.js
//
// Very small in-memory "users database" used by Basic Auth in tests.
// The unit tests authenticate with:
//   user1@email.com / password1
//   user2@email.com / password2
//
// We keep it intentionally simple (no hashing) so tests remain fast and isolated.
// If HTPASSWD_FILE support is added later, this module is the single place to extend.

const USERS = {
  'user1@email.com': 'password1',
  'user2@email.com': 'password2',
};

/**
 * Get the expected plaintext password for a given username (email).
 * Returns undefined if the user doesn't exist.
 * @param {string} email
 * @returns {string|undefined}
 */
function get(email) {
  return USERS[email];
}

module.exports = { get };
