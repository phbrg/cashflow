const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
})

module.exports = User;