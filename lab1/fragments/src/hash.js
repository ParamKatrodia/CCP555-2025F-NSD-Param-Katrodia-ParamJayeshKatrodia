const crypto = require('crypto');

/**
 * Produces a sha256 hash of the provided email so that we don't
 * store user data in plain text in our DB (privacy by default).
 * @param {string} email
 * @returns {string} sha256(email).hex
 */
module.exports = (email) =>
  crypto.createHash('sha256').update(email).digest('hex');
