const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const Accident = require("./models/Accident");

mongoose.connect(process.env.MONGO_URI);

async function exportAndTrain() {
  try {
    const accidents = await Accident.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" }
      },
      count: { $sum: 1 }
    }
  }
]);

const trainingData = accidents.map(a => {
  const date = new Date(a._id.year, a._id.month - 1, a._id.day);

  return {
    dayOfWeek: date.getDay(),
    month: date.getMonth() + 1,
    isFestival: 0,
    temperature: 30,
    rainfall: 0,
    accidents: a.count
  };
});

    const dataPath = path.join(__dirname, "ai", "trainingData.json");

    fs.writeFileSync(dataPath, JSON.stringify(trainingData, null, 2));

    console.log("Training data exported");

    exec("python ai/trainModel.py", (error, stdout, stderr) => {
      if (error) {
        console.error("Training failed:", stderr);
        return;
      }
      console.log(stdout);
      process.exit();
    });
  } catch (err) {
    console.error("Export failed:", err);
  }
}

exportAndTrain();
