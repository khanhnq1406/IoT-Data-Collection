const express = require("express");
const router = express.Router();
const espController = require("../app/controllers/EspController");
router.post("/insertData", espController.insertData);
router.post("/updateData", espController.updateData);
module.exports = router;
