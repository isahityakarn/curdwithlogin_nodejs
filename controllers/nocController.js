const NOC = require('../models/NOC');

// Get all NOC certificates
const getAllNOCs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const result = await NOC.findAll(page, limit);

    res.status(200).json({
      message: 'NOC certificates retrieved successfully',
      certificates: result.certificates,
      pagination: {
        page: result.page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Get all NOCs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get NOC certificate by ID
const getNOCById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid NOC ID is required' });
    }

    const certificate = await NOC.findById(id);

    if (!certificate) {
      return res.status(404).json({ error: 'NOC certificate not found' });
    }

    res.status(200).json({
      message: 'NOC certificate retrieved successfully',
      certificate
    });
  } catch (error) {
    console.error('Get NOC by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get NOC certificate by application number
const getNOCByApplicationNumber = async (req, res) => {
  try {
    const { applicationNumber } = req.params;

    if (!applicationNumber) {
      return res.status(400).json({ error: 'Application number is required' });
    }

    const certificate = await NOC.findByApplicationNumber(applicationNumber);

    if (!certificate) {
      return res.status(404).json({ error: 'NOC certificate not found' });
    }

    res.status(200).json({
      message: 'NOC certificate retrieved successfully',
      certificate
    });
  } catch (error) {
    console.error('Get NOC by application number error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new NOC certificate
const createNOC = async (req, res) => {
  try {
    const {
      institute_name,
      complete_address,
      application_number,
      mis_code,
      category,
      state_name,
      issue_date,
      expiry_date,
      status,
      remarks,
      trades
    } = req.body;

    // Validation
    if (!institute_name || !complete_address || !application_number || !category || !state_name || !issue_date || !expiry_date) {
      return res.status(400).json({
        error: 'Institute name, address, application number, category, state, issue date, and expiry date are required'
      });
    }

    // Check if application number already exists
    const existingNOC = await NOC.findByApplicationNumber(application_number);
    if (existingNOC) {
      return res.status(409).json({ error: 'Application number already exists' });
    }

    const nocData = {
      institute_name: institute_name.trim(),
      complete_address: complete_address.trim(),
      application_number: application_number.trim(),
      mis_code: mis_code?.trim(),
      category: category.trim(),
      state_name: state_name.trim(),
      issue_date,
      expiry_date,
      status: status || 'active',
      remarks: remarks?.trim()
    };

    const noc = new NOC(nocData);
    const nocId = await noc.save();

    // Add trades if provided
    if (trades && Array.isArray(trades)) {
      for (const trade of trades) {
        if (trade.trade_name) {
          await NOC.addTrade(nocId, {
            trade_name: trade.trade_name.trim(),
            shift_1_units: trade.shift_1_units || 0,
            shift_2_units: trade.shift_2_units || 0
          });
        }
      }
    }

    const newNOC = await NOC.findById(nocId);

    res.status(201).json({
      message: 'NOC certificate created successfully',
      certificate: newNOC
    });
  } catch (error) {
    console.error('Create NOC error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Application number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Update NOC certificate
const updateNOC = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid NOC ID is required' });
    }

    // Remove trades from update data as they need special handling
    const { trades, ...nocUpdateData } = updateData;

    // Trim string fields
    Object.keys(nocUpdateData).forEach(key => {
      if (typeof nocUpdateData[key] === 'string') {
        nocUpdateData[key] = nocUpdateData[key].trim();
      }
    });

    const updatedNOC = await NOC.update(id, nocUpdateData);

    if (!updatedNOC) {
      return res.status(404).json({ error: 'NOC certificate not found' });
    }

    res.status(200).json({
      message: 'NOC certificate updated successfully',
      certificate: updatedNOC
    });
  } catch (error) {
    console.error('Update NOC error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Application number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Delete NOC certificate
const deleteNOC = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid NOC ID is required' });
    }

    const deleted = await NOC.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'NOC certificate not found' });
    }

    res.status(200).json({
      message: 'NOC certificate deleted successfully'
    });
  } catch (error) {
    console.error('Delete NOC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search NOC certificates
const searchNOCs = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await NOC.search(q.trim(), page, limit);

    res.status(200).json({
      message: 'Search completed successfully',
      query: q.trim(),
      certificates: result.certificates,
      pagination: {
        page: result.page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Search NOCs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get NOC certificates by state
const getNOCsByState = async (req, res) => {
  try {
    const { state } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    if (!state) {
      return res.status(400).json({ error: 'State name is required' });
    }

    const result = await NOC.findByState(state, page, limit);

    res.status(200).json({
      message: 'NOC certificates by state retrieved successfully',
      state: state,
      certificates: result.certificates,
      pagination: {
        page: result.page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Get NOCs by state error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get NOC certificates by status
const getNOCsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!['active', 'expired', 'revoked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be active, expired, or revoked' });
    }

    const result = await NOC.findByStatus(status, page, limit);

    res.status(200).json({
      message: 'NOC certificates by status retrieved successfully',
      status: status,
      certificates: result.certificates,
      pagination: {
        page: result.page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Get NOCs by status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get NOC statistics
const getNOCStatistics = async (req, res) => {
  try {
    const stats = await NOC.getStatistics();

    res.status(200).json({
      message: 'NOC statistics retrieved successfully',
      statistics: stats
    });
  } catch (error) {
    console.error('Get NOC statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add trade to NOC certificate
const addTradeToNOC = async (req, res) => {
  try {
    const { id } = req.params;
    const { trade_name, shift_1_units, shift_2_units } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid NOC ID is required' });
    }

    if (!trade_name) {
      return res.status(400).json({ error: 'Trade name is required' });
    }

    // Check if NOC exists
    const noc = await NOC.findById(id);
    if (!noc) {
      return res.status(404).json({ error: 'NOC certificate not found' });
    }

    const tradeId = await NOC.addTrade(id, {
      trade_name: trade_name.trim(),
      shift_1_units: shift_1_units || 0,
      shift_2_units: shift_2_units || 0
    });

    res.status(201).json({
      message: 'Trade added to NOC certificate successfully',
      trade_id: tradeId
    });
  } catch (error) {
    console.error('Add trade to NOC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update trade in NOC certificate
const updateNOCTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { trade_name, shift_1_units, shift_2_units } = req.body;

    if (!tradeId || isNaN(tradeId)) {
      return res.status(400).json({ error: 'Valid trade ID is required' });
    }

    if (!trade_name) {
      return res.status(400).json({ error: 'Trade name is required' });
    }

    const updated = await NOC.updateTrade(tradeId, {
      trade_name: trade_name.trim(),
      shift_1_units: shift_1_units || 0,
      shift_2_units: shift_2_units || 0
    });

    if (!updated) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.status(200).json({
      message: 'NOC trade updated successfully'
    });
  } catch (error) {
    console.error('Update NOC trade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove trade from NOC certificate
const removeTradeFromNOC = async (req, res) => {
  try {
    const { tradeId } = req.params;

    if (!tradeId || isNaN(tradeId)) {
      return res.status(400).json({ error: 'Valid trade ID is required' });
    }

    const removed = await NOC.removeTrade(tradeId);

    if (!removed) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.status(200).json({
      message: 'Trade removed from NOC certificate successfully'
    });
  } catch (error) {
    console.error('Remove trade from NOC error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
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
};
