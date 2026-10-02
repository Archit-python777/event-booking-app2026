const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  seatsBooked: { type: Number, default: 0 },
});

module.exports = mongoose.model("Event", eventSchema);