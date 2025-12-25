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
db.forumPosts = require('./forumPost.model.js')(sequelize, Sequelize);
db.comments = require('./comment.model.js')(sequelize, Sequelize);
db.reports = require('./report.model.js')(sequelize, Sequelize);
db.postLikes = require('./postLike.model.js')(sequelize, Sequelize);
db.commentLikes = require('./commentLike.model.js')(sequelize, Sequelize);

// Tarot card models
db.tarotCards = require('./tarotCard.model.js')(sequelize, Sequelize);
db.tarotTopics = require('./tarotTopic.model.js')(sequelize, Sequelize);
db.tarotSpreads = require('./tarotSpread.model.js')(sequelize, Sequelize);
db.tarotReadings = require('./tarotReading.model.js')(sequelize, Sequelize);
db.tarotReadingCards = require('./tarotReadingCard.model.js')(sequelize, Sequelize);

// Journal model
db.journals = require('./journal.model.js')(sequelize, Sequelize);

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

// Forum associations
// Post - User
db.users.hasMany(db.forumPosts, { foreignKey: 'user_id' });
db.forumPosts.belongsTo(db.users, { foreignKey: 'user_id', as: 'author' });

// Comment - User
db.users.hasMany(db.comments, { foreignKey: 'user_id' });
db.comments.belongsTo(db.users, { foreignKey: 'user_id', as: 'author' });

// Post - Comment
db.forumPosts.hasMany(db.comments, { foreignKey: 'post_id', as: 'comments' });
db.comments.belongsTo(db.forumPosts, { foreignKey: 'post_id' });

// Comment - Reply (Self-reference)
db.comments.hasMany(db.comments, { foreignKey: 'parent_comment_id', as: 'replies' });
db.comments.belongsTo(db.comments, { foreignKey: 'parent_comment_id', as: 'parent' });

// Likes
db.users.hasMany(db.postLikes, { foreignKey: 'user_id' });
db.postLikes.belongsTo(db.users, { foreignKey: 'user_id' });

db.forumPosts.hasMany(db.postLikes, { foreignKey: 'post_id', as: 'likesList' });
db.postLikes.belongsTo(db.forumPosts, { foreignKey: 'post_id' });

db.users.hasMany(db.commentLikes, { foreignKey: 'user_id' });
db.commentLikes.belongsTo(db.users, { foreignKey: 'user_id' });

db.comments.hasMany(db.commentLikes, { foreignKey: 'comment_id', as: 'likesList' });
db.commentLikes.belongsTo(db.comments, { foreignKey: 'comment_id' });

// Reports
db.users.hasMany(db.reports, { foreignKey: 'reporter_id' });
db.reports.belongsTo(db.users, { foreignKey: 'reporter_id', as: 'reporter' });

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

// Journal associations
db.users.hasMany(db.journals, { foreignKey: 'user_id' });
db.journals.belongsTo(db.users, { foreignKey: 'user_id' });
db.journals.belongsTo(db.tarotReadings, { foreignKey: 'associated_reading_id', as: 'reading' });

module.exports = db; 