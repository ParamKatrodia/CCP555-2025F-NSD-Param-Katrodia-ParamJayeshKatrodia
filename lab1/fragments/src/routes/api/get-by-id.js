// src/routes/api/get-by-id.js
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const frag = await Fragment.byId(req.ownerId || 'test-user', id);
    if (!frag) {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'not found' } });
    }

    // Check if request is for metadata only (no extension, no ?data=1)
    const wantsData =
      req.url.endsWith('/data') ||
      req.query.data === '1' ||
      req.get('Accept')?.startsWith('text/plain');

    if (!wantsData) {
      // Return metadata
      logger.info(`Returning metadata for fragment ${id}`);
      return res.status(200).json({ status: 'ok', fragment: frag });
    }

    // Otherwise return raw data
    const data = await frag.getData();
    res.setHeader('Content-Type', frag.type);
    return res.status(200).send(data);
  } catch (err) {
    logger.error({ err }, 'GET /v1/fragments/:id failed');
    return res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: err.message || 'internal' } });
  }
};