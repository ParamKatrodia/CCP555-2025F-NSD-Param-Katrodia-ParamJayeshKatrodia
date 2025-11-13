const db = require('./memory-db');

const fragKey = (ownerId, id) => `fragment:${ownerId}:${id}`;
const dataKey = (ownerId, id) => `data:${ownerId}:${id}`;

module.exports = {
  // fragment metadata (object)
  async writeFragment(ownerId, fragment) {
    await db.write(fragKey(ownerId, fragment.id), fragment);
  },

  async readFragment(ownerId, id) {
    return db.read(fragKey(ownerId, id));
  },

  async readFragmentList(ownerId) {
    const keys = await db.keys(`fragment:${ownerId}:`);
    return keys.map((k) => k.split(':').pop());
  },

  // raw data (Buffer)
  async writeFragmentData(ownerId, id, buffer) {
    await db.write(dataKey(ownerId, id), Buffer.from(buffer));
  },

  async readFragmentData(ownerId, id) {
    return db.read(dataKey(ownerId, id));
  },
};
