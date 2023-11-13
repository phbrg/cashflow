const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

const auth = require('../helpers/auth').checkAuth;

router.get('/', auth, DashboardController.dashHome);

router.get('/registergoal', auth, DashboardController.getRegisterGoal);
router.get('/registerexpense', auth, DashboardController.getRegisterExpense);
router.get('/registerincome', auth, DashboardController.getRegisterIncome);

router.get('/goal', auth, DashboardController.getGoal);
router.get('/editgoal/:id', auth, DashboardController.editGoal);

router.post('/registergoal', auth, DashboardController.postRegisterGoal);
router.post('/registerexpense', auth, DashboardController.postRegisterExpense);
router.post('/registerincome', auth, DashboardController.postRegisterIncome);

router.post('/editgoal/:id', auth, DashboardController.postEditGoal);
router.post('/deletegoal/:id', auth, DashboardController.deleteGoal);

module.exports = router;