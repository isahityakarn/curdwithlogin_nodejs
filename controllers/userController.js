const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if email already exists
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = new User(name, email, password);
      const userId = await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, name, email }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if email already exists (excluding current user)
      const emailExists = await User.emailExists(email, id);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Update user
      const updated = await User.update(id, name, email);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update user' });
      }

      // Get updated user
      const updatedUser = await User.findById(id);
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update password
  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user with password
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await User.verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Update password
      const updated = await User.updatePassword(userId, newPassword);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update password' });
      }

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete user
      const deleted = await User.delete(id);
      if (!deleted) {
        return res.status(400).json({ error: 'Failed to delete user' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
