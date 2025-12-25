const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models - Chỉ giữ lại các model cần thiết
db.users = require('./user.model.js')(sequelize, Sequelize);
db.userProfiles = require('./userProfile.model.js')(sequelize, Sequelize);
db.userStats = require('./userStats.model.js')(sequelize, Sequelize);
db.userRanks = require('./userRank.model.js')(sequelize, Sequelize);
db.socialAuth = require('./socialAuth.model.js')(sequelize, Sequelize);
db.payments = require('./payment.model.js')(sequelize, Sequelize);

// Tarot card models
db.tarotCards = require('./tarotCard.model.js')(sequelize, Sequelize);
db.tarotTopics = require('./tarotTopic.model.js')(sequelize, Sequelize);
db.tarotSpreads = require('./tarotSpread.model.js')(sequelize, Sequelize);
db.tarotReadings = require('./tarotReading.model.js')(sequelize, Sequelize);
db.tarotReadingCards = require('./tarotReadingCard.model.js')(sequelize, Sequelize);

// Define associations
// User associations
db.users.hasOne(db.userProfiles, { foreignKey: 'user_id' });
db.userProfiles.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasOne(db.userStats, { foreignKey: 'user_id' });
db.userStats.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasMany(db.socialAuth, { foreignKey: 'user_id' });
db.socialAuth.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasMany(db.payments, { foreignKey: 'user_id' });
db.payments.belongsTo(db.users, { foreignKey: 'user_id' });

// Cần giữ lại liên kết này vì user_ranks đã được tham chiếu trong users.model.js
db.userRanks.hasMany(db.users, { foreignKey: 'rank_id' });
db.users.belongsTo(db.userRanks, { foreignKey: 'rank_id' });

// Tarot associations
db.users.hasMany(db.tarotReadings, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.tarotReadings.belongsTo(db.users, { foreignKey: 'user_id', onDelete: 'CASCADE' });

db.tarotTopics.hasMany(db.tarotReadings, { foreignKey: 'topic_id' });
db.tarotReadings.belongsTo(db.tarotTopics, { foreignKey: 'topic_id' });

db.tarotSpreads.hasMany(db.tarotReadings, { foreignKey: 'spread_id' });
db.tarotReadings.belongsTo(db.tarotSpreads, { foreignKey: 'spread_id' });

db.tarotReadings.hasMany(db.tarotReadingCards, { foreignKey: 'reading_id', as: 'cards' });
db.tarotReadingCards.belongsTo(db.tarotReadings, { foreignKey: 'reading_id' });

db.tarotCards.hasMany(db.tarotReadingCards, { foreignKey: 'card_id' });
db.tarotReadingCards.belongsTo(db.tarotCards, { foreignKey: 'card_id', as: 'card' });

module.exports = db; 