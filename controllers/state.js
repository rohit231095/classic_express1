const db = require('../config/database');
const rel = require('../config/relations');

const httpStatus = require('http-status-codes');

const States = rel.states;

exports.get = (req, res, next) => {
    const countryId = req.params.id;
    States.findAll({
        attributes: ['stateId', 'stateName'],
        where: {
            countryId: countryId
        }
    })
        .then(states => {
            res.status(httpStatus.OK).json({
                states: states
            })
        })
        .catch(err => {
            console.log('Error Roles ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}