const zoneService = require("../services/zoneService");

exports.getZoneDensity = async (req, res) => {
  try {
    const { city, hours } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City query parameter is required"
      });
    }

 
    const zones = await zoneService.getZoneAnalytics({ city, hours });

    const alerts = zones
      .filter(z => z.alertLevel === "CRITICAL" || z.alertLevel === "HIGH")
      .map(z => ({
        zone: z.zone,
        alertLevel: z.alertLevel,
        message: `Emergency surge detected in ${z.zone}`
      }));

    const io = req.app.get("io");
    if (io && alerts.length > 0) {
      io.emit("zoneAlert", alerts);
    }

    res.json({
      city,
      timestamp: new Date(),
      zones,
      alerts
    });

  } catch (err) {
    console.error("Zone analytics error:", err);
    res.status(500).json({
      message: err.message || "Zone analytics failed"
    });
  }
};
