const Accident = require("../models/Accident");

exports.getAccidentHotspots = async (req, res, next) => {
  try {
    const { hours = 24 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

   const hotspots = await Accident.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [77.21, 28.61] },
      distanceField: "distance",
      spherical: true
    }
  },
  {
    $group: {
      _id: {
        lat: { $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 2] },
        lng: { $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 2] }
      },
      accidentCount: { $sum: 1 },
      avgSeverity: { $avg: "$severity" }
    }
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
