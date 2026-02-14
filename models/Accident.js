const mongoose = require("mongoose");

const accidentSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  city: {
    type: String,
    required: true,
  },

  severity: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  zone: {
    type: String,
    required: true,
  },

  hospital: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

accidentSchema.index({ location: "2dsphere" });
accidentSchema.index({ date: -1 });
accidentSchema.index({ zone: 1 });

module.exports = mongoose.model("Accident", accidentSchema);
