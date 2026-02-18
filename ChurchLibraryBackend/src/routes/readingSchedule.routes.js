const express = require('express');
const router = express.Router();
const controller = require("../controllers/readingSchedule.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Create a new schedule
router.post(
    "/",
    authenticateToken,
    controller.createSchedule
);

// Get all user schedules
router.get(
    "/",
    authenticateToken,
    controller.getUserSchedules
);

// Get specific schedule
router.get(
    "/:id",
    authenticateToken,
    controller.getScheduleById
);

// Update schedule
router.put(
    "/:id",
    authenticateToken,
    controller.updateSchedule
);

// Update progress
router.put(
    "/:id/progress",
    authenticateToken,
    controller.updateProgress
);

// Delete schedule
router.delete(
    "/:id",
    authenticateToken,
    controller.deleteSchedule
);

module.exports = router;
