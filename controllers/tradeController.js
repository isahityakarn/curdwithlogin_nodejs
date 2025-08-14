const Trade = require('../models/Trade');

class TradeController {
  // Get all trades
  static async getAllTrades(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      if (search) {
        const trades = await Trade.search(search);
        return res.json({
          message: 'Trades retrieved successfully',
          trades,
          total: trades.length
        });
      }
      
      if (page && limit) {
        const result = await Trade.findPaginated(parseInt(page), parseInt(limit));
        return res.json({
          message: 'Trades retrieved successfully',
          ...result
        });
      }
      
      const trades = await Trade.findAll();
      res.json({
        message: 'Trades retrieved successfully',
        trades,
        total: trades.length
      });
    } catch (error) {
      console.error('Get all trades error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get trade by ID
  static async getTradeById(req, res) {
    try {
      const { id } = req.params;
      const trade = await Trade.findById(id);
      
      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.json({
        message: 'Trade retrieved successfully',
        trade
      });
    } catch (error) {
      console.error('Get trade by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new trade
  static async createTrade(req, res) {
    try {
      const { trade_name } = req.body;

      if (!trade_name) {
        return res.status(400).json({ error: 'Trade name is required' });
      }

      // Validate trade name length
      if (trade_name.length < 2) {
        return res.status(400).json({ error: 'Trade name must be at least 2 characters long' });
      }

      if (trade_name.length > 100) {
        return res.status(400).json({ error: 'Trade name must be less than 100 characters' });
      }

      const tradeExists = await Trade.tradeExists(trade_name);
      if (tradeExists) {
        return res.status(400).json({ error: 'Trade already exists' });
      }

      const trade = new Trade(trade_name);
      const tradeId = await trade.save();

      const newTrade = await Trade.findById(tradeId);
      res.status(201).json({
        message: 'Trade created successfully',
        trade: newTrade
      });
    } catch (error) {
      console.error('Create trade error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update trade
  static async updateTrade(req, res) {
    try {
      const { id } = req.params;
      const { trade_name } = req.body;

      if (!trade_name) {
        return res.status(400).json({ error: 'Trade name is required' });
      }

      // Validate trade name length
      if (trade_name.length < 2) {
        return res.status(400).json({ error: 'Trade name must be at least 2 characters long' });
      }

      if (trade_name.length > 100) {
        return res.status(400).json({ error: 'Trade name must be less than 100 characters' });
      }

      const existingTrade = await Trade.findById(id);
      if (!existingTrade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      const tradeExists = await Trade.tradeExists(trade_name, id);
      if (tradeExists) {
        return res.status(400).json({ error: 'Trade name already in use' });
      }

      const updated = await Trade.update(id, trade_name);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update trade' });
      }

      const updatedTrade = await Trade.findById(id);
      res.json({
        message: 'Trade updated successfully',
        trade: updatedTrade
      });
    } catch (error) {
      console.error('Update trade error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete trade
  static async deleteTrade(req, res) {
    try {
      const { id } = req.params;

      const existingTrade = await Trade.findById(id);
      if (!existingTrade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      const deleted = await Trade.delete(id);
      if (!deleted) {
        return res.status(400).json({ error: 'Failed to delete trade' });
      }

      res.json({
        message: 'Trade deleted successfully',
        deletedTrade: existingTrade
      });
    } catch (error) {
      console.error('Delete trade error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search trades
  static async searchTrades(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const trades = await Trade.search(q);
      res.json({
        message: 'Search completed successfully',
        query: q,
        trades,
        total: trades.length
      });
    } catch (error) {
      console.error('Search trades error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get trades statistics
  static async getTradesStats(req, res) {
    try {
      const totalTrades = await Trade.getCount();
      const allTrades = await Trade.findAll();
      
      // Calculate some basic stats
      const avgNameLength = allTrades.reduce((sum, trade) => sum + trade.trade_name.length, 0) / totalTrades;
      const longestTradeName = allTrades.reduce((longest, trade) => 
        trade.trade_name.length > longest.length ? trade.trade_name : longest, ''
      );
      const shortestTradeName = allTrades.reduce((shortest, trade) => 
        trade.trade_name.length < shortest.length ? trade.trade_name : shortest, allTrades[0]?.trade_name || ''
      );

      res.json({
        message: 'Trades statistics retrieved successfully',
        stats: {
          total: totalTrades,
          averageNameLength: Math.round(avgNameLength * 100) / 100,
          longestTradeName,
          shortestTradeName,
          recentlyAdded: allTrades.slice(-5) // Last 5 added trades
        }
      });
    } catch (error) {
      console.error('Get trades stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get random/featured trades
  static async getFeaturedTrades(req, res) {
    try {
      const { limit = 5 } = req.query;
      const trades = await Trade.findRandom(parseInt(limit));
      
      res.json({
        message: 'Featured trades retrieved successfully',
        trades,
        total: trades.length
      });
    } catch (error) {
      console.error('Get featured trades error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = TradeController;
