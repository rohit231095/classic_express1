const db = require('../config/database');
const rel = require('../config/relations');

const httpStatus = require('http-status-codes');

const Countries = rel.countries;

exports.get = (req, res, next) => {
    Countries.findAll({
        attributes: ['countryId', 'countryName']
    })
        .then(countries => {
            res.status(httpStatus.OK).json({
                countries: countries
            })
        })
        .catch(err => {
            console.log('Error Roles ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}