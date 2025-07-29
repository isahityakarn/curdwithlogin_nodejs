const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // Create a new user
  async save() {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [this.name, this.email, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find all users
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email (for authentication)
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, name, email) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const [result] = await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    try {
      let query = 'SELECT id FROM users WHERE email = ?';
      let params = [email];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Generate password reset token
  static async generatePasswordResetToken(email) {
    try {
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      const [result] = await pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [resetToken, resetTokenExpires, email]
      );
      
      if (result.affectedRows > 0) {
        return resetToken;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by reset token
  static async findByResetToken(resetToken) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
        [resetToken]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Reset password with token
  static async resetPasswordWithToken(resetToken, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const [result] = await pool.execute(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ? AND reset_token_expires > NOW()',
        [hashedPassword, resetToken]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Reset password directly with email (no token required)
  static async resetPasswordByEmail(email, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const [result] = await pool.execute(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
        [hashedPassword, email]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Generate and store OTP for email verification
  static async generateOTP(email) {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      const [result] = await pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [otp, otpExpires, email]
      );
      
      if (result.affectedRows > 0) {
        return otp;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  static async verifyOTP(email, otp) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW()',
        [email, otp]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Clear OTP after verification
  static async clearOTP(email) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
        [email]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
