const rel = require('../config/relations');
const States = rel.states;

const states = () => {
    States.create({
        stateName: 'DELHI',
        countryId: '1'
    });
    States.create({
        stateName: 'HARYANA',
        countryId: '1',
    });
};

module.exports = states;