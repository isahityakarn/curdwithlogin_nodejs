const express = require('express');
const router = express.Router();
const StateController = require('../controllers/stateController');
const auth = require('../middleware/auth');

// Public routes - Anyone can view states
router.get('/', StateController.getAllStates);
router.get('/search', StateController.searchStates);
router.get('/stats', StateController.getStatesStats);
router.get('/:id', StateController.getStateById);

// Protected routes - Require authentication for CUD operations
router.use(auth); // Apply authentication middleware to routes below

router.post('/', StateController.createState);
router.put('/:id', StateController.updateState);
router.delete('/:id', StateController.deleteState);

module.exports = router;
