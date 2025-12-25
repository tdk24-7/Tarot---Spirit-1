const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const tarotReadingRoutes = require('./tarotReading.routes');
const cardsRoutes = require('./cards.routes');
const paymentRoutes = require('./payment.routes');
const forumRoutes = require('./forum.routes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tarot', tarotReadingRoutes);
router.use('/cards', cardsRoutes);
router.use('/payments', paymentRoutes);
router.use('/forum', forumRoutes);
router.use('/journals', require('./journal.routes'));

module.exports = router; 