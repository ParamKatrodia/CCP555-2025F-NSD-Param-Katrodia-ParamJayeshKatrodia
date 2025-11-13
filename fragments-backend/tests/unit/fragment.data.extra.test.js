// tests/unit/fragment.data.extra.test.js
const Fragment = require('../../src/model/fragment');

describe('Fragment class edge coverage', () => {
  test('throws when constructed without ownerId', () => {
    expect(() => new Fragment({ type: 'text/plain' })).toThrow();
  });

  test('throws when constructed with unsupported type', () => {
    expect(() => new Fragment({ ownerId: 'user', type: 'application/json' })).toThrow();
  });

  test('throws when setData called with non-buffer', async () => {
    const frag = new Fragment({ ownerId: 'user', type: 'text/plain' });
    await expect(frag.setData('not-a-buffer')).rejects.toThrow();
  });

  test('isSupportedType ignores charset', () => {
    expect(Fragment.isSupportedType('text/plain; charset=utf-8')).toBe(true);
  });
});
