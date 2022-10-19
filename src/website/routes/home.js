const express = require('express');
const router = express.Router();


const homeController = require('../app/controllers/HomeController');
router.get('/addTemp', homeController.addTemperature);
router.get('/', homeController.index);

module.exports = router;