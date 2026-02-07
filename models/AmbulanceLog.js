const mongoose = require("mongoose");

const ambulanceLogSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  zone: String,
  arrivalTime: Date
});

module.exports = mongoose.model("AmbulanceLog", ambulanceLogSchema);
