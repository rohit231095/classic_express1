const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Country = sequelize.define('countries', {
    countryId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    countryName: {
        type: Sequelize.STRING
    },
    countryCode: {
        type: Sequelize.STRING
    },
    isoCode: {
        type: Sequelize.STRING
    }
});

module.exports = Country;