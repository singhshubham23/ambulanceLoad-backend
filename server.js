const cron = require("node-cron");
const { exec } = require("child_process");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const connectDB = require("./config/db");

const accidentRoutes = require("./routes/accidentRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const errorHandler = require("./middleware/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const hospitalAnalyticsRoutes = require("./routes/hospitalAnalyticsRoutes");
const hotspotRoutes = require("./routes/hotspotRoutes");
const zoneAnalyticsRoutes = require("./routes/zoneAnalyticsRoutes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/accidents", accidentRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/hospitals", hospitalAnalyticsRoutes);
app.use("/api/hotspots", hotspotRoutes);
app.use("/api/zones", zoneAnalyticsRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    status: "Backend running",
    service: "AI Emergency Pressure System",
  });
});

const PORT = process.env.PORT || 5000;
cron.schedule("0 3 * * *", () => {
  console.log("Running daily model retraining...");
  exec("node scripts/exportAndTrain.js", (error, stdout, stderr) => {
    if (error) {
      console.error("Cron training failed:", stderr);
    } else {
      console.log("Model retrained successfully");
    }
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
