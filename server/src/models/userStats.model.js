module.exports = (sequelize, Sequelize) => {
  const UserStats = sequelize.define(
    "user_stats",
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
      readings_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      forum_posts_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      forum_comments_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_reading_date: {
        type: Sequelize.DATE,
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

  return UserStats;
}; 