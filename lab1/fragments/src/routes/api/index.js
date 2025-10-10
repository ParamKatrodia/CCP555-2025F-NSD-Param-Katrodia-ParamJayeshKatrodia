// src/routes/api/index.js
const router = require('express').Router();

router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./get-by-id'));
router.post('/fragments', require('./post'));

module.exports = router;
