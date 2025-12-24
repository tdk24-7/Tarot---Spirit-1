module.exports = (sequelize, Sequelize) => {
  const SocialAuth = sequelize.define(
    "social_auth",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      provider: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'e.g., facebook, google'
      },
      provider_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Unique ID from the provider'
      },
      provider_email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      access_data: {
        type: Sequelize.JSON,
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
      tableName: 'social_auth',
      timestamps: true,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      indexes: [
        {
          unique: true,
          fields: ['provider', 'provider_id']
        },
        {
          fields: ['user_id']
        }
      ]
    }
  );

  return SocialAuth;
}; 