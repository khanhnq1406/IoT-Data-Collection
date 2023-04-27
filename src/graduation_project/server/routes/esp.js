const express = require("express");
const router = express.Router();
const espController = require("../app/controllers/EspController");
router.post("/insertData", espController.insertData);
router.post("/updateData", espController.updateData);
router.post("/updateLightStatus", espController.updateLightStatus);
router.get("/getLightStatus", espController.getLightStatus);
module.exports = router;
