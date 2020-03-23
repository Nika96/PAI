const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");


router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:userID", userController.getUserByID);
router.put("/:userID", userController.updateUser);
router.delete("/:userID", userController.deleteUser);

module.exports = router;
