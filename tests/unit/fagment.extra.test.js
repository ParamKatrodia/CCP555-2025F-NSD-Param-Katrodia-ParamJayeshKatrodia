// tests/unit/fragment.extra.test.js
const Fragment = require('../../src/model/fragment');

describe('Fragment model extra coverage', () => {
  test('isSupportedType returns true for text/plain and false for others', () => {
    expect(Fragment.isSupportedType('text/plain')).toBe(true);
    expect(Fragment.isSupportedType('application/json')).toBe(false);
    expect(Fragment.isSupportedType(null)).toBe(false); // edge case
    expect(Fragment.isSupportedType(undefined)).toBe(false); // edge case
  });

  test('constructor throws if ownerId or type missing', () => {
    expect(() => new Fragment({ type: 'text/plain' })).toThrow();
    expect(() => new Fragment({ ownerId: 'userX' })).toThrow();
  });

  test('save + setData updates size and can be reloaded via byId', async () => {
    const f = new Fragment({ ownerId: 'u-extra', type: 'text/plain' });
    await f.save();
    await f.setData(Buffer.from('hello'));
    expect(f.size).toBe(5);

    const again = await Fragment.byId('u-extra', f.id);
    expect(again.id).toBe(f.id);
    expect(again.ownerId).toBe('u-extra');
    expect(again.size).toBe(5);
  });

  test('byUser returns an array of ids (possibly empty)', async () => {
    const list = await Fragment.byUser('nobody@example.com');
    expect(Array.isArray(list)).toBe(true);
  });

  test('byUser throws if ownerId missing', async () => {
    await expect(Fragment.byUser()).rejects.toThrow('ownerId is required');
  });
});
