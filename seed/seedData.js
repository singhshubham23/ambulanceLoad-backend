// seed/seedData.js

const mongoose = require("mongoose");
require("dotenv").config();

const Accident = require("../models/Accident");
const AmbulanceLog = require("../models/AmbulanceLog");
const Hospital = require("../models/Hospital");

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

    const hospitals = await Hospital.insertMany([
      { name: "City Hospital", zone: "North", city: "Delhi", capacity: 120 },
      { name: "Metro Hospital", zone: "South", city: "Delhi", capacity: 80 },
      { name: "Govt Medical College", zone: "Central", city: "Delhi", capacity: 200 }
    ]);

    await Accident.insertMany([
      {
        location: {
          type: "Point",
          coordinates: [77.21, 28.61] // [lng, lat]
        },
        city: "Delhi",
        severity: 4,
        zone: "North",
        hospital: hospitals[0]._id
      },
      {
        location: {
          type: "Point",
          coordinates: [77.20, 28.62]
        },
        city: "Delhi",
        severity: 3,
        zone: "South",
        hospital: hospitals[1]._id
      }
    ]);

    await AmbulanceLog.insertMany([
      {
        hospital: hospitals[0]._id,
        zone: "North",
        city: "Delhi",
        arrivalTime: new Date()
      },
      {
        hospital: hospitals[1]._id,
        zone: "South",
        city: "Delhi",
        arrivalTime: new Date()
      }
    ]);

    console.log("Dummy data seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
