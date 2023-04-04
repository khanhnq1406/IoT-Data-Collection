const express = require("express");
const router = express.Router();
const databaseController = require("../app/controllers/DatabaseController");
router.get("/getfullname", databaseController.getFullname);
router.get("/getWarning", databaseController.getWarning);
router.get("/getAlarmRange", databaseController.getAlarmRange);
router.post("/setAlarmValue", databaseController.setAlarmValue);
module.exports = router;
