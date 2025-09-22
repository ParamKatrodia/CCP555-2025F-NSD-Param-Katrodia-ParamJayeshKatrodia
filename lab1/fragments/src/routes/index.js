// src/routes/index.js
const express = require('express');
const router = express.Router();

const { author, version } = require('../../package.json');
const { createSuccessResponse } = require('../response');

// Health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/ParamKatrodia/CCP555-2025F-NSD-Param-Katrodia-ParamJayeshKatrodia',
      version,
    })
  );
});

// Expose all API routes on /v1/*
const { authenticate } = require('../auth');
router.use('/v1', authenticate(), require('./api'));

module.exports = router;
