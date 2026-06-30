const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// create new bookings for a user
router.post("/", auth, async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, totalPrice } = req.body;
        // const userId = req.user.id;

        const booking = new Booking({
            listingId,
            userId: req.user.id,
            checkIn,
            checkOut,
            totalPrice
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get all bookings for a specific listing
router.get("/my-bookings", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate("listingId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get single booking by id
router.get("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("listingId");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view this booking" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update a booking by id
router.put("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);  
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this booking" });
        }

        const { checkIn, checkOut, totalPrice } = req.body;

        booking.checkIn = checkIn;
        booking.checkOut = checkOut;
        booking.totalPrice = totalPrice;

        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// delete a booking by id
router.delete("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this booking" });
        }

        await booking.deleteOne();
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;