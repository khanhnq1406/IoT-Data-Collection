const express = require("express");
const router = express.Router();
const databaseController = require("../app/controllers/DatabaseController");
router.get("/getfullname", databaseController.getFullname);

module.exports = router;
