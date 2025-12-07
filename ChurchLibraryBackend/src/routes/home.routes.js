const express = require('express');
const router = express.Router();
let homeController;
try {
    homeController = require('../controllers/home.controller');
} catch (error) {
    console.error('Error loading home.controller.js:', error);
}
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/new-arrivals', homeController.getNewArrivals);
router.get('/featured', homeController.getFeatured);
router.get('/trending', homeController.getTrending);

// Authenticated route
router.get('/continue-reading', authMiddleware.authenticateToken, homeController.getContinueReading);

module.exports = router;
