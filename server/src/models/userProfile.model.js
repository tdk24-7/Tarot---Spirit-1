module.exports = (sequelize, Sequelize) => {
  const UserProfile = sequelize.define(
    "user_profiles",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      avatar_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return UserProfile;
}; 