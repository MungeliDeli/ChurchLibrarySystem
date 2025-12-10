const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Log a user activity
router.post('/log', authenticateToken, activityController.logActivity);

// Get activity logs (Admin only)
router.get('/logs', authenticateToken, authorizeRole(['admin']), activityController.getActivityLogs);

// Export activity logs (Admin only)
router.get('/export', authenticateToken, authorizeRole(['admin']), activityController.exportActivityLogs);

// Archive activity logs (Admin only)
router.post('/archive', authenticateToken, authorizeRole(['admin']), activityController.archiveActivityLogs);

module.exports = router;
