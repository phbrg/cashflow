const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

router.get('/', HomeController.homePage);

module.exports = router;