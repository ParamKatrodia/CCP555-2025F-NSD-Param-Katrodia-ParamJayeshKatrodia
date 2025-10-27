// src/routes/v1.js
const router = require('express').Router();
const apiRouter = require('./api'); // resolves to src/routes/api/index.js
const { authenticate } = require('../auth/basic-auth');

// Health for /v1/
router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok' });
});

// Secure and mount your existing API routes under /v1
router.use(authenticate(), apiRouter);

module.exports = router;