const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = require('../models/User');

const Income = db.define('Income', {
    source: {
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
    },
});

Income.belongsTo(User);
User.hasMany(Income);

module.exports = Income;