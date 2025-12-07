const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Log a user activity
router.post('/log', authMiddleware.authenticateToken, activityController.logActivity);

module.exports = router;
