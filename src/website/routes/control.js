const express = require("express");
const router = express.Router();

const controlController = require("../app/controllers/ControlController");
router.get("/turnOn", controlController.turnOn);
router.get("/turnOff", controlController.turnOff);
router.get("/", controlController.index);

module.exports = router;
