module.exports = (sequelize, Sequelize) => {
  const TarotReading = sequelize.define('tarot_reading', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    topic_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    spread_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    question: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    summary: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    combined_interpretation: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    conclusion: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    interpretation_source: {
      type: Sequelize.ENUM('Normal', 'AI'),
      defaultValue: 'Normal'
    }
  }, {
    tableName: 'tarot_readings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return TarotReading;
}; 