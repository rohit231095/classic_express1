const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('users', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userName: {
        type: Sequelize.STRING
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    streetAddress: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    mobile: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = User;