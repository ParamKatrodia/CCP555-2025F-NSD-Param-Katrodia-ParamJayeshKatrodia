const express = require('express');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const v1 = require('./routes/v1.js');
require('./auth/basic-auth'); // registers Basic strategy with passport

const app = express();

// Structured request logging
app.use(pinoHttp({ logger }));

// --- HEALTH CHECK ROUTE (UPDATED FOR LAB 8 + HURL TESTS) ---
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({
    status: "ok",
    author: "Param Jayesh Katrodia <pkatroia@myseneca.ca>",
    githubUrl: "https://github.com/ParamKatrodia/CCP555-2025F-NSD-Param-Katrodia-ParamJayeshKatrodia",
    version: "1.0.0"
  });
});

// Versioned routes
app.use('/v1', v1);

// 404 handler (must be before the error handler)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: { code: 404, message: 'not found' },
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  const status = err?.status || 500;

  // Ensure headers the tests expect
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  logger.error({ err }, 'Unhandled error');

  res.json({
    status: 'error',
    error: { code: status, message: err?.message || 'internal' },
  });
});

module.exports = app;
