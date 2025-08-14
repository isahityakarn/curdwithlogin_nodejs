const express = require('express');
const router = express.Router();
const {
  getAllNOCs,
  getNOCById,
  getNOCByApplicationNumber,
  createNOC,
  updateNOC,
  deleteNOC,
  searchNOCs,
  getNOCsByState,
  getNOCsByStatus,
  getNOCStatistics,
  addTradeToNOC,
  updateNOCTrade,
  removeTradeFromNOC
} = require('../controllers/nocController');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllNOCs);
router.get('/search', searchNOCs);
router.get('/stats', getNOCStatistics);
router.get('/state/:state', getNOCsByState);
router.get('/status/:status', getNOCsByStatus);
router.get('/application/:applicationNumber', getNOCByApplicationNumber);
router.get('/:id', getNOCById);

// Protected routes (authentication required)
router.post('/', auth, createNOC);
router.put('/:id', auth, updateNOC);
router.delete('/:id', auth, deleteNOC);

// Trade management routes (authentication required)
router.post('/:id/trades', auth, addTradeToNOC);
router.put('/trades/:tradeId', auth, updateNOCTrade);
router.delete('/trades/:tradeId', auth, removeTradeFromNOC);

module.exports = router;
