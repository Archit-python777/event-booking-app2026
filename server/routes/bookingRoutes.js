const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Book an event
router.post("/", protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyBooked = await Booking.findOne({
      user: req.user._id,
      event: eventId,
    });
    if (alreadyBooked) {
      return res.status(400).json({ message: "You already booked this event" });
    }

    // Take a seat only if one is still free
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, $expr: { $lt: ["$seatsBooked", "$totalSeats"] } },
      { $inc: { seatsBooked: 1 } },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(400).json({ message: "Sorry, this event is full" });
    }

    const booking = await Booking.create({ user: req.user._id, event: eventId });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// See my bookings
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a booking
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This is not your booking" });
    }

    await booking.deleteOne();
    await Event.findByIdAndUpdate(booking.event, { $inc: { seatsBooked: -1 } });

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;