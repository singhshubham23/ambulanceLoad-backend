const mongoose = require("mongoose");

const ambulanceLogSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  zone: String,
  city: String,
  arrivalTime: Date
});

ambulanceLogSchema.index({ arrivalTime: -1 });
ambulanceLogSchema.index({ zone: 1 });

module.exports = mongoose.model("AmbulanceLog", ambulanceLogSchema);
