const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");
const verifyToken = require("../middleware/auth");
router.get("/", verifyToken, authController.index);
router.post("/login", authController.login);

module.exports = router;
