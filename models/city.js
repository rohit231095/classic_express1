const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const City = sequelize.define('cities', {
    cityId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cityName: {
        type: Sequelize.STRING
    }
});

module.exports = City;