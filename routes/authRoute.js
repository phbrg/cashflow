const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.get('/register', AuthController.getRegister);
router.get('/login', AuthController.getLogin);
router.get('/logout', AuthController.logout);

router.post('/register', AuthController.postRegister);
router.post('/login', AuthController.postLogin);

module.exports = router;