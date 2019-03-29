const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.start);

router.post('/api/user', userController.signup);

router.post('/api/verifyOTP', userController.otpVerify);

router.get('/api/user', userController.login);

module.exports = router;