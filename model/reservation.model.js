const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    isReserved: {
        type: Boolean,
        required: true
    },
    allReservedDates: {
        type: Array,
        required: false
    }
});

const ReservationModel = mongoose.model("Reservation", ReservationSchema);

module.exports = ReservationModel;
