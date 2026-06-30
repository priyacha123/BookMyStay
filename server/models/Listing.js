const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    image: [String],
    hostId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User" 
    },
    bookingDates: [{
        startDate: Date,
        endDate: Date
    }]
    });

module.exports = mongoose.model("Listing", listingSchema);
