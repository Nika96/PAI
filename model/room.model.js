const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    roomReservations: {
        type: Array,
        required: false
    }
});

const RoomModel = mongoose.model("Room", RoomSchema);

module.exports = RoomModel;
