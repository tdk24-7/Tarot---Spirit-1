const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../models');
const TarotReading = db.tarotReadings;
const TarotReadingCard = db.tarotReadingCards;
const TarotCard = db.tarotCards;
const TarotTopic = db.tarotTopics;

// Khởi tạo Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const modelName = 'gemini-2.0-flash';

/**
 * Dịch vụ xử lý diễn giải bài tarot sử dụng AI
 */
const aiInterpretationService = {
  /**
   * Tạo diễn giải cho một kết quả đọc bài tarot
   * @param {number} readingId - ID của lần đọc bài
   * @param {object} transaction - Transaction object for database operations
   * @returns {Promise<Object>} - Kết quả diễn giải
   */
  generateInterpretation: async (readingId, transaction) => {
    try {
      // Lấy thông tin chi tiết về lần đọc bài
      // Fix: Use transaction to see uncommitted data
      const reading = await TarotReading.findByPk(readingId, {
        include: [
          {
            model: TarotTopic,
            attributes: ['name', 'description']
          },
          {
            model: TarotReadingCard,
            include: [{
              model: TarotCard,
              attributes: ['name', 'arcana', 'suit', 'image_url', 'upright_meaning', 'reversed_meaning', 'description']
            }]
          }
        ],
        transaction: transaction // Pass transaction here
      });

      if (!reading) {
        throw new Error('Reading not found');
      }

      // Tạo prompt cho AI
      const topic = reading.TarotTopic ? reading.TarotTopic.name : 'Tổng quát';
      const question = reading.question || '';

      let cardsInfo = [];
      reading.TarotReadingCards.forEach((readingCard, index) => {
        const card = readingCard.TarotCard;
        const position = index + 1;
        let positionName = '';

        // Xác định tên vị trí dựa vào số thứ tự
        if (position === 1) positionName = 'Bản thân';
        else if (position === 2) positionName = 'Hoàn cảnh';
        else if (position === 3) positionName = 'Lời khuyên';
        else positionName = `Vị trí ${position}`;

        cardsInfo.push({
          position,
          positionName,
          cardName: card.name,
          arcana: card.arcana,
          suit: card.suit,
          isReversed: readingCard.is_reversed,
          meaning: readingCard.is_reversed ? card.reversed_meaning : card.upright_meaning,
          description: card.description
        });
      });

      const prompt = `
        Bạn là một chuyên gia về Tarot với kiến thức sâu rộng về ý nghĩa các lá bài và khả năng diễn giải.
        Hãy phân tích kết quả trải bài Tarot dưới đây và đưa ra diễn giải chi tiết, mang tính cá nhân hóa.
        
        THÔNG TIN TRẢI BÀI:
        - Chủ đề: ${topic}
        - Câu hỏi: ${question || 'Không có câu hỏi cụ thể'}
        
        CÁC LÁ BÀI:
        ${cardsInfo.map(card => `
          Vị trí ${card.position} (${card.positionName}):
          - Lá bài: ${card.cardName} (${card.arcana}${card.suit ? ', ' + card.suit : ''})
          - Trạng thái: ${card.isReversed ? 'Ngược' : 'Xuôi'}
          - Ý nghĩa: ${card.meaning}
          - Mô tả: ${card.description}
        `).join('\n')}
        
        YÊU CẦU:
        1. Phân tích ý nghĩa của từng lá bài trong vị trí của nó
        2. Phân tích mối quan hệ giữa các lá bài
        3. Đưa ra diễn giải tổng thể về tình huống
        4. Đề xuất lời khuyên hoặc hướng đi
        5. Đưa ra kết luận tóm tắt
        
        Định dạng kết quả dưới dạng JSON với cấu trúc sau:
        {
          "cards": [
            {
              "position": 1,
              "name": "Tên lá bài",
              "interpretation": "Diễn giải chi tiết cho lá bài này ở vị trí này"
            },
            ...
          ],
          "overall": "Diễn giải tổng thể cho toàn bộ trải bài",
          "advice": "Lời khuyên cụ thể",
          "summary": "Tóm tắt ngắn gọn (không quá 100 từ)"
        }
      `;

      // Gọi API Gemini
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Parse kết quả từ AI
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        // Fallback format nếu parse JSON thất bại
        parsedResponse = {
          cards: cardsInfo.map(card => ({
            position: card.position,
            name: card.cardName,
            interpretation: card.meaning
          })),
          overall: "Không thể tạo diễn giải tổng thể do lỗi định dạng.",
          advice: "Hãy xem xét ý nghĩa của từng lá bài riêng lẻ.",
          summary: "Không có tóm tắt"
        };
      }

      // Cập nhật giải thích vào từng reading card
      const updates = [];
      for (const cardInterpretation of parsedResponse.cards || []) {
        const readingCard = reading.TarotReadingCards.find(rc =>
          rc.position_in_spread === cardInterpretation.position);

        if (readingCard) {
          updates.push(
            readingCard.update({
              interpretation: cardInterpretation.interpretation,
              interpretation_source: 'AI'
            }, { transaction: transaction })
          );
        }
      }

      // Đảm bảo tất cả các updates hoàn tất
      await Promise.all(updates);

      return {
        cards: parsedResponse.cards,
        overall: parsedResponse.overall,
        advice: parsedResponse.advice,
        summary: parsedResponse.summary
      };
    } catch (error) {
      console.error('Error in AI interpretation:', error);
      throw error;
    }
  },

  /**
   * Lấy tất cả diễn giải cho một lần đọc bài
   * @param {number} readingId - ID của lần đọc bài
   * @returns {Promise<Array>} - Danh sách các diễn giải
   */
  getInterpretations: async (readingId) => {
    try {
      const readingCards = await TarotReadingCard.findAll({
        where: { reading_id: readingId },
        include: [{
          model: TarotCard,
          attributes: ['id', 'name', 'image_url']
        }],
        order: [['position_in_spread', 'ASC']]
      });

      return readingCards.map(rc => ({
        id: rc.id,
        readingId: rc.reading_id,
        cardId: rc.card_id,
        cardName: rc.TarotCard.name,
        position: rc.position_in_spread,
        isReversed: rc.is_reversed,
        interpretation: rc.interpretation,
        interpretationSource: rc.interpretation_source
      }));
    } catch (error) {
      console.error('Error fetching interpretations:', error);
      throw error;
    }
  }
};

module.exports = aiInterpretationService; 