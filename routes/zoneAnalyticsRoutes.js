const express = require("express");
const router = express.Router();
const controller = require("../controllers/zoneAnalyticsController");

router.get("/pressure", controller.getZonePressure);

module.exports = router;
