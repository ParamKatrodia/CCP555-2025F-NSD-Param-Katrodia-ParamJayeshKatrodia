// tests/unit/memory-db.extra2.test.js
const db = require('../../src/model/data/memory/memory-db');

describe('memory-db extra deep coverage', () => {
  test('write() and keys() return expected values', async () => {
    const frag = { id: 'abc', type: 'text/plain' };
    await db.write('ownerX:abc', frag);
    const allKeys = await db.keys();
    expect(allKeys.length).toBeGreaterThan(0);
    expect(allKeys[0]).toContain('ownerX:abc');
  });

  test('readFragment returns null when not found', async () => {
    const res = await db.readFragment('fake', 'none');
    expect(res).toBeNull();
  });

  test('readFragmentData returns null when not found', async () => {
    const res = await db.readFragmentData('fake', 'none');
    expect(res).toBeNull();
  });

  test('throws when writeFragmentData is passed a non-buffer', async () => {
    await expect(db.writeFragmentData('o', 'id', 'not-a-buffer')).rejects.toThrow();
  });
});
