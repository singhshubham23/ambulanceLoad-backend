const express = require("express");
const router = express.Router();
const controller = require("../controllers/predictionController");

router.post("/predict", controller.getEmergencyPrediction);

module.exports = router;
