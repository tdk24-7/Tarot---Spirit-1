require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || 'Donemagicjob123',
  DB: process.env.DB_NAME || 'tarot_system',
  PORT: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Hàm kiểm tra kết nối đến database
async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      port: dbConfig.PORT
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB}`);
    await connection.end();
    
    console.log('Kết nối đến database thành công!');
    return true;
  } catch (error) {
    console.error('Không thể kết nối đến database:', error);
    return false;
  }
}

module.exports = {
  ...dbConfig,
  testConnection
};