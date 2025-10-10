// src/server.js
const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');

const port = process.env.PORT ? process.env.PORT : 8080;

// Start server without inline callback (lets tests mock cleanly)
const serverInstance = app.listen(port);
logger.info(`Server started on port ${port}`);

// Wrap with stoppable for graceful shutdown
const server = stoppable(serverInstance);

module.exports = server;
