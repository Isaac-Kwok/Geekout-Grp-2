const express = require("express");
const router = express.Router();
const { Booking, Location } = require("../models");

// Create carpool booking
router.post("/bookings/create", async (req, res) => {
    const { bookingId, dateTime, locationId, price, slots, slotsLimit } = req.body;
  
    try {
      const booking = await Booking.create({
        bookingId,
        dateTime,
        locationId,
        price,
        slots,
        slotsLimit,
      });
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Error creating booking" });
    }
  });

// Get list of bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: { model: Location, where: { status: true } },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
});

// Update carpool booking
router.put("/bookings/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { bookingId, dateTime, locationId, price, slots, slotsLimit } = req.body;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.bookingId = bookingId;
    booking.dateTime = dateTime;
    booking.locationId = locationId;
    booking.price = price;
    booking.slots = slots;
    booking.slotsLimit = slotsLimit;

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking" });
  }
});

// Quit booking
router.delete("/bookings/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;
