const predictionService = require("../services/predictionService");
const alertService = require("../services/alertService");

exports.getEmergencyPrediction = async (req, res) => {
  try {
    const inputData = req.body;

    const mlBased = await predictionService.calculateMLPrediction(inputData);

    const alert = alertService.evaluateAlert(
      mlBased.predictedAccidents,
      mlBased.alertLevel
    );

    res.json({
      mlBased,
      alert
    });

  } catch (err) {
    res.status(500).json({ message: "Prediction failed" });
  }
};