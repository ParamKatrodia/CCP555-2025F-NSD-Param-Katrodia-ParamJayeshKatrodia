/**
 * In-memory fragment store.
 * Primary keys are `${ownerId}:${id}` for normal app paths.
 * Some tests may write using a single arbitrary key; we support that too.
 */

const meta = new Map();
const data = new Map();

function key(ownerId, id) {
  return `${ownerId}:${id}`;
}

async function writeFragment(ownerId, fragment) {
  meta.set(key(ownerId, fragment.id), { ...fragment });
  return fragment;
}

async function readFragment(ownerId, id) {
  const m = meta.get(key(ownerId, id));
  return m ? { ...m } : null;
}

async function writeFragmentData(ownerId, id, buffer) {
  if (!Buffer.isBuffer(buffer)) throw new Error('data must be a Buffer');
  data.set(key(ownerId, id), Buffer.from(buffer));
  return true;
}

async function readFragmentData(ownerId, id) {
  const buf = data.get(key(ownerId, id));
  return buf ? Buffer.from(buf) : null;
}

async function listFragments(ownerId) {
  const ids = [];
  for (const k of meta.keys()) {
    if (k.startsWith(`${ownerId}:`)) {
      ids.push(k.split(':')[1]);
    }
  }
  return ids;
}

/* ---------- Extra helpers for some tests (non-invasive) ---------- */
async function write(rawKey, fragment) {
  meta.set(rawKey, { ...fragment });
  return fragment;
}

async function keys() {
  return Array.from(meta.keys());
}

module.exports = {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  // helpers for extra tests:
  write,
  keys,
  // internals exposed for advanced assertions:
  _meta: meta,
  _data: data,
  _key: key,
};
