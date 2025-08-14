const { pool } = require('../config/database');

class NOC {
  constructor(instituteData) {
    this.institute_name = instituteData.institute_name;
    this.complete_address = instituteData.complete_address;
    this.application_number = instituteData.application_number;
    this.mis_code = instituteData.mis_code;
    this.category = instituteData.category;
    this.state_name = instituteData.state_name;
    this.issue_date = instituteData.issue_date;
    this.expiry_date = instituteData.expiry_date;
    this.status = instituteData.status || 'active';
    this.remarks = instituteData.remarks;
  }

  // Create a new NOC certificate
  async save() {
    try {
      const [result] = await pool.execute(
        `INSERT INTO noc_certificates 
         (institute_name, complete_address, application_number, mis_code, category, state_name, issue_date, expiry_date, status, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.institute_name,
          this.complete_address,
          this.application_number,
          this.mis_code,
          this.category,
          this.state_name,
          this.issue_date,
          this.expiry_date,
          this.status,
          this.remarks
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving NOC certificate:', error);
      throw error;
    }
  }

  // Get all NOC certificates with pagination
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
        `SELECT nc.*, GROUP_CONCAT(CONCAT(nt.trade_name, ' (S1:', nt.shift_1_units, ', S2:', nt.shift_2_units, ')') SEPARATOR ', ') as trades
         FROM noc_certificates nc
         LEFT JOIN noc_trades nt ON nc.id = nt.noc_id
         GROUP BY nc.id
         ORDER BY nc.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM noc_certificates');
      const total = countResult[0].total;

      return {
        certificates: rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error finding all NOC certificates:', error);
      throw error;
    }
  }

  // Get NOC certificate by ID with trades
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM noc_certificates WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      // Get associated trades
      const [trades] = await pool.execute(
        `SELECT * FROM noc_trades WHERE noc_id = ?`,
        [id]
      );

      return {
        ...rows[0],
        trades
      };
    } catch (error) {
      console.error('Error finding NOC certificate by ID:', error);
      throw error;
    }
  }

  // Get NOC certificate by application number
  static async findByApplicationNumber(applicationNumber) {
    try {
      const [rows] = await pool.execute(
        `SELECT nc.*, GROUP_CONCAT(CONCAT(nt.trade_name, ' (S1:', nt.shift_1_units, ', S2:', nt.shift_2_units, ')') SEPARATOR ', ') as trades
         FROM noc_certificates nc
         LEFT JOIN noc_trades nt ON nc.id = nt.noc_id
         WHERE nc.application_number = ?
         GROUP BY nc.id`,
        [applicationNumber]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding NOC certificate by application number:', error);
      throw error;
    }
  }

  // Update NOC certificate
  static async update(id, updateData) {
    try {
      const fields = Object.keys(updateData).map(field => `${field} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(id);

      const [result] = await pool.execute(
        `UPDATE noc_certificates SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating NOC certificate:', error);
      throw error;
    }
  }

  // Delete NOC certificate
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM noc_certificates WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting NOC certificate:', error);
      throw error;
    }
  }

  // Search NOC certificates
  static async search(query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const searchTerm = `%${query}%`;

      const [rows] = await pool.execute(
        `SELECT nc.*, GROUP_CONCAT(CONCAT(nt.trade_name, ' (S1:', nt.shift_1_units, ', S2:', nt.shift_2_units, ')') SEPARATOR ', ') as trades
         FROM noc_certificates nc
         LEFT JOIN noc_trades nt ON nc.id = nt.noc_id
         WHERE nc.institute_name LIKE ? 
         OR nc.application_number LIKE ? 
         OR nc.state_name LIKE ? 
         OR nc.category LIKE ?
         GROUP BY nc.id
         ORDER BY nc.created_at DESC
         LIMIT ? OFFSET ?`,
        [searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await pool.execute(
        `SELECT COUNT(DISTINCT nc.id) as total 
         FROM noc_certificates nc
         WHERE nc.institute_name LIKE ? 
         OR nc.application_number LIKE ? 
         OR nc.state_name LIKE ? 
         OR nc.category LIKE ?`,
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );

      const total = countResult[0].total;

      return {
        certificates: rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        searchTerm: query
      };
    } catch (error) {
      console.error('Error searching NOC certificates:', error);
      throw error;
    }
  }

  // Get NOC certificates by state
  static async findByState(stateName, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT nc.*, GROUP_CONCAT(CONCAT(nt.trade_name, ' (S1:', nt.shift_1_units, ', S2:', nt.shift_2_units, ')') SEPARATOR ', ') as trades
         FROM noc_certificates nc
         LEFT JOIN noc_trades nt ON nc.id = nt.noc_id
         WHERE nc.state_name = ?
         GROUP BY nc.id
         ORDER BY nc.created_at DESC
         LIMIT ? OFFSET ?`,
        [stateName, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM noc_certificates WHERE state_name = ?',
        [stateName]
      );

      const total = countResult[0].total;

      return {
        certificates: rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        state: stateName
      };
    } catch (error) {
      console.error('Error finding NOC certificates by state:', error);
      throw error;
    }
  }

  // Get NOC certificates by status
  static async findByStatus(status, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT nc.*, GROUP_CONCAT(CONCAT(nt.trade_name, ' (S1:', nt.shift_1_units, ', S2:', nt.shift_2_units, ')') SEPARATOR ', ') as trades
         FROM noc_certificates nc
         LEFT JOIN noc_trades nt ON nc.id = nt.noc_id
         WHERE nc.status = ?
         GROUP BY nc.id
         ORDER BY nc.created_at DESC
         LIMIT ? OFFSET ?`,
        [status, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM noc_certificates WHERE status = ?',
        [status]
      );

      const total = countResult[0].total;

      return {
        certificates: rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        status
      };
    } catch (error) {
      console.error('Error finding NOC certificates by status:', error);
      throw error;
    }
  }

  // Get NOC statistics
  static async getStatistics() {
    try {
      const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM noc_certificates');
      const [statusStats] = await pool.execute(`
        SELECT status, COUNT(*) as count 
        FROM noc_certificates 
        GROUP BY status
      `);
      const [stateStats] = await pool.execute(`
        SELECT state_name, COUNT(*) as count 
        FROM noc_certificates 
        GROUP BY state_name 
        ORDER BY count DESC 
        LIMIT 10
      `);
      const [categoryStats] = await pool.execute(`
        SELECT category, COUNT(*) as count 
        FROM noc_certificates 
        GROUP BY category
      `);
      const [expiringResult] = await pool.execute(`
        SELECT COUNT(*) as count 
        FROM noc_certificates 
        WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND status = 'active'
      `);

      return {
        total: totalResult[0].total,
        statusBreakdown: statusStats,
        stateBreakdown: stateStats,
        categoryBreakdown: categoryStats,
        expiringSoon: expiringResult[0].count
      };
    } catch (error) {
      console.error('Error getting NOC statistics:', error);
      throw error;
    }
  }

  // Add trade to NOC certificate
  static async addTrade(nocId, tradeData) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO noc_trades (noc_id, trade_name, shift_1_units, shift_2_units)
         VALUES (?, ?, ?, ?)`,
        [nocId, tradeData.trade_name, tradeData.shift_1_units || 0, tradeData.shift_2_units || 0]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding trade to NOC:', error);
      throw error;
    }
  }

  // Update trade in NOC certificate
  static async updateTrade(tradeId, tradeData) {
    try {
      const [result] = await pool.execute(
        `UPDATE noc_trades 
         SET trade_name = ?, shift_1_units = ?, shift_2_units = ?
         WHERE id = ?`,
        [tradeData.trade_name, tradeData.shift_1_units || 0, tradeData.shift_2_units || 0, tradeId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating NOC trade:', error);
      throw error;
    }
  }

  // Remove trade from NOC certificate
  static async removeTrade(tradeId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM noc_trades WHERE id = ?',
        [tradeId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error removing NOC trade:', error);
      throw error;
    }
  }
}

module.exports = NOC;
