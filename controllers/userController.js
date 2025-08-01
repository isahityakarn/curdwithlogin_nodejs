const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

class UserController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User(name, email, password);
      const userId = await user.save();

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

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

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

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

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

  static async getProfile(req, res) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const emailExists = await User.emailExists(email, id);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const updated = await User.update(id, name, email);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update user' });
      }

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

  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await User.verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

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

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

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

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User with this email not found' });
      }

      const resetToken = await User.generatePasswordResetToken(email);
      if (!resetToken) {
        return res.status(500).json({ error: 'Failed to generate reset token' });
      }

      const emailResult = await emailService.sendPasswordResetEmail(
        email, 
        resetToken, 
        user.name
      );

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Failed to send reset email',
          details: emailResult.error 
        });
      }

      res.json({
        message: 'Password reset email sent successfully',
        email: email
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const updated = await User.resetPasswordWithToken(token, newPassword);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to reset password' });
      }

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resetPasswordDirect(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User with this email not found' });
      }

      // Generate a random new password
      const crypto = require('crypto');
      const newPassword = crypto.randomBytes(8).toString('hex');

      // Update password directly
      const updated = await User.resetPasswordByEmail(email, newPassword);
      if (!updated) {
        return res.status(500).json({ error: 'Failed to reset password' });
      }

      // Send new password via email
      const emailResult = await emailService.sendNewPasswordEmail(
        email, 
        newPassword, 
        user.name
      );

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Password reset but failed to send email',
          details: emailResult.error 
        });
      }

      res.json({
        message: 'Password reset successfully. New password sent to your email.',
        email: email
      });
    } catch (error) {
      console.error('Direct password reset error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async sendOTP(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User with this email not found' });
      }

      const otp = await User.generateOTP(email);
      if (!otp) {
        return res.status(500).json({ error: 'Failed to generate OTP' });
      }

      const emailResult = await emailService.sendOTPEmail(
        email, 
        otp, 
        user.name
      );

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Failed to send OTP email',
          details: emailResult.error 
        });
      }

      res.json({
        message: 'OTP sent to your email successfully',
        email: email,
        expiresIn: '10 minutes'
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async verifyOTPAndSendResetLink(req, res) {
    try {
      const { email, otp } = req.body;

      const user = await User.verifyOTP(email, otp);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Clear the OTP and generate reset token
      await User.clearOTP(email);
      const resetToken = await User.generatePasswordResetToken(email);
      
      if (!resetToken) {
        return res.status(500).json({ error: 'Failed to generate reset token' });
      }

      // Send password reset email with link
      const emailResult = await emailService.sendPasswordResetEmail(
        email, 
        resetToken, 
        user.name
      );

      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Failed to send reset email',
          details: emailResult.error 
        });
      }

      res.json({
        message: 'OTP verified successfully. Password reset link sent to your email.',
        email: email
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resetPasswordWithQueryToken(req, res) {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;
      //  return res.status(400).json({ "token": token });
      if (!token) {
        return res.status(400).json({ "token": 'Reset token is required as query parameter' });
      }

      if (!newPassword) {
        return res.status(400).json({ error: 'New password is required' });
      }

      // Validate password strength
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      //   return res.status(400).json({ 
      //     error: 'New password must contain at least one lowercase letter, one uppercase letter, and one number' 
      //   });
      // }

      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const updated = await User.resetPasswordWithToken(token, newPassword);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to reset password' });
      }

      res.json({ 
        message: 'Password reset successfully',
        success: true
      });
    } catch (error) {
      console.error('Reset password with query token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
