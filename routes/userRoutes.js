const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const CaptchaController = require('../controllers/CaptchaController');
const auth = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdate,
  validatePasswordUpdate,
  validateForgotPassword,
  validateResetPassword,
  validateOTP,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, UserController.register);
router.post('/login', validateLogin, handleValidationErrors, UserController.login);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, UserController.forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, UserController.resetPassword);
router.post('/reset-password-direct', validateForgotPassword, handleValidationErrors, UserController.resetPasswordDirect);
router.post('/send-otp', validateForgotPassword, handleValidationErrors, UserController.sendOTP);
router.post('/verify-otp', validateOTP, handleValidationErrors, UserController.verifyOTPAndSendResetLink);

// Captcha routes (public)
router.post('/getCaptchaRequest', CaptchaController.getCaptchaRequest);
router.post('/verifyCaptcha', CaptchaController.verifyCaptcha);

// Protected routes
router.use(auth); // Apply authentication middleware to all routes below

// User profile routes
router.get('/profile', UserController.getProfile);
router.put('/password', validatePasswordUpdate, handleValidationErrors, UserController.updatePassword);

// CRUD routes for users
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validateUpdate, handleValidationErrors, UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
