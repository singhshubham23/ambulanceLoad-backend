const mongoose = require("mongoose");
require("dotenv").config();

const Accident = require("../models/Accident");
const AmbulanceLog = require("../models/AmbulanceLog");
const Hospital = require("../models/Hospital");
const Festival = require("../models/Festival");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

const seed = async () => {
  try {
    await connectDB();

    await Accident.deleteMany();
    await AmbulanceLog.deleteMany();
    await Hospital.deleteMany();
    await Festival.deleteMany();

    const hospitals = await Hospital.insertMany([
      { name: "City Hospital", zone: "North", capacity: 120 },
      { name: "Metro Hospital", zone: "South", capacity: 80 },
      { name: "Govt Medical College", zone: "Central", capacity: 200 }
    ]);

    await Accident.insertMany([
      { location: { lat: 28.61, lng: 77.21 }, severity: 4 },
      { location: { lat: 28.62, lng: 77.20 }, severity: 3 },
      { location: { lat: 28.63, lng: 77.19 }, severity: 5 }
    ]);

    await AmbulanceLog.insertMany([
      { hospital: hospitals[0]._id, zone: "North", arrivalTime: new Date() },
      { hospital: hospitals[1]._id, zone: "South", arrivalTime: new Date() },
      { hospital: hospitals[0]._id, zone: "North", arrivalTime: new Date() }
    ]);

    await Festival.create({
      name: "Diwali",
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000),
      riskMultiplier: 1.5
    });

    console.log("Dummy data seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
