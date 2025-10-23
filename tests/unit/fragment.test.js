const Fragment = require('../../src/model/fragment');

test('Fragment requires ownerId and supported type', () => {
  expect(() => new Fragment({ type: 'text/plain' })).toThrow();
  expect(() => new Fragment({ ownerId: 'u', type: 'foo/bar' })).toThrow();
});

test('Fragment save/get round trip', async () => {
  const f = new Fragment({ ownerId: 'u1', type: 'text/plain' });
  await f.setData(Buffer.from('hello'));
  const data = await f.getData();
  expect(String(data)).toBe('hello');
  const list = await Fragment.byUser('u1');
  expect(list).toContain(f.id);
  const again = await Fragment.byId('u1', f.id);
  expect(again.id).toBe(f.id);
});

test('byId returns null for missing fragment', async () => {
  const result = await Fragment.byId('unknown', 'nope');
  expect(result).toBeNull();
});

test('byUser returns array even if empty', async () => {
  const result = await Fragment.byUser('nobody');
  expect(Array.isArray(result)).toBe(true);
});

test('setData updates size and updated timestamp correctly', async () => {
  const Fragment = require('../../src/model/fragment');
  const frag = new Fragment({ ownerId: 'u', type: 'text/plain' });
  const before = new Date(frag.updated).getTime();

  await new Promise((r) => setTimeout(r, 10)); // ensure clock difference
  await frag.setData(Buffer.from('1234'));

  expect(frag.size).toBe(4);
  const after = new Date(frag.updated).getTime();
  expect(after).toBeGreaterThan(before);
});

test('throws error if setData() is called with non-buffer', async () => {
  const Fragment = require('../../src/model/fragment');
  const frag = new Fragment({ ownerId: 'x', type: 'text/plain' });
  await expect(frag.setData('not a buffer')).rejects.toThrow('setData requires a Buffer');
});

test('getData() returns same data saved by setData()', async () => {
  const Fragment = require('../../src/model/fragment');
  const frag = new Fragment({ ownerId: 'booster', type: 'text/plain' });
  const buf = Buffer.from('coverage boost');
  await frag.setData(buf);
  const got = await frag.getData();
  expect(got.equals(buf)).toBe(true);
});
