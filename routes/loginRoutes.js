const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// POST /loginwithotp
router.post('/loginwithotp', loginController.loginWithOtp);

// POST /verifylogin
router.post('/verifylogin', loginController.verifyLogin);

module.exports = router;
