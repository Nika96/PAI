const ReservationModel = require("../model/reservation.model");

exports.createReservation = async (req, res, next) => {
    try {
        const createdReservation = await ReservationModel.create(req.body);
        res.status(201).json(createdReservation);
    } catch (err) {
        next(err);
    }
};

exports.getAllReservations = async (req, res, next) => {
    try {
        const allReservations = await ReservationModel.find({});
        res.status(200).json(allReservations);
    } catch (err) {
        next(err);
    }
};

exports.getReservationByID = async (req, res, next) => {
    try {
        const reservationByID = await ReservationModel.findById(req.params.reservationID);
        if (reservationByID) {
            res.status(200).json(reservationByID);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateReservation = async (req, res, next) => {
    try {
        const updatedReservation = await ReservationModel
            .findByIdAndUpdate(
                req.params.reservationID,
                req.body,
                {
                    new: true,
                    useFindAndModify: false
                }
            );
        if (updatedReservation) {
            res.status(200).json(updatedReservation);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteReservation = async (req, res, next) => {
    try {
        const deletedReservation = await ReservationModel
            .findByIdAndDelete(req.params.reservationID);
        if (deletedReservation) {
            res.status(200).json(deletedReservation);
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};
