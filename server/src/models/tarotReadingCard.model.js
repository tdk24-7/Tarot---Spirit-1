module.exports = (sequelize, Sequelize) => {
  const TarotReadingCard = sequelize.define('tarot_reading_card', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reading_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tarot_readings',
        key: 'id'
      }
    },
    card_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tarot_cards',
        key: 'id'
      }
    },
    position_in_spread: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: 'Position of the card in the spread (1, 2, 3, etc.)'
    },
    is_reversed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the card is upright (false) or reversed (true)'
    },
    interpretation: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'The interpretation of this card in this reading'
    },
    interpretation_source: {
      type: Sequelize.ENUM('Normal', 'AI'),
      defaultValue: 'Normal',
      comment: 'Source of the interpretation'
    }
  }, {
    tableName: 'reading_cards',
    timestamps: false // Disable timestamps as the table doesn't have created_at column
  });

  return TarotReadingCard;
}; 