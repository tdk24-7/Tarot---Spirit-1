const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cards.controller');

// Lấy các lá bài ngẫu nhiên - phải đặt trước route với :id
router.get('/random', cardsController.getRandomCards);

// Route bổ sung để hỗ trợ frontend request
router.get('/random/:count', cardsController.getRandomCards);

// Lấy tất cả các lá bài
router.get('/', cardsController.getAllCards);

// Lấy lá bài theo ID
router.get('/:id', cardsController.getCardById);

module.exports = router; 