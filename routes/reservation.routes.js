const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");

router.post("/", reservationController.createReservation);

router.get("/", reservationController.getAllReservations, function (req, res) {
});

router.get("/:reservationID", reservationController.getReservationByID);
router.put("/:reservationID", reservationController.updateReservation);
router.delete("/:reservationID", reservationController.deleteReservation);

module.exports = router;
