const express = require("express");
const router = express.Router();

const inputController = require("../app/controllers/InputController");
router.post("/", inputController.index);
router.get("/", inputController.index);

module.exports = router;
