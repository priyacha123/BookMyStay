const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Profile = require("../models/profile");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {

    // checking existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hashing the passwoord
    // salting the password and then hashing it means adding some random string to the password before hashing it, so that even if two users have the same password, their hashed passwords will be different.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const profile = new Profile({
      user: user._id,
      bio: "",
      phone: "",
      gender: "",
      dob: "",
      avatar: "",
      location: "",
    });
    await profile.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      },
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error registering user: ${error.message}` });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
    }

    const existingProfile = await Profile.findOne({ user: user._id });
    if (!existingProfile) {
        const profile = new Profile({
            user: user._id,
            bio: "",
            phone: "",
            gender: "",
            dob: "",
            avatar: "",
            location: "",
        })
        await profile.save()
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.json({ token, user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isHost: user.isHost,
    }});
})

module.exports = router;
