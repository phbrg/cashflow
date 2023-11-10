const User = require('../models/User');
const FinanceGoal = require('../models/FinanceGoal');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

module.exports = class HomeContoller {
    static async dashHome(req, res) {
        const userId = req.session.userid;

        const user = await User.findOne({ raw: true, where: { id: userId }} );
        let goal = await FinanceGoal.findAll({ raw: true, where: { UserId: userId } });
        let expense = await Expense.findAll({ raw: true, where: { UserId: userId } });
        let income = await Income.findAll({ raw: true, where: { UserId: userId } });

        expense.map(array => { 
            array.createdAt = `${array.createdAt.getFullYear()}-${array.createdAt.getMonth() + 1}-${array.createdAt.getDate()}`
        });

        income.map(array => { 
            array.createdAt = `${array.createdAt.getFullYear()}-${array.createdAt.getMonth() + 1}-${array.createdAt.getDate()}`
        });

        let hasGoal = true;
        let hasExpense = true;
        let hasIncome = true;

        if(goal.length == 0) {
            hasGoal = false;
        }
        if(expense.length == 0) {
            hasExpense = false;
        }
        if(income.length == 0) {
            hasIncome = false;
        }

        const totalExpense = expense.reduce((ac, obj) => ac + obj.amount, 0);
        const totalIncome = income.reduce((ac, obj) => ac + obj.amount, 0);

        let realBalance = ( user.balance + totalIncome ) - totalExpense;

        let owing = false;
        if(realBalance < 0) {
            owing = true;
        }

        goal.forEach((array) => {
            if(realBalance >= array.amount) {
                array.completed = true;
            }

            if(new Date >= new Date(array.date) && realBalance < array.amount) {
                array.completed = false;
            }
        })

        res.render('dashboard/dashboard', { user, goal, expense, income, realBalance, hasGoal, hasExpense, hasIncome, owing });
    }

    static getRegisterGoal(req, res) {
        res.render('dashboard/registergoal');
    }

    static async postRegisterGoal(req, res) {
        const userId = req.session.userid;

        const { title, amount, date } = req.body;

        if(!title || !date || !amount) {
            req.flash('message', 'Invalid values');
            res.render('dashboard/registergoal');
            return;
        }
        if(title.length > 255 || amount.length > 255) {
            req.flash('message', 'Max characters reached, 255');
            res.render('dashboard/registergoal');
            return;
        }
        
        if(new Date(date) <= new Date()) {
            req.flash('message', 'Invalid date');
            res.render('dashboard/registergoal');
            return; 
        }

        const goal = {
            title,
            date,
            amount: parseFloat(amount),
            UserId: userId
        }

        FinanceGoal.create(goal)
            .then((goal) => {
                res.redirect('/dashboard');
            })
            .catch((err) => console.log(err));
    }

    static getRegisterExpense(req, res) {
        res.render('dashboard/registerexpense');
    }

    static async postRegisterExpense(req, res) {
        const userId = req.session.userid;

        const { category, description, amount } = req.body;

        if(!category || !description || !amount) {
            req.flash('message', 'Invalid values');
            res.render('dashboard/registerexpense');
            return;
        }
        if(description.length > 255 || amount.length > 255) {
            req.flash('message', 'Max characters reached, 255');
            res.render('dashboard/registerexpense');
            return;
        }

        const expense = {
            category,
            description,
            amount: parseFloat(amount),
            UserId: userId
        }

        Expense.create(expense)
            .then((goal) => {
                res.redirect('/dashboard');
            })
            .catch((err) => console.log(err));
    }

    static getRegisterIncome(req, res) {
        res.render('dashboard/registerincome');
    }

    static async postRegisterIncome(req, res) {
        const userId = req.session.userid;

        const { source, description, amount } = req.body;

        if(!source || !description || !amount) {
            req.flash('message', 'Invalid values');
            res.render('dashboard/registerexpense');
            return;
        }
        if(description.length > 255 || amount.length > 255) {
            req.flash('message', 'Max characters reached, 255');
            res.render('dashboard/registerexpense');
            return;
        }

        const income = {
            source,
            description,
            amount: parseFloat(amount),
            UserId: userId
        }

        Income.create(income)
            .then((goal) => {
                res.redirect('/dashboard');
            })
            .catch((err) => console.log(err));
    }
    
    static async getGoal(req, res) {
        const userId = req.session.userid;

        const goal = await FinanceGoal.findAll({ raw: true, where: { UserId: userId } });

        res.render('dashboard/goal', { goal });
    }

    static async editGoal(req, res) {
        const goalId = req.params.id;
        const userId = req.session.userid;

        const goal = await FinanceGoal.findOne({ raw: true, where: { id: goalId } });

        if(goal.UserId !== userId) {
            res.redirect('/error');
            return;
        }

        let completed;
        if(goal.completed == false) {
            completed = 'Não';
        } else {
            completed = 'Sim';
        }

        res.render('dashboard/editgoal', { goal, goalId, completed });
    }

    static async postEditGoal(req, res) {
        const goalId = req.params.id;
        const userId = req.session.userid;

        let { title, date, amount, completed } = req.body;
        const goal = await FinanceGoal.findOne({ raw: true, where: { id: goalId }  });

        if(goal.UserId !== userId) {
            res.redirect('/error');
            return;
        }

        if(completed[0].toLowerCase() == 's') {
            completed = true;
        } else if(completed[0].toLowerCase() == 'n') {
            completed = false;
        }

        if(!date) {
            date = goal.date;
        }

        const goalEdit = {
            title,
            date,
            amount: parseFloat(amount),
            completed,
        }

        await FinanceGoal.update(goalEdit, { where: { id: goalId } })
            .then(() => {
                res.redirect('/dashboard/goal');
            }).catch((err) => console.log(`Update error: ${err}`));
    }

    static async deleteGoal(req, res) {
        const goalId = req.params.id;
        const userId = req.session.userid;

        const goal = await FinanceGoal.findOne({ raw: true, where: { id: goalId } });

        if(parseFloat(goal.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        await FinanceGoal.destroy({ where: { id: goalId } })
            .then(() => {
                res.redirect('/dashboard/goal');
            })
            .catch((err) => console.log(`Delete goal error: ${err}`))
    }
}