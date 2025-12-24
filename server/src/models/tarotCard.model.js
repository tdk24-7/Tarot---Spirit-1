module.exports = (sequelize, Sequelize) => {
  console.log('Khởi tạo model TarotCard...');
  const TarotCard = sequelize.define('tarot_card', {
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
    arcana: {
      type: Sequelize.ENUM('Major', 'Minor'),
      allowNull: false
    },
    suit: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    number: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    image_url: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    general_upright_meaning: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    general_reversed_meaning: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    story: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'tarot_cards',
    timestamps: false
  });
  
  console.log('Model TarotCard đã được khởi tạo');
  return TarotCard;
};