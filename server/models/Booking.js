const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

// A user can book a given event only once
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);