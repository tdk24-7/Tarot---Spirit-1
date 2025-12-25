const db = require('../models');
const TarotReading = db.tarotReadings;
const ReadingCard = db.tarotReadingCards; // Fix: db.readingCards does not exist in models/index.js
const TarotCard = db.tarotCards;
const TarotTopic = db.tarotTopics;
const TarotSpread = db.tarotSpreads;
const TarotCardMeaning = db.tarotCardMeanings;
const User = db.users;
const UserStats = db.userStats;
const TarotReadingCard = db.tarotReadingCards;
const aiInterpretationService = require('../services/aiInterpretation.service');

// Get all readings (admin only)
exports.getAllReadings = async (req, res, next) => {
  try {
    const readings = await TarotReading.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: readings.length,
      data: {
        readings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get recent readings (public)
exports.getRecentReadings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const readings = await TarotReading.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit
    });

    res.status(200).json({
      status: 'success',
      results: readings.length,
      data: {
        readings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's readings
exports.getUserReadings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const readings = await TarotReading.findAll({
      where: { user_id: userId },
      include: [
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name']
        },
        {
          model: ReadingCard,
          include: [{
            model: TarotCard,
            attributes: ['id', 'name', 'arcana', 'suit', 'image_url']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: readings.length,
      data: {
        readings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get reading by ID
exports.getReadingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reading = await TarotReading.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name']
        },
        {
          model: ReadingCard,
          as: 'cards',
          include: [{
            model: TarotCard,
            attributes: ['id', 'name', 'arcana', 'suit', 'image_url'],
            include: [{
              model: TarotCardMeaning,
              where: { topic_id: db.sequelize.col('tarot_reading.topic_id') },
              required: false
            }]
          }]
        }
      ]
    });

    if (!reading) {
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found'
      });
    }

    // Check if user is authorized to view this reading
    if (reading.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this reading'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        reading
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new reading
exports.createReading = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { type, cards, domain, question } = req.body;
    const userId = req.user.id;

    // Get default topic and spread
    const topic = await TarotTopic.findOne({
      where: {
        name: domain || 'general'
      }
    });

    if (!topic) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Topic not found'
      });
    }

    // Find the three-card spread or default spread
    const spread = await TarotSpread.findOne({
      where: {
        name: 'Three Card'
      }
    });

    if (!spread) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Spread not found'
      });
    }

    const topic_id = topic.id;
    const spread_id = spread.id;

    // Create reading
    const reading = await TarotReading.create({
      user_id: userId,
      topic_id,
      spread_id,
      question: question || null
    }, { transaction });

    // Add cards to reading with interpretations
    const readingCards = await Promise.all(
      cards.map(async (card, index) => {
        // Get card details
        const tarotCard = await TarotCard.findByPk(card.id);
        const interpretation = card.is_reversed
          ? tarotCard.general_reversed_meaning || tarotCard.reversed_meaning || "Nghĩa ngược chưa được cung cấp"
          : tarotCard.general_upright_meaning || tarotCard.upright_meaning || "Nghĩa chưa được cung cấp";

        return TarotReadingCard.create({
          reading_id: reading.id,
          card_id: card.id,
          position: index + 1,
          position_in_spread: index + 1,
          is_reversed: card.is_reversed || false,
          interpretation: interpretation,
          interpretation_source: 'Normal'
        }, { transaction });
      })
    );

    // Generate AI interpretation if requested
    if (req.body.generate_interpretation) {
      await aiInterpretationService.generateInterpretation(reading.id, transaction);
    }

    // Update user stats
    await UserStats.increment('readings_count', {
      by: 1,
      where: { user_id: userId },
      transaction
    });

    await UserStats.update(
      { last_reading_date: new Date() },
      { where: { user_id: userId }, transaction }
    );

    await transaction.commit();

    // Fetch the complete reading with associations
    const completeReading = await TarotReading.findByPk(reading.id, {
      include: [
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name']
        },
        {
          model: ReadingCard,
          include: [{
            model: TarotCard,
            attributes: ['id', 'name', 'arcana', 'suit', 'image_url']
          }]
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Reading created successfully',
      data: {
        reading: completeReading,
        cards: readingCards
      }
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Update a reading (admin only)
exports.updateReading = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { topic_id, spread_id, question } = req.body;

    const reading = await TarotReading.findByPk(id);
    if (!reading) {
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found'
      });
    }

    // Update reading
    await reading.update({
      topic_id: topic_id || reading.topic_id,
      spread_id: spread_id || reading.spread_id,
      question: question || reading.question
    });

    res.status(200).json({
      status: 'success',
      message: 'Reading updated successfully',
      data: {
        reading
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a reading (admin only)
exports.deleteReading = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    const reading = await TarotReading.findByPk(id);
    if (!reading) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found'
      });
    }

    // Delete associated reading cards
    await ReadingCard.destroy({
      where: { reading_id: id },
      transaction
    });

    // Delete reading
    await reading.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({
      status: 'success',
      message: 'Reading deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Get a tarot reading by ID
exports.getReading = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reading = await TarotReading.findByPk(id, {
      include: [
        {
          model: TarotTopic,
          attributes: ['id', 'name', 'description']
        },
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: TarotReadingCard,
          include: [{ model: TarotCard }]
        }
      ]
    });

    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    res.json(reading);
  } catch (error) {
    console.error('Error getting reading:', error);
    res.status(500).json({ message: 'Failed to retrieve reading', error: error.message });
  }
};

// Perform AI-based reading
exports.performAIReading = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log("Received AI reading request:", JSON.stringify(req.body, null, 2));

    // Hỗ trợ cả hai format: camelCase và snake_case
    const {
      // Format camelCase
      selectedCards, topicId, spreadId,
      // Format snake_case  
      selected_cards, topic_id, spread_id,
      // Các trường không bị ảnh hưởng bởi format
      question, domain, useAI
    } = req.body;

    // Sử dụng tham số từ định dạng mới nếu có, nếu không thì dùng định dạng cũ
    // Ưu tiên sử dụng bản snake_case cho database, nhưng client gửi camelCase
    let finalSelectedCards = selected_cards || selectedCards;

    // Fallback cho trường hợp selectedIndices và displayedCards (format cũ)
    if ((!finalSelectedCards || finalSelectedCards.length === 0) &&
      req.body.selectedIndices && req.body.displayedCards) {
      console.log("Using legacy format: selectedIndices + displayedCards");
      finalSelectedCards = req.body.selectedIndices.map(index => {
        const card = req.body.displayedCards[index];
        return {
          id: card.id,
          isReversed: (card.isReversed !== undefined) ? card.isReversed : Math.random() < 0.4
        };
      });
    }

    const finalTopicId = topic_id || topicId || 1; // Default to Love if missing
    const finalSpreadId = spread_id || spreadId || 1; // Default to 3-card spread

    console.log("Final Prompt Params:", { finalTopicId, finalSpreadId, cardCount: finalSelectedCards ? finalSelectedCards.length : 0 });

    // Cho phép user_id là null nếu không có xác thực
    const userId = req.user ? req.user.id : null;

    // Validate required fields
    if (!finalSelectedCards || !Array.isArray(finalSelectedCards) || finalSelectedCards.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected cards are required'
      });
    }

    if (!finalTopicId) {
      return res.status(400).json({
        status: 'error',
        message: 'Topic ID is required'
      });
    }

    if (!finalSpreadId) {
      return res.status(400).json({
        status: 'error',
        message: 'Spread ID is required'
      });
    }

    // Create reading
    const reading = await TarotReading.create({
      user_id: userId,
      topic_id: finalTopicId,
      spread_id: finalSpreadId,
      question: question || null,
      reading_type: 'ai'
    }, { transaction });

    // Add cards to reading
    const readingCards = await Promise.all(
      finalSelectedCards.map(async (card, index) => {
        // Get card details for interpretation
        const tarotCard = await TarotCard.findByPk(card.id || card);

        return TarotReadingCard.create({
          reading_id: reading.id,
          card_id: card.id || card,
          position: index + 1,
          position_in_spread: index + 1,
          is_reversed: card.isReversed || false
        }, { transaction });
      })
    );

    // Generate AI interpretation
    const interpretation = await aiInterpretationService.generateInterpretation(reading.id, transaction);

    // Update user stats only if user is authenticated
    if (userId) {
      try {
        await UserStats.increment('readings_count', {
          by: 1,
          where: { user_id: userId },
          transaction
        });

        await UserStats.update(
          { last_reading_date: new Date() },
          { where: { user_id: userId }, transaction }
        );
      } catch (statsError) {
        console.error("Error updating user stats:", statsError);
        // Continue without failing the entire request
      }
    }

    await transaction.commit();

    // Fetch complete reading with cards and interpretation
    const completeReading = await TarotReading.findByPk(reading.id, {
      include: [
        {
          model: TarotTopic,
          attributes: ['id', 'name']
        },
        {
          model: TarotSpread,
          attributes: ['id', 'name', 'position_labels']
        },
        {
          model: ReadingCard,
          include: [{
            model: TarotCard,
            attributes: ['id', 'name', 'arcana', 'suit', 'image_url', 'upright_meaning', 'reversed_meaning', 'description']
          }]
        }
      ]
    });

    // Get all reading cards with interpretations
    const readingCardsWithInterpretations = await TarotReadingCard.findAll({
      where: { reading_id: reading.id },
      include: [{
        model: TarotCard,
        attributes: ['id', 'name', 'arcana', 'suit', 'image_url']
      }]
    });

    // DEBUG: Nếu kết quả rỗng, throw error để hiện lên frontend
    if (!readingCardsWithInterpretations || readingCardsWithInterpretations.length === 0) {
      throw new Error(`DEBUG: Found 0 cards for reading ${reading.id}. Transaction cards: ${readingCards.length}. Input cards: ${JSON.stringify(finalSelectedCards)}`);
    }

    // Format the response
    // Format the response
    const formattedReading = {
      id: completeReading.id,
      userId: completeReading.user_id,
      question: completeReading.question,
      topic: completeReading.TarotTopic ? completeReading.TarotTopic.name : 'General',
      spread: completeReading.TarotSpread ? completeReading.TarotSpread.name : 'Three Card',
      createdAt: completeReading.created_at,
      selectedCards: readingCardsWithInterpretations.map(rc => ({
        id: rc.TarotCard ? rc.TarotCard.id : rc.card_id,
        name: rc.TarotCard ? rc.TarotCard.name : 'Unknown Card',
        arcana: rc.TarotCard ? rc.TarotCard.arcana : '',
        suit: rc.TarotCard ? rc.TarotCard.suit : '',
        imageUrl: rc.TarotCard ? rc.TarotCard.image_url : '',
        position: rc.position,
        isReversed: rc.is_reversed,
        interpretation: rc.interpretation
      })),
      // Explicitly include interpretation object here
      interpretation: {
        summary: "AI Reading",
        combined: interpretation, // This is the text returned by aiInterpretationService
        sections: readingCardsWithInterpretations.map(rc => ({
          title: `${rc.position_in_spread || 'Vị trí ' + rc.position}: ${rc.TarotCard ? rc.TarotCard.name : 'Unknown Card'} ${rc.is_reversed ? '(Ngược)' : ''}`,
          content: rc.interpretation || "No interpretation"
        }))
      }
    };

    res.status(201).json({
      status: 'success',
      data: {
        reading: formattedReading
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("AI Reading error:", error);
    next(error);
  }
};

// Generate AI interpretation for an existing reading
exports.generateInterpretation = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if reading exists
    const reading = await TarotReading.findByPk(id);
    if (!reading) {
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found'
      });
    }

    // Check if user is authorized to access this reading
    if (reading.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to access this reading'
      });
    }

    // Generate interpretation
    const interpretations = await aiInterpretationService.generateInterpretation(id);

    // Get updated reading cards with interpretations
    const readingCards = await TarotReadingCard.findAll({
      where: { reading_id: id },
      include: [{
        model: TarotCard,
        attributes: ['id', 'name', 'image_url']
      }]
    });

    // Format the response
    const formattedInterpretations = readingCards.map(rc => ({
      cardId: rc.card_id,
      cardName: rc.TarotCard.name,
      position: rc.position,
      isReversed: rc.is_reversed,
      interpretation: rc.interpretation
    }));

    res.status(200).json({
      status: 'success',
      data: {
        interpretations: formattedInterpretations
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all interpretations for a reading
exports.getReadingInterpretations = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if reading exists
    const reading = await TarotReading.findByPk(id);
    if (!reading) {
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found'
      });
    }

    // Check if user is authorized to access this reading
    if (reading.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to access this reading'
      });
    }

    // Get reading cards with interpretations
    const readingCards = await TarotReadingCard.findAll({
      where: { reading_id: id },
      include: [{
        model: TarotCard,
        attributes: ['id', 'name', 'image_url']
      }]
    });

    // Format the response
    const interpretations = readingCards.map(rc => ({
      cardId: rc.card_id,
      cardName: rc.TarotCard.name,
      position: rc.position,
      isReversed: rc.is_reversed,
      interpretation: rc.interpretation,
      interpretationSource: rc.interpretation_source
    }));

    res.status(200).json({
      status: 'success',
      results: interpretations.length,
      data: {
        interpretations
      }
    });
  } catch (error) {
    next(error);
  }
}; 