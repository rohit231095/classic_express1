const rel = require('../config/relations');
const Countries = rel.countries;

const countries = () => {
    Countries.create({
        countryName: 'INDIA',
        countryCode: '91',
        isoCode: 'IND'
    });
    Countries.create({
        countryName: 'UNITED STATES',
        countryCode: '1',
        isoCode: 'USA'
    });
};

module.exports = countries;