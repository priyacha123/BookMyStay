const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Listing"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
})

module.exports = mongoose.model("Booking", bookingSchema);