const { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

const TABLE = process.env.AWS_DYNAMODB_TABLE;
const BUCKET = process.env.AWS_S3_BUCKET;

module.exports = {
  async writeFragment(ownerId, fragment) {
    const item = {
      ownerId: { S: ownerId },
      id: { S: fragment.id },
      fragment: { S: JSON.stringify(fragment) }
    };
    await dynamo.send(new PutItemCommand({ TableName: TABLE, Item: item }));
  },

  async readFragment(ownerId, id) {
    const result = await dynamo.send(
      new GetItemCommand({
        TableName: TABLE,
        Key: { ownerId: { S: ownerId }, id: { S: id } },
      })
    );

    if (!result.Item) return null;
    return JSON.parse(result.Item.fragment.S);
  },

  async readFragmentList(ownerId) {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "ownerId = :o",
        ExpressionAttributeValues: { ":o": { S: ownerId } }
      })
    );

    return result.Items.map(i => i.id.S);
  },

  async writeFragmentData(ownerId, id, buffer) {
    const key = `${ownerId}/${id}`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer
    }));
  },

  async readFragmentData(ownerId, id) {
    const key = `${ownerId}/${id}`;
    const result = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: key
    }));
    return result.Body.transformToByteArray();
  }
};
