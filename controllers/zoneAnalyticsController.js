const AmbulanceLog = require("../models/AmbulanceLog");
const Accident = require("../models/Accident");

exports.getZoneDensity = async (req, res) => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const zoneData = await AmbulanceLog.aggregate([
      {
        $match: {
          arrivalTime: { $gte: last24h }
        }
      },
      {
        $group: {
          _id: "$zone",
          ambulanceCount: { $sum: 1 }
        }
      }
    ]);

    const accidentData = await Accident.aggregate([
      {
        $match: {
          date: { $gte: last24h }
        }
      },
      {
        $group: {
          _id: "$zone",
          accidentCount: { $sum: 1 },
          avgSeverity: { $avg: "$severity" }
        }
      }
    ]);

    const zoneMap = {};

    zoneData.forEach(z => {
      zoneMap[z._id] = {
        zone: z._id,
        ambulanceCount: z.ambulanceCount,
        accidentCount: 0,
        avgSeverity: 0
      };
    });

    accidentData.forEach(a => {
      if (!zoneMap[a._id]) {
        zoneMap[a._id] = {
          zone: a._id,
          ambulanceCount: 0
        };
      }

      zoneMap[a._id].accidentCount = a.accidentCount;
      zoneMap[a._id].avgSeverity = Number(a.avgSeverity?.toFixed(2) || 0);
    });

    const result = Object.values(zoneMap).map(z => {
      const zoneRiskScore =
        (z.accidentCount || 0) * 2 +
        (z.ambulanceCount || 0) * 1.5 +
        (z.avgSeverity || 0) * 3;

      let alertLevel = "LOW";
      if (zoneRiskScore > 50) alertLevel = "CRITICAL";
      else if (zoneRiskScore > 30) alertLevel = "HIGH";
      else if (zoneRiskScore > 15) alertLevel = "MEDIUM";

      return {
        ...z,
        zoneRiskScore: Math.round(zoneRiskScore),
        alertLevel
      };
    });

    res.json(result.sort((a, b) => b.zoneRiskScore - a.zoneRiskScore));

  } catch (err) {
    res.status(500).json({ message: "Zone analytics failed" });
  }
};
