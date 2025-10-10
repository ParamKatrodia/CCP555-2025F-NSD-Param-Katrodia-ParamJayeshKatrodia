// src/model/data/index.js
// Re-export the memory backend AND provide generic aliases used by some tests.
// Supports both 2-arg (ownerId, id) and 1-arg ("ownerId:id") forms for
// meta and data access.

const mem = require('./memory'); // -> src/model/data/memory/index.js -> memory-db.js

function clone(obj) {
  return obj && typeof obj === 'object' ? { ...obj } : obj;
}

/**
 * Generic read:
 *  - read(ownerId, id)              -> meta
 *  - read("ownerId:id")             -> meta OR data (returns Buffer for data)
 */
async function readGeneric(arg1, arg2) {
  if (typeof arg2 === 'undefined') {
    const key = arg1;
    if (mem._meta.has(key)) return clone(mem._meta.get(key));
    if (mem._data.has(key)) return Buffer.from(mem._data.get(key)); // data path
    return null;
  }
  return mem.readFragment(arg1, arg2);
}

/**
 * Generic write:
 *  - write(ownerId, fragment)       -> meta
 */
async function writeGeneric(ownerId, fragment) {
  return mem.writeFragment(ownerId, fragment);
}

/**
 * Generic readData:
 *  - readData(ownerId, id)          -> data
 *  - readData("ownerId:id")         -> data (returns Buffer)
 */
async function readDataGeneric(arg1, arg2) {
  if (typeof arg2 === 'undefined') {
    const key = arg1;
    return mem._data.has(key) ? Buffer.from(mem._data.get(key)) : null;
  }
  return mem.readFragmentData(arg1, arg2);
}

/**
 * Generic writeData:
 *  - writeData(ownerId, id, buffer) -> data
 *  - writeData("ownerId:id", buffer)-> data
 */
async function writeDataGeneric(arg1, arg2, arg3) {
  if (typeof arg3 === 'undefined') {
    const key = arg1;
    const buffer = arg2;
    if (!Buffer.isBuffer(buffer)) throw new Error('data must be a Buffer');
    mem._data.set(key, Buffer.from(buffer));
    return true;
  }
  return mem.writeFragmentData(arg1, arg2, arg3);
}

async function listGeneric(ownerId) {
  return mem.listFragments(ownerId);
}

module.exports = {
  // Canonical API
  writeFragment: mem.writeFragment,
  readFragment: mem.readFragment,
  writeFragmentData: mem.writeFragmentData,
  readFragmentData: mem.readFragmentData,
  listFragments: mem.listFragments,

  // Generic aliases used by tests
  write: writeGeneric,
  read: readGeneric,
  writeData: writeDataGeneric,
  readData: readDataGeneric,
  list: listGeneric,

  // Internals (used by a few tests)
  _meta: mem._meta,
  _data: mem._data,
  _key: mem._key,
};
