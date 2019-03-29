const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const OTP = sequelize.define('otps', {
    otpId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    otp: {
        type: Sequelize.STRING
    }
});

module.exports = OTP;