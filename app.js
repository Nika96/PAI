const express = require("express");
const userRoutes = require("./routes/user.routes");
const roomRoutes = require("./routes/room.routes");
const reservationRoutes = require("./routes/reservation.routes");
const mongodb = require("./mongodb/mongodb.connect");
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const app = express();

mongodb.connect();

//SASS
app.use(sassMiddleware({
    /* Options */
    src: './views/styles/',
    // dest: './views/styles/',
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//PUG
app.use(express.json());
app.set('view engine', 'pug')

app.use(express.static('views'))

//means this endpoint will be used to post get put etc
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/reservation", reservationRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
});

app.get("/", (req, res) => {
    res.render('index')
});
app.get("/signUp", (req, res) => {
    res.render('signUp')
});
app.get("/room-list", (req, res) => {
   res.render('room-list')
});

module.exports = app;
