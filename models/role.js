const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Role = sequelize.define('roles', {
    roleId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    roleName: {
        type: Sequelize.STRING
    }
});

module.exports = Role;