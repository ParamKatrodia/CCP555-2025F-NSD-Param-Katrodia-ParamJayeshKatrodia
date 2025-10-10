// src/routes/index.js
const express = require('express');
const router = express.Router();
const { strategy: authenticate } = require('../auth');

router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok' });
});

router.use('/v1', authenticate(), require('./api'));

module.exports = router;
