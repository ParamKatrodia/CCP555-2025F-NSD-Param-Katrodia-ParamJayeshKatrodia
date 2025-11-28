// src/model/data/aws/index.js

// XXX: temporary use of memory-db until we add DynamoDB
const MemoryDB = require('../memory/memory-db');

const s3Client = require('./s3Client');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const logger = require('../../../logger');

// helper to convert S3 stream -> Buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// ----------------------
// METADATA (in-memory)
// ----------------------

async function writeFragment(ownerId, fragment) {
  return MemoryDB.writeFragment(ownerId, fragment);
}

async function readFragment(ownerId, id) {
  return MemoryDB.readFragment(ownerId, id);
}

async function listFragments(ownerId) {
  return MemoryDB.listFragments(ownerId);
}

// ----------------------
// DATA (S3)
// ----------------------

async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    logger.error({ err, params }, 'Error uploading fragment data to S3');
    throw new Error('unable to upload fragment data');
  }
}

async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  try {
    const res = await s3Client.send(new GetObjectCommand(params));
    return streamToBuffer(res.Body);
  } catch (err) {
    logger.error({ err, params }, 'Error reading fragment data from S3');
    throw new Error('unable to read fragment data');
  }
}

async function deleteFragment(ownerId, id) {
  // delete metadata
  await MemoryDB.deleteFragment(ownerId, id);

  // delete from S3
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    logger.error({ err, params }, 'Error deleting fragment from S3');
    throw new Error('unable to delete fragment data');
  }
}

module.exports = {
  writeFragment,
  readFragment,
  listFragments,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
