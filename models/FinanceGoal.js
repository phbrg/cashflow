const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('../models/User');

const FinanceGoal = db.define('FinanceGoal', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

FinanceGoal.belongsTo(User);
User.hasMany(FinanceGoal);

module.exports = FinanceGoal;