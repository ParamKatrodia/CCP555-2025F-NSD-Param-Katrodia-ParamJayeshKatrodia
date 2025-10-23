// tests/unit/memory-db.test.js
const db = require('../../src/model/data/memory/memory-db');

describe('memory-db basic CRUD', () => {
  test('write/read fragment meta', async () => {
    const owner = 'ownerA';
    const frag = {
      id: 'f1',
      ownerId: owner,
      type: 'text/plain',
      size: 0,
      created: new Date(),
      updated: new Date(),
    };

    await db.writeFragment(owner, frag);
    const got = await db.readFragment(owner, 'f1');

    expect(got).toBeTruthy();
    expect(got.id).toBe('f1');
    expect(got.ownerId).toBe(owner);
    expect(got.type).toBe('text/plain');
  });

  test('write/read fragment DATA buffer', async () => {
    const owner = 'ownerB';
    const id = 'f2';
    const meta = {
      id,
      ownerId: owner,
      type: 'text/plain',
      size: 0,
      created: new Date(),
      updated: new Date(),
    };

    await db.writeFragment(owner, meta);
    await db.writeFragmentData(owner, id, Buffer.from('hello'));
    const buf = await db.readFragmentData(owner, id);

    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.toString()).toBe('hello');
  });

  test('listFragments returns ids for owner', async () => {
    const owner = 'ownerC';
    await db.writeFragment(owner, {
      id: 'x1',
      ownerId: owner,
      type: 'text/plain',
      size: 0,
      created: new Date(),
      updated: new Date(),
    });
    await db.writeFragment(owner, {
      id: 'x2',
      ownerId: owner,
      type: 'text/plain',
      size: 0,
      created: new Date(),
      updated: new Date(),
    });

    const ids = await db.listFragments(owner);
    expect(ids).toEqual(expect.arrayContaining(['x1', 'x2']));
  });
  test('write() and keys() helper store and list fragments', async () => {
  const fragment = { id: 'abc', type: 'text/plain' };
  await db.write('owner:abc', fragment);
  const keys = await db.keys();
  expect(keys.some(k => k.includes('owner:abc'))).toBe(true);
});

});
