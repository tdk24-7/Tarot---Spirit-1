require('dotenv').config();
const db = require('./src/models');

console.log('Syncing database...');

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database sync error:', err);
    process.exit(1);
  }); 