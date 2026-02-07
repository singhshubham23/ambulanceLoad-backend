const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const Accident = require("./models/Accident");

mongoose.connect(process.env.MONGO_URI);

async function exportAndTrain() {
  try {
    const accidents = await Accident.find();

    const trainingData = accidents.map(a => ({
      dayOfWeek: new Date(a.date).getDay(),
      month: new Date(a.date).getMonth() + 1,
      isFestival: 0,          // extend later
      temperature: 30,        // from weather history later
      rainfall: 0,
      accidents: 1
    }));

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
