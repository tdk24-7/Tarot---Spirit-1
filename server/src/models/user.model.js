const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    is_premium: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    last_login: {
      type: Sequelize.DATE,
      allowNull: true
    },
    premium_until: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      }
    }
  });

  // Instance method to check password
  User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return User;
}; 