const rel = require('../config/relations');
const Cities = rel.cities;

const cities = () => {
    Cities.create({
        cityName: 'ROHTAK',
        stateId: '2'
    });
    Cities.create({
        cityName: 'BHIWANI',
        stateId: '2',
    });
    Cities.create({
        cityName: 'SIRSA',
        stateId: '2',
    });
    Cities.create({
        cityName: 'JIND',
        stateId: '2',
    });
};

module.exports = cities;