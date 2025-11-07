// src/model/data.js
// Compatibility shim so `require('../../src/model/data')` always exposes both
// canonical and generic helpers (including 1-arg "owner:id" key support).

const mem = require('./data/memory/memory-db');

// --- helpers ---
function clone(obj) {
  return obj && typeof obj === 'object' ? { ...obj } : obj;
}

// Generic read:
// - read(ownerId, id)       -> meta
// - read("ownerId:id")      -> meta or data (Buffer for data)
async function read(arg1, arg2) {
  if (typeof arg2 === 'undefined') {
    const key = arg1;
    if (mem._meta.has(key)) return clone(mem._meta.get(key));
    if (mem._data.has(key)) return Buffer.from(mem._data.get(key));
    return null;
  }
  return mem.readFragment(arg1, arg2);
}

// Generic write (meta):
async function write(ownerId, fragment) {
  return mem.writeFragment(ownerId, fragment);
}

// Generic data readers/writers with 1-arg support
async function readData(arg1, arg2) {
  if (typeof arg2 === 'undefined') {
    const key = arg1;
    return mem._data.has(key) ? Buffer.from(mem._data.get(key)) : null;
  }
  return mem.readFragmentData(arg1, arg2);
}

async function writeData(arg1, arg2, arg3) {
  if (typeof arg3 === 'undefined') {
    const key = arg1;
    const buffer = arg2;
    if (!Buffer.isBuffer(buffer)) throw new Error('data must be a Buffer');
    mem._data.set(key, Buffer.from(buffer));
    return true;
  }
  return mem.writeFragmentData(arg1, arg2, arg3);
}

async function list(ownerId) {
  return mem.listFragments(ownerId);
}

// Export BOTH canonical and generic APIs
module.exports = {
  // Canonical API
  writeFragment: mem.writeFragment,
  readFragment: mem.readFragment,
  writeFragmentData: mem.writeFragmentData,
  readFragmentData: mem.readFragmentData,
  listFragments: mem.listFragments,

  // Generic aliases used by tests
  write,
  read,
  writeData,
  readData,
  list,

  // Alias for legacy test helper
  readFragmentList: mem.listFragments,

  // Internals
  _meta: mem._meta,
  _data: mem._data,
  _key: mem._key,
};