const hash = require('../../src/hash');

test('hash(email) is deterministic and hides email', () => {
  const one = hash('user@example.com');
  const two = hash('user@example.com');
  expect(one).toBe(two);
  expect(one).not.toMatch(/@example\.com/);
});
