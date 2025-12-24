module.exports = (sequelize, Sequelize) => {
  const TarotTopic = sequelize.define('tarot_topics', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tarot_topics',
    timestamps: false
  });

  return TarotTopic;
}; 