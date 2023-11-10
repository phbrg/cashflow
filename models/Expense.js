const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('../models/User');

const Expense = db.define('Expense', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Expense.belongsTo(User);
User.hasMany(Expense);

module.exports = Expense;