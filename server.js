const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const db = require('./config/database');

app.use(bodyParser.urlencoded({
    extended: true
}));

// routes imported
const routes = require('./routes/router');
app.use(routes);

require('./config/relations');

// Creating New Roles
// const createRoles = require('./controllers/roleCreate');
// const createCountries = require('./controllers/countryCreate');
// const createStates = require('./controllers/stateCreate');
// const createCities = require('./controllers/cityCreate');

// force: true will drop all the data and create fresh tables
db.sync({
    force: false
})
    .then(res => {
        console.log('Drop and Resync with { force: false }');
        // createRoles();
        // createCountries();
        // createStates();
        // createCities();
    })

app.use(cors());
// app.use(function (req, res, next) {
//     console.log("------------ ---------------------------");
//     //console.log("------",cors().role);
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, Content-Length,  X-Requested-With, Content-Type, Accept, Authorization, request-node-status"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, HEAD, PUT, PATCH, DELETE"
//     );
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log("App listening at ", PORT);
})
