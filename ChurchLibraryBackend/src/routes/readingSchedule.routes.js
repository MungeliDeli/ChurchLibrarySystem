const controller = require("../controllers/readingSchedule.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    const router = require("express").Router();

    // Create a new schedule
    router.post(
        "/",
        [authJwt.verifyToken],
        controller.createSchedule
    );

    // Get all user schedules
    router.get(
        "/",
        [authJwt.verifyToken],
        controller.getUserSchedules
    );

    // Get specific schedule
    router.get(
        "/:id",
        [authJwt.verifyToken],
        controller.getScheduleById
    );

    // Update schedule
    router.put(
        "/:id",
        [authJwt.verifyToken],
        controller.updateSchedule
    );

    // Update progress
    router.put(
        "/:id/progress",
        [authJwt.verifyToken],
        controller.updateProgress
    );

    // Delete schedule
    router.delete(
        "/:id",
        [authJwt.verifyToken],
        controller.deleteSchedule
    );

    app.use('/api/reading-schedules', router);
};
