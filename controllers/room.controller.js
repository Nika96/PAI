const RoomModel = require("../model/room.model");

exports.createRoom = async (req, res, next) => {
    try {
        const createdRoom = await RoomModel.create(req.body);
        res.status(201).json(createdRoom);
    } catch (err) {
        next(err);
    }
};

exports.getAllRooms = async (req, res, next) => {
    try {
        const allRooms = await RoomModel.find({});
        res.status(200).json(allRooms);
    } catch (err) {
        next(err);
    }
};

exports.getRoomByID = async (req, res, next) => {
    try {
        const roomByID = await RoomModel.findById(req.params.roomID);
        if (roomByID) {
            res.status(200).json(roomByID);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await RoomModel
            .findByIdAndUpdate(
                req.params.roomID,
                req.body,
                {
                    new: true,
                    useFindAndModify: false
                }
            );
        if (updatedRoom) {
            res.status(200).json(updatedRoom);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteRoom = async (req, res, next) => {
    try {
        const deletedRoom = await RoomModel
            .findByIdAndDelete(req.params.roomID);
        if (deletedRoom) {
            res.status(200).json(deletedRoom);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};
