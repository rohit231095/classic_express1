const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const roleController = require('../controllers/role');

router.get('/', userController.start);

router.post('/api/user', userController.signup);

router.post('/api/verifyOTP', userController.otpVerify);

router.get('/api/user', userController.login);

router.get('/api/roles', roleController.get);

module.exports = router;