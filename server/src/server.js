/**
 * Server chính của ứng dụng Tarot
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./models');
const { seedTarotCards } = require('./utils/dbSeeder');

const path = require('path');

// Cấu hình môi trường - load .env from server root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify critical environment variables are loaded
console.log('=== ENVIRONMENT CHECK ===');
console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? `Loaded (${process.env.GOOGLE_AI_API_KEY.substring(0, 10)}...)` : 'NOT LOADED');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');

// Khởi tạo express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth.routes');
const tarotRoutes = require('./routes/tarotReading.routes');
const userRoutes = require('./routes/user.routes');
const journalRoutes = require('./routes/journal.routes');
const forumRoutes = require('./routes/forum.routes');
const adminRoutes = require('./routes/admin.routes');
const routes = require('./routes');

// Sử dụng routes chính
app.use('/api', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: '1.0.0' });
});

// Health check route (từ index.js)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running'
  });
});

// Test endpoint (từ index.js)
app.get('/api/test-cards', (req, res) => {
  console.log('Test endpoint /api/test-cards được gọi');
  res.status(200).json({
    status: 'success',
    message: 'Test endpoint is working',
    data: { cards: [{ id: 1, name: 'Test Card' }] }
  });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('ERROR HANDLER:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Middleware xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`
  });
});

// Sync database và khởi động server
console.log('Đang kết nối và đồng bộ database (Alter mode ON)...');
db.sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synced successfully');

    // Seed dữ liệu mẫu nếu cần
    try {
      await seedTarotCards();
    } catch (error) {
      console.error('Lỗi khi seed dữ liệu:', error);
    }

    // Khởi động server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên port ${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Test cards endpoint: http://localhost:${PORT}/api/test-cards`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

module.exports = app;  
