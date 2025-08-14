const { pool } = require('../config/database');

class State {
  constructor(stateName, logo = null) {
    this.stateName = stateName;
    this.logo = logo;
  }

  // Create a new state
  async save() {
    try {
      const [result] = await pool.execute(
        'INSERT INTO states (state_name, logo) VALUES (?, ?)',
        [this.stateName, this.logo]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving state:', error);
      throw error;
    }
  }

  // Get all states
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM states ORDER BY state_name ASC'
      );
      return rows;
    } catch (error) {
      console.error('Error finding all states:', error);
      throw error;
    }
  }

  // Find state by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM states WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding state by ID:', error);
      throw error;
    }
  }

  // Find state by name
  static async findByName(stateName) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM states WHERE state_name = ?',
        [stateName]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding state by name:', error);
      throw error;
    }
  }

  // Check if state name exists
  static async stateExists(stateName, excludeId = null) {
    try {
      let query = 'SELECT COUNT(*) as count FROM states WHERE state_name = ?';
      let params = [stateName];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking if state exists:', error);
      throw error;
    }
  }

  // Update state
  static async update(id, stateName, logo) {
    try {
      const [result] = await pool.execute(
        'UPDATE states SET state_name = ?, logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [stateName, logo, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating state:', error);
      throw error;
    }
  }

  // Delete state
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM states WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting state:', error);
      throw error;
    }
  }

  // Search states by name
  static async search(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM states WHERE state_name LIKE ? ORDER BY state_name ASC',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error('Error searching states:', error);
      throw error;
    }
  }

  // Get states count
  static async getCount() {
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM states');
      return rows[0].count;
    } catch (error) {
      console.error('Error getting states count:', error);
      throw error;
    }
  }

  // Get paginated states
  static async findPaginated(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        'SELECT * FROM states ORDER BY state_name ASC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      const total = await this.getCount();
      
      return {
        states: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error finding paginated states:', error);
      throw error;
    }
  }
}

module.exports = State;
