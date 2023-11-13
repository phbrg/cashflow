const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const auth = require('../helpers/auth').checkAuth;

router.get('/register', AuthController.getRegister);
router.get('/login', AuthController.getLogin);
router.get('/logout', AuthController.logout);

router.get('/account', auth, AuthController.getAccount);
router.get('/editaccount', auth, AuthController.editAccount);

router.post('/register', AuthController.postRegister);
router.post('/login', AuthController.postLogin);

router.post('/editaccount', auth, AuthController.postEditAccount);

module.exports = router;