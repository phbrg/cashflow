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

        if(!goal) {
            res.redirect('/error');
            return;
        }

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

        if(!goal) {
            res.redirect('/error');
            return;
        }

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

    static async deletGoal(req, res) {
        const goalId = req.params.id;
        const userId = req.session.userid;

        const goal = await FinanceGoal.findOne({ raw: true, where: { id: goalId } });

        if(!goal) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(goal.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        await FinanceGoal.destroy({ where: { id: goalId } })
            .then(() => {
                res.redirect('/dashboard/goal');
            })
            .catch((err) => console.log(`delet goal error: ${err}`))
    }

    static async getExpense(req, res) {
        const userId = req.session.userid;
        const expense = await Expense.findAll({ raw: true, where: { UserId: userId } });

        expense.forEach(array => {
            const fullDate = new Date(array.createdAt);

            array.createdAt = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        })

        res.render('dashboard/expense', { expense });
    }

    static async editExpense(req, res) {
        const userId = req.session.userid;
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ raw: true, where: { id: expenseId } });

        if(!expense) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(expense.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        res.render('dashboard/editExpense', { expense, expenseId });
    }

    static async postEditExpense(req, res) {
        const userId = req.session.userid;
        const expenseId = req.params.id;

        const { category, description, amount } = req.body;

        const expense = await Expense.findOne({ where: { id: expenseId } });

        if(!expense) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(expense.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        const expenseUpdate = {
            category,
            description,
            amount: parseFloat(amount)
        }

        await Expense.update(expenseUpdate, { where: { id: expenseId } })
            .then(() => {
                res.redirect('/dashboard/expense');
            }).catch((err) => console.log(`Update error: ${err}`));
    }

    static async deletExpense(req, res) {
        const expenseId = req.params.id;
        const userId = req.session.userid;

        const expense = await Expense.findOne({ raw: true, where: { id: expenseId } });

        if(!expense) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(expense.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        await Expense.destroy({ where: { id: expenseId } })
            .then(() => {
                res.redirect('/dashboard/expense');
            })
            .catch((err) => console.log(`delet expense error: ${err}`))
    }

    static async getIncome(req, res) {
        const userId = req.session.userid;

        const income = await Income.findAll({ raw: true, where: { UserId: userId } });

        income.forEach(array => {
            const fullDate = new Date(array.createdAt);

            array.createdAt = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        })

        res.render('dashboard/income', { income });
    }

    static async editIncome(req, res) {
        const userId = req.session.userid;
        const incomeId = req.params.id;

        const income = await Income.findOne({ raw: true, where: { id: incomeId } });

        if(!income) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(income.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        res.render('dashboard/editincome', { income, incomeId });
    }

    static async postEditIncome(req, res) {
        const userId = req.session.userid;
        const incomeId = req.params.id;

        const { source, description, amount } = req.body;

        const income = await Income.findOne({ where: { id: incomeId } });

        if(!income) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(income.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        const incomeUpdate = {
            source,
            description,
            amount: parseFloat(amount)
        }

        await Income.update(incomeUpdate, { where: { id: incomeId } })
            .then(() => {
                res.redirect('/dashboard/income');
            }).catch((err) => console.log(`Update error: ${err}`));
    }

    static async deletIncome(req, res) {
        const incomeId = req.params.id;
        const userId = req.session.userid;

        const income = await Income.findOne({ raw: true, where: { id: incomeId } });

        if(!income) {
            res.redirect('/error');
            return;
        }

        if(parseFloat(income.UserId) !== parseFloat(userId)) {
            res.redirect('/error');
            return;
        }

        await Income.destroy({ where: { id: incomeId } })
            .then(() => {
                res.redirect('/dashboard/income');
            })
            .catch((err) => console.log(`delet income error: ${err}`))
    }
}