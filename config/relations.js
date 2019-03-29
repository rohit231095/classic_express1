const relation = {};

relation.roles = require('../models/role');
relation.users = require('../models/user');
relation.countries = require('../models/country');
relation.states = require('../models/state');
relation.cities = require('../models/city');
relation.otps = require('../models/otp');

relation.users.belongsToMany(relation.roles, { foreignKey: 'roleId', through: 'userRoles' });
relation.roles.belongsToMany(relation.users, { foreignKey: 'userId', through: 'userRoles' });
relation.users.belongsTo(relation.countries, { foreignKey: 'countryId' });
relation.users.belongsTo(relation.states, { foreignKey: 'stateId' });
relation.users.belongsTo(relation.cities, { foreignKey: 'cityId' });
relation.states.belongsTo(relation.countries, { foreignKey: 'countryId' });
relation.countries.hasMany(relation.states, { foreignKey: 'countryId' });
relation.cities.belongsTo(relation.states, { foreignKey: 'stateId' });
relation.states.hasMany(relation.cities, { foreignKey: 'stateId' });
relation.otps.belongsTo(relation.users, { foreignKey: 'userId' });

module.exports = relation;