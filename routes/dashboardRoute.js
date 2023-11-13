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

router.get('/expense', auth, DashboardController.getExpense);
router.get('/editexpense/:id', auth, DashboardController.editExpense);

router.get('/income', auth, DashboardController.getIncome);
router.get('/editincome/:id', auth, DashboardController.editIncome);

router.post('/registergoal', auth, DashboardController.postRegisterGoal);
router.post('/registerexpense', auth, DashboardController.postRegisterExpense);
router.post('/registerincome', auth, DashboardController.postRegisterIncome);

router.post('/editgoal/:id', auth, DashboardController.postEditGoal);
router.post('/deletgoal/:id', auth, DashboardController.deletGoal);

router.post('/editexpense/:id', auth, DashboardController.postEditExpense);
router.post('/deletexpense/:id', auth, DashboardController.deletExpense);

router.post('/editincome/:id', auth, DashboardController.postEditIncome);
router.post('/deletincome/:id', auth, DashboardController.deletIncome);

module.exports = router;