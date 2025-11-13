// Ensure env.jest is loaded before any test imports app.js
const dotenv = require('dotenv');
dotenv.config({ path: './env.jest' });
