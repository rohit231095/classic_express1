const db = require('../config/database');
const rel = require('../config/relations');

const httpStatus = require('http-status-codes');

const Roles = rel.roles;

exports.get = (req, res, next) => {
    Roles.findAll({
        attributes: ['roleId', 'roleName']
    })
        .then(roles => {
            res.status(httpStatus.OK).json({
                roles: roles
            })
        })
        .catch(err => {
            console.log('Error Roles ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}