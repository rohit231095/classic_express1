const Sequelize = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    logging: false,

    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});

module.exports = sequelize;