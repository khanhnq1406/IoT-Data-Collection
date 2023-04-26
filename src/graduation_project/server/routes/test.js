const express = require("express");
const router = express.Router();
const testController = require("../app/controllers/TestController");

router.get("/getData", testController.getData);
router.post("/", testController.index);
router.get("/", testController.index);

module.exports = router;
