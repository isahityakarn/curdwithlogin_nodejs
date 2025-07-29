const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdate,
  validatePasswordUpdate,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, UserController.register);
router.post('/login', validateLogin, handleValidationErrors, UserController.login);

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
