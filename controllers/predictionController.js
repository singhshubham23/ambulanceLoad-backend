const predictionService = require("../services/predictionService");

exports.getEmergencyPrediction = async (req, res) => {
  try {
    const inputData = req.body;
    const ruleBased = await predictionService.calculateRuleBasedPrediction(inputData);
    const mlBased = await predictionService.calculateMLPrediction(inputData);

    res.json({
      ruleBased,
      mlBased
    });

  } catch (err) {
     console.error("FULL ERROR:", err);
  res.status(500).json({ 
    message: "Prediction failed",
    error: err.message 
  });
  }
};