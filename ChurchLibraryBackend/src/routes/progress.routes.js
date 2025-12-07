const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Save user's reading progress
router.post('/', authMiddleware.authenticateToken, progressController.saveProgress);

module.exports = router;
