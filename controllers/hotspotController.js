const Accident = require("../models/Accident");

exports.getAccidentHotspots = async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const hotspots = await Accident.aggregate([
      {
        $match: {
          date: { $gte: since }
        }
      },
      {
        $group: {
          _id: "$location.coordinates",
          accidentCount: { $sum: 1 },
          avgSeverity: { $avg: "$severity" },
          zone: { $first: "$zone" }
        }
      },
      {
        $sort: { accidentCount: -1 }
      }
    ]);

    const geoJSON = {
      type: "FeatureCollection",
      features: hotspots.map(h => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: h._id
        },
        properties: {
          accidentCount: h.accidentCount,
          avgSeverity: Number(h.avgSeverity.toFixed(2)),
          zone: h.zone,
          hotspotLevel:
            h.accidentCount > 10
              ? "CRITICAL"
              : h.accidentCount > 5
              ? "HIGH"
              : h.accidentCount > 2
              ? "MEDIUM"
              : "LOW"
        }
      }))
    };

    res.json(geoJSON);

  } catch (err) {
    next(err);
  }
};
