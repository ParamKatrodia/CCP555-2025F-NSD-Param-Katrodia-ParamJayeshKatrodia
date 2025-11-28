// If the environment sets an AWS Region, use AWS backend
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
