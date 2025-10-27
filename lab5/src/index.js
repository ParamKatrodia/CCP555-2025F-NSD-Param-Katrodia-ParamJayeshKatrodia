require('dotenv').config();
const app = require('./app');
const logger = require('./logger');

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  logger.info({ msg: `Server started on port ${port}` });
});

module.exports = server;