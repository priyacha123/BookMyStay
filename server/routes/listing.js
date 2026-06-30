const express = require('express');
const router = express.Router();
const Listing = require("../models/Listing");
const auth = require("../middleware/auth");

// Get listing
router.get("/", async (req, res) => {
    try {
        const { location, minPrice, MaxPrice } = req.query;
        const filter = {};
        if (location) {
            filter.location = { $regex: location, $options: "i"};
        }
        if (minPrice || MaxPrice) {
            filter.price = {};
        }
        if (minPrice) {
            filter.price.$gte = +minPrice;
        }
        if (MaxPrice) {
            filter.price.$lte = +MaxPrice;
        }
        const listings = await Listing.find(filter);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching listings" });
    }
})

// Get listing by ID
router.get("/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: "Error fetching listing" });
    }
});

// Post listing
router.post("/", auth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const listing = new Listing({
            ...req.body,
            hostId: req.user.id
        });
        await listing.save();
        res.status(201).json(listing);
    } catch (err) {
        res.status(500).json({ message: "Error creating listing" });
    }
});

// Update listing
router.put("/:id", auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.hostId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating listing" });
    }   
});


// Delete listing
router.delete("/:id", auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);  
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        if (listing.hostId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await Listing.deleteOne();
        res.json({ message: "Listing deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting listing" });
    }
});

router.get("/my-listing", auth, async (req, res) => {
    try {
        if (!req.user.hostId) {
            return res.status(403).json({ message: "Only hosts can view their listings" });
        }
        const listings = await Listing.find({ hostId: req.user.id });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching my listings" });
    }
})

module.exports = router;