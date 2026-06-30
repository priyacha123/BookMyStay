const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    bio: String,
    phone: String,
    gender: String,
    dob: String,
    avatar: String,
    location: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile; 