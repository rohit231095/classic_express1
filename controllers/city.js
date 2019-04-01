const db = require('../config/database');
const rel = require('../config/relations');

const httpStatus = require('http-status-codes');

const Cities = rel.cities;

exports.getById = (req, res, next) => {
    const stateId = req.params.id;
    Cities.findAll({
        attributes: ['cityId', 'cityName'],
        where: {
            stateId: stateId
        }
    })
        .then(cities => {
            res.status(httpStatus.OK).json({
                cities: cities
            })
        })
        .catch(err => {
            console.log('Error Roles ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}

exports.get = (req, res, next) => {
    Cities.findAll({
        attributes: ['cityId', 'cityName']
    })
        .then(cities => {
            res.status(httpStatus.OK).json({
                cities: cities
            })
        })
        .catch(err => {
            console.log('Error Roles ===>', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        })
}