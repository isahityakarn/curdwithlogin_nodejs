const express = require('express');
const router = express.Router();
const TradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// Public routes - Anyone can view trades
router.get('/', TradeController.getAllTrades);
router.get('/search', TradeController.searchTrades);
router.get('/stats', TradeController.getTradesStats);
router.get('/featured', TradeController.getFeaturedTrades);
router.get('/:id', TradeController.getTradeById);

// Protected routes - Require authentication for CUD operations
router.use(auth); // Apply authentication middleware to routes below

router.post('/', TradeController.createTrade);
router.put('/:id', TradeController.updateTrade);
router.delete('/:id', TradeController.deleteTrade);

module.exports = router;
