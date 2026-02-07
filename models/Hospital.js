const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: String,
  zone: String,
  capacity: Number
});

module.exports = mongoose.model("Hospital", hospitalSchema);
