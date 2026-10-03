require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/eventRoutes"); // NEW
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json()); // NEW
app.use("/api/events", eventRoutes); // NEW
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the event booking server!");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  } catch (error) {
    console.log("Could not connect:", error.message);
  }
};

startServer();