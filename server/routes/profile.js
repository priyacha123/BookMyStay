const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profile");
const auth = require("../middleware/auth");

// GET
router.get("/", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "email"]);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}); 

// post
router.post("/", auth, async (req, res) => {
    try {
        const profileData = {
            ...req.body, user: req.user.id
        };
        const existingProfile = await Profile.findOne({ user: req.user.id });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }
        const profile = new Profile(profileData);
        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

// put
router.put("/", auth, async (req, res) => {
    try {
        // const updateProfileData = {
        //     ...req.body, user: req.user.id
        // };
        const updateProfileData = await Profile.findOneAndUpdate(
            { user: req.user.id }, 
            { $set: req.body },
            { new: true });
        if (!updateProfileData) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(updateProfileData);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// delete
router.delete("/", auth, async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete(
            { user: req.user.id } 
        )
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = router;