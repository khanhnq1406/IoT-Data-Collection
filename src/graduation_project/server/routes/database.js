const express = require("express");
const router = express.Router();
const databaseController = require("../app/controllers/DatabaseController");
router.get("/getfullname", databaseController.getFullname);
router.get("/getWarning", databaseController.getWarning);
module.exports = router;
