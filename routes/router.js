const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const roleController = require('../controllers/role');
const countryController = require('../controllers/country');
const stateController = require('../controllers/state');
const cityController = require('../controllers/city');

router.get('/', userController.start);

router.post('/api/user', userController.signup);

router.post('/api/verifyOTP', userController.otpVerify);

router.get('/api/user', userController.login);

router.get('/api/roles', roleController.get);

router.get('/api/countries', countryController.get);

router.get('/api/states/:id', stateController.getById);

router.get('/api/cities/:id', cityController.getById);

router.get('/api/states', stateController.get);

router.get('/api/cities', cityController.get);

module.exports = router;