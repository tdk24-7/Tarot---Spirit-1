const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const tarotReadingRoutes = require('./tarotReading.routes');
const cardsRoutes = require('./cards.routes');
const paymentRoutes = require('./payment.routes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/tarot', tarotReadingRoutes);
router.use('/cards', cardsRoutes);
router.use('/payments', paymentRoutes);

module.exports = router; 