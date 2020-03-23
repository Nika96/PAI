const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room.controller");

router.post("/", roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.get("/:roomID", roomController.getRoomByID);
router.put("/:roomID", roomController.updateRoom);
router.delete("/:roomID", roomController.deleteRoom);

module.exports = router;
