const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;
const UserProfile = db.userProfiles;
const UserStats = db.userStats;
const crypto = require('crypto');
const { sendMail } = require('../utils/emailService');

// Helper function to generate token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || '3fc984d477522ac580222373842700cee3d14127eb60c7b81278df98bf6202f1d69f91fa5565d4a23d8434510befb0188e3a8f1ac3acedcc9ea99ebf0ec01119',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (userExists) {
      return res.status(409).json({
        status: 'error',
        message: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: password,
      role: 'user',
      is_premium: false,
      points: 0
    });

    // Create user profile with username as full_name
    await UserProfile.create({
      user_id: user.id,
      full_name: username
    });

    // Create user stats
    await UserStats.create({
      user_id: user.id,
      readings_count: 0,
      forum_posts_count: 0,
      forum_comments_count: 0
    });

    // Generate token
    const token = generateToken(user.id);

    // Get created profile to return
    const userProfile = await UserProfile.findOne({
      where: { user_id: user.id }
    });

    // Return response without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at,
      profile: userProfile
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// User login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate token
    const token = generateToken(user.id);

    // Fetch user profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: user.id }
    });

    // Return response without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at,
      profile: userProfile
    };

    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    // Check if user exists, password matches, and is admin
    if (!user || !(await user.comparePassword(password)) || user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid admin credentials'
      });
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate token
    const token = generateToken(user.id);

    // Fetch user profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: user.id }
    });

    // Return response without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at,
      profile: userProfile
    };

    res.status(200).json({
      status: 'success',
      message: 'Admin logged in successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to user
    await user.update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    });

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link is valid for 1 hour.</p>
      `
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find user by token
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: { [db.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Reset password
    user.password_hash = password;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    // Get user from request (set by authJwt middleware)
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: user.id }
    });

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at,
      profile: userProfile
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: userData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is required'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tarot-system-secret-key'
      );
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Check if user still exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    // Generate new token
    const newToken = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = (req, res) => {
  // Client-side logout (token invalidation handled client-side)
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Update password
    user.password_hash = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
}; 