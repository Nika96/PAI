const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const roomRoutes = require("./routes/room.routes");
const reservationRoutes = require("./routes/reservation.routes");
const mongodb = require("./mongodb/mongodb.connect");

mongodb.connect();

app.use(express.json());

//means this endpoint will be used to post get put etc
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/reservation", reservationRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
});

app.get("/", (req, res) => {
    res.json("Hello world from here");
});

module.exports = app;
