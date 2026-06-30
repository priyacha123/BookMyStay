const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/booking");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
     console.log(err)
})


app.listen(process.env.PORT, () => {
console.log(`Server is running on port ${process.env.PORT}`);
})