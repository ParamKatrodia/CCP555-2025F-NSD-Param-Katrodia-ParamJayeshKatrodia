// tests/unit/memory-db.extra.test.js
const db = require('../../src/model/data/memory/memory-db');

describe('memory-db extra coverage helpers', () => {
  test('write(rawKey, fragment) overwrites and keys() includes it', async () => {
    const rawKey = 'unit:overwrite';
    await db.write(rawKey, { id: 'id1', ownerId: 'unit', type: 'text/plain' });
    await db.write(rawKey, { id: 'id1', ownerId: 'unit', type: 'text/plain' }); // overwrite

    const keys = await db.keys();
    expect(keys).toEqual(expect.arrayContaining([rawKey]));
  });

  test('readFragmentData/writeFragmentData round-trip Buffer', async () => {
    const owner = 'ownerRound';
    const id = 'buf1';
    await db.writeFragment(owner, {
      id,
      ownerId: owner,
      type: 'text/plain',
      size: 0,
      created: new Date(),
      updated: new Date(),
    });

    const payload = Buffer.from('roundtrip');
    await db.writeFragmentData(owner, id, payload);
    const got = await db.readFragmentData(owner, id);

    expect(Buffer.isBuffer(got)).toBe(true);
    expect(got.toString()).toBe('roundtrip');
  });
});
