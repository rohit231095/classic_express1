const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const State = sequelize.define('states', {
    stateId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    stateName: {
        type: Sequelize.STRING
    }
});

module.exports = State;