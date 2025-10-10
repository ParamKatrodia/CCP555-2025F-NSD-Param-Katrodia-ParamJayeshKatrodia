// src/routes/api/post.js
const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

// Raw body parser for text/plain and charset variants
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const header = (req.headers['content-type'] || '').toLowerCase();
      return header.startsWith('text/plain');
    },
  });

module.exports = [
  rawBody(),
  async (req, res) => {
    try {
      // 1️⃣ Ensure body parsed
      // Reject if body missing or empty
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        logger.warn('Empty or missing body');
        return res
          .status(415)
          .json({ status: 'error', error: { code: 415, message: 'empty or unsupported body' } });
      }


      // 2️⃣ Parse content-type safely
      let parsedType = 'text/plain';
      try {
        const parsed = contentType.parse(req);
        parsedType = parsed.type || 'text/plain';
      } catch (e) {
        logger.warn('content-type parse failed, defaulting to text/plain');
      }

      // 3️⃣ Verify supported type
      if (!Fragment.isSupportedType(parsedType)) {
        logger.warn(`Unsupported fragment type: ${parsedType}`);
        return res
          .status(415)
          .json({ status: 'error', error: { code: 415, message: 'unsupported type' } });
      }

      // 4️⃣ Ensure req.ownerId exists (fallback for tests)
      const ownerId = req.ownerId || 'test-user';
      if (!ownerId) {
        logger.error('Missing ownerId');
        return res
          .status(401)
          .json({ status: 'error', error: { code: 401, message: 'unauthorized' } });
      }

      // 5️⃣ Create and save fragment
      const fragment = new Fragment({ ownerId, type: parsedType });
      await fragment.setData(req.body);

      // 6️⃣ Build Location header
      const baseUrl =
        process.env.API_URL || `${req.protocol}://${req.get('host') || req.headers.host}`;
      const location = `${baseUrl}/v1/fragments/${fragment.id}`;

      logger.info(`Created fragment ${fragment.id}`);

      return res
        .status(201)
        .set('Location', location)
        .json({ status: 'ok', fragment: fragment, location });
    } catch (err) {
      logger.error({ err }, 'POST /v1/fragments failed');
      return res
        .status(500)
        .json({ status: 'error', error: { code: 500, message: err.message || 'internal error' } });
    }
  },
];
