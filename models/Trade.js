const { pool } = require('../config/database');

class Trade {
  constructor(tradeName) {
    this.tradeName = tradeName;
  }

  // Create a new trade
  async save() {
    try {
      const [result] = await pool.execute(
        'INSERT INTO trades (trade_name) VALUES (?)',
        [this.tradeName]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving trade:', error);
      throw error;
    }
  }

  // Get all trades
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM trades ORDER BY trade_name ASC'
      );
      return rows;
    } catch (error) {
      console.error('Error finding all trades:', error);
      throw error;
    }
  }

  // Find trade by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM trades WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding trade by ID:', error);
      throw error;
    }
  }

  // Find trade by name
  static async findByName(tradeName) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM trades WHERE trade_name = ?',
        [tradeName]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding trade by name:', error);
      throw error;
    }
  }

  // Check if trade name exists
  static async tradeExists(tradeName, excludeId = null) {
    try {
      let query = 'SELECT COUNT(*) as count FROM trades WHERE trade_name = ?';
      let params = [tradeName];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking if trade exists:', error);
      throw error;
    }
  }

  // Update trade
  static async update(id, tradeName) {
    try {
      const [result] = await pool.execute(
        'UPDATE trades SET trade_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [tradeName, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  }

  // Delete trade
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM trades WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  }

  // Search trades by name
  static async search(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM trades WHERE trade_name LIKE ? ORDER BY trade_name ASC',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error('Error searching trades:', error);
      throw error;
    }
  }

  // Get trades count
  static async getCount() {
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM trades');
      return rows[0].count;
    } catch (error) {
      console.error('Error getting trades count:', error);
      throw error;
    }
  }

  // Get paginated trades
  static async findPaginated(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        'SELECT * FROM trades ORDER BY trade_name ASC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      const total = await this.getCount();
      
      return {
        trades: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error finding paginated trades:', error);
      throw error;
    }
  }

  // Get trades by category/type (for future enhancement)
  static async findByCategory(category) {
    try {
      // This is a placeholder for future categorization
      // For now, we'll return all trades
      return await this.findAll();
    } catch (error) {
      console.error('Error finding trades by category:', error);
      throw error;
    }
  }

  // Get random trades (useful for featured trades)
  static async findRandom(limit = 5) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM trades ORDER BY RAND() LIMIT ?',
        [limit]
      );
      return rows;
    } catch (error) {
      console.error('Error finding random trades:', error);
      throw error;
    }
  }
}

module.exports = Trade;
