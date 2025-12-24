const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('../models');
const User = db.users;
const UserProfile = db.userProfiles;
const UserStats = db.userStats;
const SocialAuth = db.socialAuth;
const { Op } = db.Sequelize;
const { OAuth2Client } = require('google-auth-library');

// Helper function to generate token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || '3fc984d477522ac580222373842700cee3d14127eb60c7b81278df98bf6202f1d69f91fa5565d4a23d8434510befb0188e3a8f1ac3acedcc9ea99ebf0ec01119',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Handle generic social login (Google, Facebook)
exports.socialLogin = async (req, res, next) => {
  try {
    const { provider, token, email, name, id } = req.body;

    if (!token || !provider || (!email && !id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required social login information'
      });
    }

    let socialId, socialEmail, socialName;

    // Verify token based on provider
    if (provider === 'google') {
      try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        socialId = payload.sub;
        socialEmail = payload.email;
        socialName = payload.name;
      } catch (error) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid Google token'
        });
      }
    } else if (provider === 'facebook') {
      // For Facebook we trust the data sent from frontend
      // In a production app, you would verify the token with Facebook API
      socialId = id;
      socialEmail = email;
      socialName = name;
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Unsupported social login provider'
      });
    }

    // Find or create user
    let user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: socialEmail },
          { [`${provider}_id`]: socialId }
        ]
      }
    });

    if (!user) {
      // Create new user
      user = await User.create({
        username: socialName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        email: socialEmail,
        password_hash: Math.random().toString(36).slice(-8), // Random password
        [`${provider}_id`]: socialId,
        role: 'user',
        is_premium: false,
        points: 0
      });

      // Create user profile
      await UserProfile.create({
        user_id: user.id
      });

      // Create user stats
      await UserStats.create({
        user_id: user.id,
        readings_count: 0,
        forum_posts_count: 0,
        forum_comments_count: 0
      });
    } else {
      // Update social ID if not already set
      if (!user[`${provider}_id`]) {
        await user.update({
          [`${provider}_id`]: socialId
        });
      }
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate token
    const jwtToken = generateToken(user.id);

    // Return response
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at
    };

    res.status(200).json({
      status: 'success',
      message: 'Social login successful',
      data: {
        user: userData,
        token: jwtToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Specific Facebook login handler
exports.facebookLogin = async (req, res, next) => {
  try {
    console.log('Facebook login request:', req.body);
    const { accessToken, userId } = req.body;

    if (!accessToken || !userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Facebook access token and user ID are required'
      });
    }

    // In a real implementation, verify the token with Facebook Graph API
    // For simplicity, we'll trust the token provided

    // Tìm kiếm trong bảng social_auth trước
    const socialAuth = await db.socialAuth.findOne({
      where: {
        provider: 'facebook',
        provider_id: userId
      },
      include: [{
        model: User,
        required: true
      }]
    });

    let user = null;
    
    if (socialAuth) {
      // Nếu đã có trong social_auth, lấy user từ quan hệ
      user = socialAuth.user;
      console.log('Found existing user via social auth:', user.id);
    } else {
      console.log('No existing social auth record found, creating new user');
      // Tạo user mới
      user = await User.create({
        username: 'fb_user_' + userId.substring(0, 8),
        email: `fb_${userId}@placeholder.com`, // Would get real email from Facebook API
        password_hash: Math.random().toString(36).slice(-8), // Random password
        role: 'user',
        is_premium: false,
        points: 0
      });

      // Tạo social auth record
      await db.socialAuth.create({
        user_id: user.id,
        provider: 'facebook',
        provider_id: userId,
        provider_email: req.body.email || null,
        access_data: { accessToken }
      });

      // Create user profile
      await UserProfile.create({
        user_id: user.id
      });

      // Create user stats
      await UserStats.create({
        user_id: user.id,
        readings_count: 0,
        forum_posts_count: 0,
        forum_comments_count: 0
      });
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate token
    const token = generateToken(user.id);

    // Return response
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at
    };

    res.status(200).json({
      status: 'success',
      message: 'Facebook login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    next(error);
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code is required');
    }

    // In a real implementation, exchange code for tokens
    // For simplicity, redirect to frontend with a placeholder status
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?status=success`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

// Google login handler
exports.googleLogin = async (req, res, next) => {
  try {
    console.log('Google login request:', req.body);
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Google access token is required'
      });
    }

    // Lấy thông tin người dùng từ Google API bằng access token
    let googleUserId;
    let googleEmail;
    let googleName;
    
    try {
      // Thay vì verify ID token, sử dụng access token để gọi Google API
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      googleUserId = userData.sub;
      googleEmail = userData.email;
      googleName = userData.name;
      console.log('Google user info retrieved:', userData);
    } catch (error) {
      console.error('Google token verification error:', error.message);
      if (error.response) {
        console.error('Google API response:', error.response.data);
      }
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Google token'
      });
    }

    // Tìm kiếm trong bảng social_auth trước
    const socialAuth = await db.socialAuth.findOne({
      where: {
        provider: 'google',
        provider_id: googleUserId
      },
      include: [{
        model: User,
        required: true
      }]
    });

    let user = null;
    
    if (socialAuth) {
      // Nếu đã có trong social_auth, lấy user từ quan hệ
      user = socialAuth.user;
      console.log('Found existing user via social auth:', user.id);
    } else {
      console.log('No existing social auth record found, checking email:', googleEmail);
      
      // Kiểm tra xem email đã tồn tại chưa
      if (googleEmail) {
        const existingUser = await User.findOne({
          where: { email: googleEmail }
        });
        
        if (existingUser) {
          user = existingUser;
          console.log('Found user with matching email:', user.id);
          
          // Liên kết tài khoản với Google
          await db.socialAuth.create({
            user_id: user.id,
            provider: 'google',
            provider_id: googleUserId,
            provider_email: googleEmail,
            access_data: { token }
          });
        }
      }
      
      if (!user) {
        console.log('Creating new user for Google login');
        // Tạo user mới
        user = await User.create({
          username: 'google_' + googleUserId.substring(0, 8),
          email: googleEmail || `google_${googleUserId}@placeholder.com`,
          password_hash: Math.random().toString(36).slice(-8), // Random password
          role: 'user',
          is_premium: false,
          points: 0
        });

        // Tạo social auth record
        await db.socialAuth.create({
          user_id: user.id,
          provider: 'google',
          provider_id: googleUserId,
          provider_email: googleEmail,
          access_data: { token }
        });

        // Create user profile with name from Google if available
        await UserProfile.create({
          user_id: user.id,
          full_name: googleName || ''
        });

        // Create user stats
        await UserStats.create({
          user_id: user.id,
          readings_count: 0,
          forum_posts_count: 0,
          forum_comments_count: 0
        });
      }
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate token
    const jwtToken = generateToken(user.id);

    // Return response
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_premium: user.is_premium,
      points: user.points,
      created_at: user.created_at
    };

    res.status(200).json({
      status: 'success',
      message: 'Google login successful',
      data: {
        user: userData,
        token: jwtToken
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    next(error);
  }
}; 