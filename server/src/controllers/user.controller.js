const db = require('../models');
const User = db.users;
const UserProfile = db.userProfiles;
const UserSettings = db.userSettings;
const bcrypt = require('bcrypt');

// Lấy thông tin hồ sơ người dùng
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Lấy thông tin profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    if (!userProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found'
      });
    }

    // Lấy thông tin user (không bao gồm password)
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    // Lấy thông tin stats
    const userStats = await db.userStats.findOne({
      where: { user_id: userId }
    });

    // Format dữ liệu trả về
    const profileData = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isPremium: user.is_premium,
        points: user.points,
        createdAt: user.created_at,
        lastLogin: user.last_login
      },
      profile: {
        fullName: userProfile.full_name,
        avatarUrl: userProfile.avatar_url,
        bio: userProfile.bio,
        dateOfBirth: userProfile.date_of_birth,
        gender: userProfile.gender,
        location: userProfile.location,
        website: userProfile.website
      },
      stats: userStats ? {
        readingsCount: userStats.readings_count,
        forumPostsCount: userStats.forum_posts_count,
        forumCommentsCount: userStats.forum_comments_count
      } : null
    };

    res.status(200).json({
      status: 'success',
      data: profileData
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin hồ sơ
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      bio,
      birthDate,
      phoneNumber,
      gender,
      location,
      city,
      country,
      website,
      avatarUrl
    } = req.body;

    // Tạo object với các trường cần cập nhật
    const updateFields = {
      full_name: fullName,
      bio,
      birth_date: birthDate,
      phone_number: phoneNumber,
      gender,
      location,
      city,
      country,
      website
    };
    
    // Chỉ cập nhật avatar nếu được cung cấp
    if (avatarUrl) {
      updateFields.avatar_url = avatarUrl;
    }

    // Cập nhật profile
    const [updatedRows, [updatedProfile]] = await UserProfile.update(
      updateFields,
      {
        where: { user_id: userId },
        returning: true
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        profile: {
          fullName: updatedProfile.full_name,
          bio: updatedProfile.bio,
          dateOfBirth: updatedProfile.birth_date,
          phoneNumber: updatedProfile.phone_number,
          gender: updatedProfile.gender,
          city: updatedProfile.city,
          country: updatedProfile.country,
          location: updatedProfile.location,
          website: updatedProfile.website,
          avatarUrl: updatedProfile.avatar_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Lấy thông tin user
    const user = await User.findByPk(userId);

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Cập nhật mật khẩu mới
    user.password_hash = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Lấy cài đặt người dùng
exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Tìm hoặc tạo settings
    const [userSettings, created] = await UserSettings.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        email_notifications: true,
        push_notifications: true,
        theme: 'system',
        language: 'en'
      }
    });

    // Format dữ liệu trả về
    const settingsData = {
      emailNotifications: userSettings.email_notifications,
      pushNotifications: userSettings.push_notifications,
      theme: userSettings.theme,
      language: userSettings.language
    };

    res.status(200).json({
      status: 'success',
      data: {
        settings: settingsData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật cài đặt người dùng
exports.updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      emailNotifications,
      pushNotifications,
      theme,
      language
    } = req.body;

    // Tìm hoặc tạo settings
    const [userSettings, created] = await UserSettings.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        email_notifications: true,
        push_notifications: true,
        theme: 'system',
        language: 'en'
      }
    });

    // Cập nhật settings
    const updatedSettings = await userSettings.update({
      email_notifications: emailNotifications !== undefined ? emailNotifications : userSettings.email_notifications,
      push_notifications: pushNotifications !== undefined ? pushNotifications : userSettings.push_notifications,
      theme: theme || userSettings.theme,
      language: language || userSettings.language
    });

    // Format dữ liệu trả về
    const settingsData = {
      emailNotifications: updatedSettings.email_notifications,
      pushNotifications: updatedSettings.push_notifications,
      theme: updatedSettings.theme,
      language: updatedSettings.language
    };

    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: {
        settings: settingsData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Tải lên avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Kiểm tra có file upload không (sử dụng middleware multer)
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    // Lấy đường dẫn file đã upload (xử lý bởi middleware)
    const avatarUrl = req.file.path;

    // Cập nhật avatar trong profile
    const [updatedRows, [updatedProfile]] = await UserProfile.update(
      { avatar_url: avatarUrl },
      {
        where: { user_id: userId },
        returning: true
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
}; 