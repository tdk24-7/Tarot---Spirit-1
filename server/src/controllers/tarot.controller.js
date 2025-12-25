const db = require('../models');
const TarotCard = db.tarotCards;
const TarotReading = db.tarotReadings;
const TarotReadingCard = db.tarotReadingCards;
const User = db.users;
const { generateAIResponse } = require('../services/ai.service');
const TarotTopic = db.tarotTopics;
const TarotSpread = db.tarotSpreads;

// Lấy tất cả lá bài Tarot
exports.getAllCards = async (req, res, next) => {
  try {
    const { type, suit } = req.query;

    // Xây dựng query filter
    const filter = {};
    if (type) filter.type = type;
    if (suit) filter.suit = suit;

    const cards = await TarotCard.findAll({
      where: filter,
      order: [
        ['type', 'ASC'],
        ['suit', 'ASC'],
        ['number', 'ASC']
      ]
    });

    res.status(200).json({
      status: 'success',
      count: cards.length,
      data: {
        cards
      }
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết một lá bài
exports.getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await TarotCard.findByPk(id);

    if (!card) {
      return res.status(404).json({
        status: 'error',
        message: 'Card not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        card
      }
    });
  } catch (error) {
    next(error);
  }
};

// Lấy lá bài hàng ngày (có tích hợp AI và lưu database)
exports.getDailyCard = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 1. Nếu user đã đăng nhập, kiểm tra xem đã có reading cho hôm nay chưa
    if (userId) {
      const existingReading = await TarotReading.findOne({
        where: {
          user_id: userId,
          type: 'daily',
          created_at: {
            [db.Sequelize.Op.between]: [startOfDay, endOfDay]
          }
        },
        include: [{
          model: TarotReadingCard,
          as: 'cards',
          include: [{
            model: TarotCard,
            as: 'card'
          }]
        }]
      });

      if (existingReading && existingReading.cards && existingReading.cards.length > 0) {
        console.log('Found existing daily reading for user');
        const readingCard = existingReading.cards[0];
        const cardEntity = readingCard.card;

        let interpretationJSON;
        try {
          interpretationJSON = JSON.parse(existingReading.interpretation || existingReading.combined_interpretation);
        } catch (e) {
          interpretationJSON = { dailyMessage: existingReading.combined_interpretation };
        }

        return res.status(200).json({
          status: 'success',
          data: {
            date: startOfDay.toISOString().split('T')[0],
            card: {
              ...cardEntity.toJSON(),
              image_url: cardEntity.image_url || cardEntity.imageUrl,
              imageUrl: cardEntity.image_url || cardEntity.imageUrl,
              isReversed: readingCard.is_reversed,
              dailyMessage: interpretationJSON.dailyMessage || existingReading.combined_interpretation,
              loveMessage: interpretationJSON.loveMessage || "Chưa có thông điệp",
              careerMessage: interpretationJSON.careerMessage || "Chưa có thông điệp",
              healthMessage: interpretationJSON.healthMessage || "Chưa có thông điệp",
              keywords: interpretationJSON.keywords || []
            }
          }
        });
      }
    }

    // 2. Nếu chưa có, tạo mới
    // Tạo seed: Ngày + UserID (nếu có) để mỗi người có lá bài riêng
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // Nếu có userId, cộng thêm vào seed để khác nhau giữa các user. Nếu không (guest), dùng seed chung theo ngày.
    const userSeedPart = userId ? userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const dateSeedPart = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalSeed = dateSeedPart + userSeedPart;

    const cardCount = await TarotCard.count();
    const randomIndex = totalSeed % cardCount;

    const cards = await TarotCard.findAll({
      order: [['id', 'ASC']],
      offset: randomIndex,
      limit: 1
    });

    if (!cards.length) {
      return res.status(404).json({ status: 'error', message: 'No cards found' });
    }

    const card = cards[0];
    const isReversed = (totalSeed % 2) === 1; // Logic ngược xuôi ngẫu nhiên theo ngày + user

    // 3. Gọi AI để tạo interpretation
    let aiResponse = {
      dailyMessage: isReversed ? card.general_reversed_meaning : card.general_upright_meaning,
      loveMessage: "Thông điệp tình yêu đang được cập nhật...",
      careerMessage: "Thông điệp sự nghiệp đang được cập nhật...",
      healthMessage: "Thông điệp sức khỏe đang được cập nhật...",
      keywords: ["Tarot", "Daily"]
    };

    try {
      const prompt = `
        Bạn là một chuyên gia Tarot chuyên nghiệp. Hãy giải thích lá bài "${card.name}" (${isReversed ? 'Ngược' : 'Xuôi'}) cho bói bài hàng ngày (Daily Tarot).
        Hãy trả về kết quả dưới dạng JSON KHÔNG CÓ Markdown code block, chỉ thuần JSON string với cấu trúc sau:
        {
          "dailyMessage": "Thông điệp tổng quan ngắn gọn (khoảng 2-3 câu) cho ngày hôm nay.",
          "loveMessage": "Lời khuyên ngắn gọn về tình cảm.",
          "careerMessage": "Lời khuyên ngắn gọn về công việc/sự nghiệp.",
          "healthMessage": "Lời khuyên ngắn gọn về sức khỏe/tinh thần.",
          "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"]
        }
        Lưu ý: Giọng văn nhẹ nhàng, chữa lành, và sâu sắc.
      `;

      const rawAiContent = await generateAIResponse(prompt);
      // Clean up markdown syntax if AI adds it
      const jsonStr = rawAiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      aiResponse = JSON.parse(jsonStr);
      console.log('AI generated daily interpretation successfully');
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError);
    }

    // 4. Lưu vào database nếu user đã đăng nhập
    if (userId) {
      const newReading = await TarotReading.create({
        user_id: userId,
        topic_id: 1, // Default topic usually
        spread_id: 1, // Single card spread
        type: 'daily',
        question: 'Daily Tarot Reading for ' + dateString,
        summary: aiResponse.dailyMessage, // Save summary for history list
        combined_interpretation: JSON.stringify(aiResponse), // Save full JSON here
        interpretation_source: 'AI'
      });

      await TarotReadingCard.create({
        reading_id: newReading.id,
        card_id: card.id,
        position_in_spread: 1,
        is_reversed: isReversed,
        interpretation: aiResponse.dailyMessage,
        interpretation_source: 'AI'
      });
    }

    // 5. Trả về kết quả
    res.status(200).json({
      status: 'success',
      data: {
        date: dateString,
        card: {
          ...card.toJSON(),
          isReversed,
          ...aiResponse
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy ngẫu nhiên các lá bài
exports.getRandomCards = async (req, res, next) => {
  try {
    const { count = 3 } = req.body;

    // Giới hạn số lượng lá bài tối đa
    const limit = Math.min(count, 12);

    // Lấy tất cả lá bài và trộn ngẫu nhiên
    const allCards = await TarotCard.findAll();

    // Trộn mảng lá bài
    const shuffledCards = allCards.sort(() => 0.5 - Math.random());

    // Lấy n lá bài đầu tiên
    const selectedCards = shuffledCards.slice(0, limit).map(card => ({
      ...card.toJSON(),
      isReversed: Math.random() > 0.5
    }));

    res.status(200).json({
      status: 'success',
      count: selectedCards.length,
      data: {
        cards: selectedCards
      }
    });
  } catch (error) {
    next(error);
  }
};

// Tạo kết quả bói bài mới (bói thường)
exports.createReading = async (req, res) => {
  try {
    console.log('Request body for createReading:', JSON.stringify(req.body, null, 2));

    // Kiểm tra và xử lý dữ liệu đầu vào từ cả hai định dạng API
    let selectedCards, topic_id, spread_id, question, domain;

    // Xử lý cho định dạng API mới
    if (req.body.topic_id && req.body.spread_id && req.body.selected_cards) {
      topic_id = req.body.topic_id;
      spread_id = req.body.spread_id;
      question = req.body.question || '';
      selectedCards = req.body.selected_cards;
      console.log('Using new API format with topic_id and spread_id');
      console.log('Selected card IDs:', selectedCards);
    }
    // Xử lý cho định dạng API cũ
    else if (req.body.selectedIndices && req.body.displayedCards) {
      domain = req.body.domain || 'love';
      question = req.body.question || '';

      // Tìm topic_id từ domain
      const topicMap = {
        'love': 1,
        'career': 2,
        'finance': 3,
        'health': 4,
        'spiritual': 5
      };
      topic_id = topicMap[domain] || 1; // Mặc định là Tình Yêu nếu không tìm thấy domain
      spread_id = 1; // Sử dụng spread ID mặc định cho trải bài 3 lá

      // Lấy ID của các lá bài đã chọn
      selectedCards = req.body.selectedIndices.map(index => req.body.displayedCards[index].id);
      console.log('Using old API format with selectedIndices and displayedCards');
    } else {
      console.error('Invalid request format:', req.body);
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request format'
      });
    }

    // Kiểm tra dữ liệu
    if (!selectedCards || selectedCards.length !== 3) {
      console.error('Not enough cards selected:', selectedCards);
      return res.status(400).json({
        status: 'error',
        message: 'Exactly 3 cards are required for a reading'
      });
    }

    // Tạo vị trí và nghĩa cho từng lá bài
    const positions = ['Bản thân', 'Hoàn cảnh', 'Thử thách'];
    const positionDescriptions = [
      'Đại diện cho bạn trong tình huống hiện tại. Lá bài này phản ánh tâm trạng, cảm xúc và năng lượng của bạn.',
      'Thể hiện hoàn cảnh xung quanh bạn và các yếu tố ảnh hưởng đến tình huống. Lá bài này cho biết những thách thức và cơ hội bạn đang đối mặt.',
      'Biểu thị kết quả tiềm năng hoặc lời khuyên để giải quyết tình huống. Lá bài này gợi ý hướng phát triển hoặc giải pháp cho vấn đề của bạn.'
    ];

    try {
      // Tạo bản ghi reading trong database
      const newReading = await TarotReading.create({
        user_id: req.user ? req.user.id : null, // Cho phép user_id null khi không có xác thực
        topic_id: topic_id,
        spread_id: spread_id,
        type: 'standard',
        question: question,
        domain: domain,
        created_at: new Date()
      });

      console.log('Created new reading record with ID:', newReading.id);

      // Lấy thông tin chi tiết cho các lá bài được chọn
      let selectedCardsDetails = [];

      if (req.body.selectedIndices && req.body.displayedCards) {
        // Nếu có dữ liệu đầy đủ từ client
        selectedCardsDetails = await Promise.all(
          req.body.selectedIndices.map(async (index, i) => {
            try {
              const cardInfo = req.body.displayedCards[index];
              console.log(`Processing card at index ${index}:`, cardInfo);

              // Xác định ngẫu nhiên xem lá bài có bị ngược không (nếu chưa có trong dữ liệu)
              const isReversed = cardInfo.isReversed !== undefined ? cardInfo.isReversed : Math.random() < 0.4;

              // Tìm thông tin đầy đủ của card từ database nếu cần
              let cardDetail = null;
              try {
                // Đảm bảo cardInfo.id là một số hoặc chuỗi hợp lệ, không phải object
                const cardId = typeof cardInfo.id === 'object' ? (cardInfo.id.id || cardInfo.id.toString()) : cardInfo.id;
                console.log(`Finding card with ID ${cardId} in database...`);
                cardDetail = await TarotCard.findByPk(cardId);
                if (cardDetail) {
                  console.log(`Found card in database: ${cardDetail.name}`);
                } else {
                  console.log(`Card with ID ${cardId} not found in database`);
                }
              } catch (err) {
                console.error(`Error finding card detail for ID ${cardInfo.id}:`, err);
                // Tiếp tục với cardInfo nếu không tìm thấy cardDetail
              }

              // Tạo interpretation cho lá bài
              const interpretation = generateCardInterpretation(
                cardDetail || cardInfo,
                positions[i],
                isReversed,
                positionDescriptions[i],
                domain
              );

              // Tạo bản ghi trong bảng reading_cards
              let readingCard;
              try {
                readingCard = await TarotReadingCard.create({
                  reading_id: newReading.id,
                  card_id: typeof cardInfo.id === 'object' ? (cardInfo.id.id || cardInfo.id.toString()) : cardInfo.id,
                  position_in_spread: i + 1,
                  is_reversed: isReversed,
                  interpretation: interpretation,
                  interpretation_source: 'Normal'
                });
                console.log('Created reading card record:', readingCard.id);
              } catch (err) {
                console.error('Error creating reading card record:', err);
                // Tiếp tục mà không throw lỗi
              }

              // Trả về thông tin lá bài để hiển thị
              return {
                id: cardInfo.id,
                name: cardDetail ? cardDetail.name : cardInfo.name,
                position: positions[i],
                position_in_spread: i + 1,
                imageUrl: cardDetail ? cardDetail.imageUrl || cardDetail.image_url : cardInfo.imageUrl,
                image_url: cardDetail ? cardDetail.image_url || cardDetail.imageUrl : cardInfo.imageUrl || cardInfo.imageUrl,
                type: cardDetail ? cardDetail.type : cardInfo.type,
                suit: cardDetail ? cardDetail.suit : cardInfo.suit,
                number: cardDetail ? cardDetail.number : cardInfo.number,
                isReversed: isReversed,
                meaning: isReversed ?
                  (cardDetail ?
                    cardDetail.general_reversed_meaning ||
                    cardDetail.reversed_meaning ||
                    cardDetail.meaning_reversed ||
                    (cardDetail.meaning ? `${cardDetail.meaning} (Khi ngược)` : null) ||
                    "Nghĩa ngược chưa được cung cấp" :
                    cardInfo.general_reversed_meaning ||
                    cardInfo.reversed_meaning ||
                    cardInfo.meaning_reversed ||
                    (cardInfo.meaning ? `${cardInfo.meaning} (Khi ngược)` : null) ||
                    "Nghĩa ngược chưa được cung cấp") :
                  (cardDetail ?
                    cardDetail.general_upright_meaning ||
                    cardDetail.upright_meaning ||
                    cardDetail.meaning ||
                    cardDetail.general_meaning ||
                    cardDetail.description ||
                    "Nghĩa chưa được cung cấp" :
                    cardInfo.general_upright_meaning ||
                    cardInfo.upright_meaning ||
                    cardInfo.meaning ||
                    cardInfo.general_meaning ||
                    cardInfo.description ||
                    "Nghĩa chưa được cung cấp"),
                interpretation: interpretation
              };
            } catch (err) {
              console.error('Error processing card:', err);
              // Trả về một đối tượng card cơ bản nếu có lỗi
              return {
                id: req.body.displayedCards[index].id,
                name: req.body.displayedCards[index].name || 'Unknown Card',
                position: positions[i],
                position_in_spread: i + 1,
                isReversed: false,
                meaning: 'Card meaning unavailable due to processing error',
                interpretation: 'Interpretation unavailable due to processing error'
              };
            }
          })
        );
      } else {
        // Nếu chỉ có ID của cards
        console.log('Processing cards using only IDs:', selectedCards);
        selectedCardsDetails = await Promise.all(
          selectedCards.map(async (cardId, i) => {
            try {
              // Đảm bảo cardId là một số hoặc chuỗi hợp lệ, không phải object
              const actualCardId = typeof cardId === 'object' ? (cardId.id || cardId.toString()) : cardId;

              // Tìm thông tin đầy đủ của card từ database
              console.log(`Finding card with ID ${actualCardId} in database...`);
              const cardDetail = await TarotCard.findByPk(actualCardId);
              if (!cardDetail) {
                console.error(`Card with ID ${actualCardId} not found in database`);
                throw new Error(`Card with ID ${actualCardId} not found`);
              }
              console.log(`Found card in database: ${cardDetail.name}`);

              // Xác định ngẫu nhiên xem lá bài có bị ngược không
              const isReversed = Math.random() < 0.4;

              // Tạo interpretation cho lá bài
              const interpretation = generateCardInterpretation(
                cardDetail,
                positions[i],
                isReversed,
                positionDescriptions[i],
                domain
              );

              // Tạo bản ghi trong bảng reading_cards
              const readingCard = await TarotReadingCard.create({
                reading_id: newReading.id,
                card_id: typeof cardId === 'object' ? (cardId.id || cardId.toString()) : cardId,
                position_in_spread: i + 1,
                is_reversed: isReversed,
                interpretation: interpretation,
                interpretation_source: 'Normal'
              });

              // Trả về thông tin lá bài để hiển thị
              const cardData = {
                id: cardDetail.id,
                name: cardDetail.name,
                position: positions[i],
                position_in_spread: i + 1,
                imageUrl: cardDetail.imageUrl || cardDetail.image_url,
                image_url: cardDetail.image_url || cardDetail.imageUrl,
                type: cardDetail.type,
                suit: cardDetail.suit,
                number: cardDetail.number,
                isReversed: isReversed,
                meaning: isReversed ?
                  cardDetail.general_reversed_meaning ||
                  cardDetail.reversed_meaning ||
                  cardDetail.meaning_reversed ||
                  (cardDetail.meaning ? `${cardDetail.meaning} (Khi ngược)` : null) ||
                  "Nghĩa ngược chưa được cung cấp"
                  :
                  cardDetail.general_upright_meaning ||
                  cardDetail.upright_meaning ||
                  cardDetail.meaning ||
                  cardDetail.general_meaning ||
                  cardDetail.description ||
                  "Nghĩa chưa được cung cấp",
                interpretation: interpretation
              };
              console.log(`Card data prepared for ${cardDetail.name}:`, cardData);
              return cardData;
            } catch (err) {
              console.error(`Error processing card ID ${cardId}:`, err);
              // Trả về một đối tượng card cơ bản nếu có lỗi
              return {
                id: cardId,
                name: 'Unknown Card',
                position: positions[i],
                position_in_spread: i + 1,
                isReversed: false,
                meaning: 'Card meaning unavailable due to processing error',
                interpretation: 'Interpretation unavailable due to processing error'
              };
            }
          })
        );
      }

      // Tạo phần diễn giải tổng hợp
      const combinedInterpretation = generateCombinedInterpretation(selectedCardsDetails, domain);

      // Cập nhật interpretation tổng hợp vào bản ghi reading
      const interpretationJSON = {
        sections: selectedCardsDetails.map(card => ({
          title: `${card.position}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
          content: card.interpretation
        })),
        combined: combinedInterpretation
      };

      try {
        await newReading.update({
          interpretation: JSON.stringify(interpretationJSON)
        });
      } catch (err) {
        console.error('Error updating reading with interpretation:', err);
        // Tiếp tục mà không throw lỗi
      }

      // Tạo kết quả đọc bài hoàn chỉnh để trả về
      const readingResult = {
        id: newReading.id,
        type: 'standard',
        topic_id: topic_id,
        spread_id: spread_id,
        question: question,
        domain: domain,
        selectedCards: selectedCardsDetails,
        createdAt: newReading.created_at,
        // Thêm phần diễn giải tổng hợp
        interpretation: interpretationJSON
      };

      console.log('Sending back reading result with interpretation');
      return res.status(200).json(readingResult);
    } catch (dbError) {
      console.error('Database error in createReading:', dbError);

      // Tạo bản ghi tạm thời (không lưu vào database)
      const temporaryReadingId = Date.now();
      console.log('Creating temporary reading with ID:', temporaryReadingId);

      // Tạo kết quả tạm thời
      const tempSelectedCards = [];

      // Xử lý thông tin từ client nếu có
      if (req.body.selectedIndices && req.body.displayedCards) {
        for (let i = 0; i < req.body.selectedIndices.length; i++) {
          const index = req.body.selectedIndices[i];
          const cardInfo = req.body.displayedCards[index];
          const isReversed = cardInfo.isReversed !== undefined ? cardInfo.isReversed : Math.random() < 0.4;

          const interpretation = generateCardInterpretation(
            cardInfo,
            positions[i],
            isReversed,
            positionDescriptions[i],
            domain
          );

          // Lấy nghĩa theo thứ tự ưu tiên giống như trong hàm generateCardInterpretation
          const cardMeaning = isReversed ?
            cardInfo.general_reversed_meaning ||
            cardInfo.reversed_meaning ||
            cardInfo.meaning_reversed ||
            (cardInfo.meaning ? `${cardInfo.meaning} (Khi ngược)` : null) ||
            "Nghĩa ngược chưa được cung cấp"
            :
            cardInfo.general_upright_meaning ||
            cardInfo.upright_meaning ||
            cardInfo.meaning ||
            cardInfo.general_meaning ||
            cardInfo.description ||
            "Nghĩa chưa được cung cấp";

          tempSelectedCards.push({
            id: cardInfo.id,
            name: cardInfo.name,
            position: positions[i],
            position_in_spread: i + 1,
            imageUrl: cardInfo.imageUrl || cardInfo.image_url || '',
            image_url: cardInfo.image_url || cardInfo.imageUrl || '',
            type: cardInfo.type,
            suit: cardInfo.suit,
            number: cardInfo.number,
            isReversed: isReversed,
            meaning: cardMeaning,
            interpretation: interpretation,
            interpretation_source: 'AI'
          });
        }
      }

      // Tạo phần diễn giải tổng hợp tạm thời
      const tempCombinedInterpretation = generateCombinedInterpretation(tempSelectedCards, domain);

      // Tạo kết quả đọc bài tạm thời
      const tempReadingResult = {
        id: temporaryReadingId,
        type: 'standard',
        topic_id: topic_id,
        spread_id: spread_id,
        question: question,
        domain: domain,
        selectedCards: tempSelectedCards,
        createdAt: new Date().toISOString(),
        // Thêm phần diễn giải tổng hợp
        interpretation: {
          sections: tempSelectedCards.map(card => ({
            title: `${card.position}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
            content: card.interpretation
          })),
          combined: tempCombinedInterpretation
        },
        temporary: true,
        message: "Kết quả tạm thời - không lưu vào database do lỗi kết nối"
      };

      console.log('Sending back temporary reading result');
      return res.status(200).json(tempReadingResult);
    }
  } catch (error) {
    console.error('Unexpected error in createReading:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create reading',
      error: error.message
    });
  }
};

/**
 * Tạo nội dung diễn giải cho một lá bài cụ thể
 */
function generateCardInterpretation(card, position, isReversed, positionDescription, domain) {
  // Lấy nghĩa của lá bài dựa vào trạng thái ngược/xuôi với kiểm tra nhiều trường 
  let meaning = '';
  if (isReversed) {
    // Thứ tự ưu tiên cho lá bài ngược
    meaning = card.general_reversed_meaning ||
      card.reversed_meaning ||
      card.meaning_reversed ||
      (card.meaning ? `${card.meaning} (Khi ngược, ý nghĩa này có thể bị đảo ngược hoặc suy yếu)` : null) ||
      "Nghĩa ngược chưa được cung cấp";
  } else {
    // Thứ tự ưu tiên cho lá bài xuôi
    meaning = card.general_upright_meaning ||
      card.upright_meaning ||
      card.meaning ||
      card.general_meaning ||
      card.description ||
      "Nghĩa chưa được cung cấp";
  }

  // Tạo từ khóa ngẫu nhiên phù hợp với vị trí và domain
  const keywords = {
    'Bản thân': ['Cảm xúc', 'Tư duy', 'Thái độ', 'Năng lượng', 'Niềm tin'],
    'Hoàn cảnh': ['Môi trường', 'Tình huống', 'Ảnh hưởng', 'Thách thức', 'Cơ hội'],
    'Thử thách': ['Kết quả', 'Hướng đi', 'Lời khuyên', 'Giải pháp', 'Tiềm năng']
  };

  // Tạo từ khóa theo domain
  const domainKeywords = {
    'love': ['tình cảm', 'mối quan hệ', 'đối tác', 'tình yêu', 'kết nối'],
    'career': ['sự nghiệp', 'công việc', 'mục tiêu', 'phát triển', 'chuyên môn'],
    'finance': ['tài chính', 'tiền bạc', 'đầu tư', 'chi tiêu', 'tài sản'],
    'health': ['sức khỏe', 'thể chất', 'tinh thần', 'năng lượng', 'cân bằng'],
    'spiritual': ['tâm linh', 'kết nối nội tại', 'trực giác', 'nhận thức', 'phát triển bản thân']
  };

  // Chọn ngẫu nhiên từ khóa
  const randomPositionKeyword = keywords[position][Math.floor(Math.random() * keywords[position].length)];
  const randomDomainKeyword = domainKeywords[domain] ? domainKeywords[domain][Math.floor(Math.random() * domainKeywords[domain].length)] : domainKeywords.love[Math.floor(Math.random() * domainKeywords.love.length)];

  // Tạo diễn giải
  let interpretation = `Lá ${card.name} ${isReversed ? '(Ngược)' : ''} ở vị trí ${position} - ${positionDescription}\n\n`;
  interpretation += `${meaning}\n\n`;

  // Thêm diễn giải cụ thể theo vị trí
  if (position === 'Bản thân') {
    interpretation += isReversed
      ? `Lá bài ngược này cho thấy bạn đang gặp khó khăn trong việc thể hiện ${randomDomainKeyword} của mình. Có thể bạn đang cảm thấy thiếu tự tin hoặc không chắc chắn về ${randomPositionKeyword.toLowerCase()} của bản thân trong lĩnh vực này.`
      : `Lá bài này thể hiện ${randomPositionKeyword.toLowerCase()} tích cực mà bạn đang có đối với ${randomDomainKeyword}. Điều này là một lợi thế giúp bạn phát triển và tiến bộ.`;
  } else if (position === 'Hoàn cảnh') {
    interpretation += isReversed
      ? `Hoàn cảnh hiện tại đang tạo ra một số thách thức cho ${randomDomainKeyword} của bạn. Các ${randomPositionKeyword.toLowerCase()} bên ngoài có thể không thuận lợi, nhưng hãy nhìn nhận chúng như cơ hội để trưởng thành.`
      : `Các ${randomPositionKeyword.toLowerCase()} bên ngoài đang ủng hộ cho sự phát triển ${randomDomainKeyword} của bạn. Đây là thời điểm tốt để tận dụng những cơ hội đang đến.`;
  } else {
    interpretation += isReversed
      ? `Để vượt qua thách thức, bạn cần điều chỉnh cách tiếp cận với ${randomDomainKeyword}. Hãy xem xét lại ${randomPositionKeyword.toLowerCase()} của mình và tìm ra hướng đi mới.`
      : `Hướng đi tích cực cho bạn là tập trung vào việc phát triển ${randomDomainKeyword} với ${randomPositionKeyword.toLowerCase()} rõ ràng và kiên định. Điều này sẽ mang lại kết quả tốt đẹp.`;
  }

  return interpretation;
}

/**
 * Tạo nội dung diễn giải tổng hợp cho cả 3 lá bài
 */
function generateCombinedInterpretation(cards, domain) {
  if (!cards || cards.length !== 3) {
    return "Không đủ thông tin để tạo diễn giải tổng hợp.";
  }

  // Kiểm tra xem có lá bài nào bị ngược không
  const hasReversedCards = cards.some(card => card.isReversed);

  // Kiểm tra xem có bao nhiêu lá Major Arcana
  const majorArcanaCount = cards.filter(card => card.type === 'Major Arcana' || card.type === 'Major').length;

  // Tạo lời mở đầu theo domain
  const domainIntros = {
    'love': "Trải bài tình yêu này cho thấy nhiều yếu tố đang ảnh hưởng đến mối quan hệ của bạn.",
    'career': "Trải bài sự nghiệp này tiết lộ những yếu tố quan trọng đang tác động đến con đường công việc của bạn.",
    'finance': "Trải bài tài chính này phản ánh những năng lượng chính đang ảnh hưởng đến tình hình tài chính của bạn.",
    'health': "Trải bài sức khỏe này cho thấy những yếu tố đang tác động đến sức khỏe thể chất và tinh thần của bạn.",
    'spiritual': "Trải bài tâm linh này tiết lộ những năng lượng đang ảnh hưởng đến hành trình tâm linh của bạn."
  };

  // Chọn lời mở đầu phù hợp với domain
  const intro = domainIntros[domain] || domainIntros.love;

  // Tạo phần giữa của diễn giải
  let middlePart = "";
  if (majorArcanaCount >= 2) {
    middlePart += "Sự xuất hiện nhiều lá bài Major Arcana cho thấy đây là thời điểm quan trọng trong cuộc đời bạn. Những biến cố lớn đang diễn ra và có thể dẫn đến những thay đổi đáng kể trong tương lai. ";
  } else {
    middlePart += "Các lá bài Minor Arcana chiếm đa số trong trải bài này, cho thấy bạn đang đối mặt với những vấn đề hàng ngày trong cuộc sống. Tuy không phải những biến cố lớn, nhưng việc giải quyết tốt những thử thách này sẽ giúp bạn tạo nền tảng vững chắc cho tương lai. ";
  }

  if (hasReversedCards) {
    middlePart += "Sự xuất hiện của các lá bài ngược cho thấy có một số trở ngại và thách thức cần vượt qua. Đây là dấu hiệu rằng bạn cần nhìn nhận sâu hơn vào các vấn đề hoặc điều chỉnh cách tiếp cận của mình. ";
  } else {
    middlePart += "Tất cả các lá bài đều xuôi, thể hiện một dòng năng lượng tích cực đang chảy trong cuộc sống của bạn. Đây là thời điểm thuận lợi để tiến lên phía trước với các kế hoạch của bạn. ";
  }

  // Tạo sự kết nối giữa các lá bài
  const connectionPart = `Lá bài ở vị trí Bản thân (${cards[0].name}${cards[0].isReversed ? ' Ngược' : ''}) kết hợp với lá bài ở vị trí Hoàn cảnh (${cards[1].name}${cards[1].isReversed ? ' Ngược' : ''}) cho thấy ${hasReversedCards ? 'có sự căng thẳng' : 'có sự hài hòa'} giữa năng lượng bên trong và các yếu tố bên ngoài. Lá bài ở vị trí Thử thách (${cards[2].name}${cards[2].isReversed ? ' Ngược' : ''}) gợi ý rằng ${cards[2].isReversed ? 'bạn cần vượt qua một số khó khăn nội tại' : 'bạn có khả năng vượt qua thử thách một cách thuận lợi'} để đạt được kết quả mong muốn.`;

  // Tạo lời kết thúc
  const conclusion = "Hãy nhớ rằng Tarot chỉ đưa ra những gợi ý, còn quyết định cuối cùng luôn nằm trong tay bạn. Sử dụng những thông tin này như một công cụ hỗ trợ để đưa ra những quyết định sáng suốt cho cuộc sống của mình.";

  // Kết hợp tất cả lại
  return `${intro}\n\n${middlePart}\n\n${connectionPart}\n\n${conclusion}`;
}

// Lấy danh sách đọc bài của người dùng
exports.getUserReadings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0, type, domain } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const where = { user_id: userId };
    if (type) where.type = type;
    if (domain) where.domain = domain;

    // Đếm tổng số kết quả
    const total = await TarotReading.count({ where });

    // Check associations for debugging
    console.error('DEBUG: TarotReading associations:', Object.keys(db.tarotReadings.associations));
    console.error('DEBUG: db.tarotReadingCards defined:', !!db.tarotReadingCards);

    // Lấy kết quả với phân trang
    console.error('CRITICAL: Executing getUserReadings with direct DB access'); // LOUD LOG
    const readings = await db.tarotReadings.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [{
        model: db.tarotReadingCards,
        as: 'cards',
        include: [{
          model: db.tarotCards,
          as: 'card'
        }]
      }]
    });

    // Định dạng kết quả trả về
    const formattedReadings = readings.map(reading => {
      const formattedCards = reading.cards ? reading.cards.map(rc => {
        if (!rc.card) return null;
        return {
          id: rc.card.id,
          name: rc.card.name,
          position: rc.position_in_spread,
          isReversed: rc.is_reversed,
          imageUrl: rc.card.image_url || rc.card.imageUrl
        };
      }).filter(Boolean) : [];

      return {
        id: reading.id,
        type: reading.type,
        question: reading.question,
        domain: reading.domain,
        created_at: reading.created_at,
        summary: reading.summary,
        combined_interpretation: reading.combined_interpretation,
        conclusion: reading.conclusion,
        interpretation_source: reading.interpretation_source,
        cards: formattedCards
      };
    });

    res.status(200).json({
      status: 'success',
      count: readings.length,
      total,
      data: {
        readings: formattedReadings
      }
    });
  } catch (error) {
    console.error('Error in getUserReadings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch readings',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Lấy chi tiết một lần đọc bài
exports.getReadingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Lấy thông tin reading
    const reading = await TarotReading.findOne({
      where: {
        id,
        user_id: userId
      },
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
          model: TarotReadingCard,
          as: 'cards',
          include: [{
            model: TarotCard,
            as: 'card'
          }]
        }
      ]
    });

    if (!reading) {
      return res.status(404).json({
        status: 'error',
        message: 'Reading not found or does not belong to you'
      });
    }

    // Định dạng kết quả trả về
    const formattedCards = reading.cards ? reading.cards.map(rc => {
      if (!rc.card) return null;
      return {
        id: rc.card.id,
        name: rc.card.name,
        type: rc.card.type,
        suit: rc.card.suit,
        number: rc.card.number,
        position: rc.position_in_spread,
        isReversed: rc.is_reversed,
        image_url: rc.card.image_url || rc.card.imageUrl, // Normalize key for FE
        imageUrl: rc.card.image_url || rc.card.imageUrl, // Keep legacy key
        meaning: rc.is_reversed ? rc.card.general_reversed_meaning : rc.card.general_upright_meaning, // Correct model fields
        interpretation: rc.interpretation || (rc.is_reversed ? rc.card.general_reversed_meaning : rc.card.general_upright_meaning)
      };
    }).filter(Boolean) : [];

    // Tạo interpretation từ tất cả các lá bài
    let interpretation = "";
    for (const card of formattedCards) {
      interpretation += `Card ${card.position}: ${card.name} ${card.isReversed ? '(Reversed)' : ''}\n`;
      interpretation += card.interpretation + '\n\n';
    }

    const result = {
      id: reading.id,
      type: reading.type,
      question: reading.question,
      domain: reading.domain,
      topic: reading.tarot_topic ? reading.tarot_topic.name : 'Tổng quan',
      spread: reading.tarot_spread ? reading.tarot_spread.name : 'Trải bài Tarot',
      created_at: reading.created_at,
      cards: formattedCards,
      interpretation: interpretation,
      summary: reading.summary,
      combined_interpretation: reading.combined_interpretation,
      conclusion: reading.conclusion,
      interpretation_source: reading.interpretation_source
    };

    res.status(200).json({
      status: 'success',
      data: {
        reading: result
      }
    });
  } catch (error) {
    next(error);
  }
};

// Tạo kết quả bói bài với AI
exports.createAIReading = async (req, res, next) => {
  try {
    console.log('Request body for createAIReading:', JSON.stringify(req.body, null, 2));
    console.log('Authentication info:', {
      hasUser: !!req.user,
      userId: req.user ? req.user.id : null,
      headers: req.headers
    });

    // Hỗ trợ cả hai format parameter
    const {
      // Format snake_case
      topic_id, spread_id, selected_cards,
      // Format camelCase
      topicId, spreadId, selectedCards,
      // Format cũ (API cũ)
      selectedIndices, displayedCards,
      // Các trường khác
      question, domain
    } = req.body;

    // Lấy user_id từ request nếu người dùng đã đăng nhập
    const userId = req.user ? req.user.id : null;
    console.log('User ID from token:', userId);

    // Kiểm tra và tạo finalSelectedCards từ các format khác nhau
    // ƯU TIÊN selectedCards (full objects) trước selected_cards (chỉ IDs) để fallback có đủ thông tin
    let finalSelectedCards;
    if (selectedCards && Array.isArray(selectedCards) && selectedCards.length > 0) {
      // selectedCards contains FULL card objects with name, imageUrl, meaning, etc.
      finalSelectedCards = selectedCards;
      console.log('Using full card objects from selectedCards:', finalSelectedCards.length);
    } else if (selected_cards && Array.isArray(selected_cards)) {
      // selected_cards contains only {id, isReversed} - less preferred
      finalSelectedCards = selected_cards;
      console.log('Using card IDs from selected_cards:', finalSelectedCards.length);
    } else if (selectedIndices && displayedCards && Array.isArray(selectedIndices) && Array.isArray(displayedCards)) {
      // Chuyển đổi từ format cũ sang format mới
      finalSelectedCards = selectedIndices.map(index => displayedCards[index]);
      console.log('Using legacy format selectedIndices + displayedCards');
    } else {
      finalSelectedCards = [];
    }

    // Sử dụng tham số từ định dạng nào có sẵn
    const finalTopicId = topic_id || topicId;
    const finalSpreadId = spread_id || spreadId;

    // Validate required fields
    if (!finalSelectedCards || !Array.isArray(finalSelectedCards) || finalSelectedCards.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Selected cards are required'
      });
    }

    if (!question) {
      return res.status(400).json({
        status: 'error',
        message: 'Question is required for AI reading'
      });
    }

    // Xác định topic_id từ domain nếu cần
    let effectiveTopicId = finalTopicId;
    if (!effectiveTopicId && domain) {
      const topicMap = {
        'love': 1,
        'career': 2,
        'finance': 3,
        'health': 4,
        'spiritual': 5
      };
      effectiveTopicId = topicMap[domain] || 1;
    }

    console.log('Processing AI reading with:', {
      finalSelectedCards: finalSelectedCards.length,
      effectiveTopicId,
      finalSpreadId,
      question
    });

    // Gọi dịch vụ AI để tạo diễn giải
    let responseData;

    try {
      // Chuẩn bị dữ liệu cho dịch vụ AI
      const cardsForAI = await Promise.all(
        finalSelectedCards.map(async (cardItem, index) => {
          // Hỗ trợ cả ID dạng số và dạng đối tượng
          const actualCardId = typeof cardItem === 'object' ? cardItem.id : cardItem;

          console.log(`Processing card ${index + 1}:`, actualCardId);

          // Lấy thông tin chi tiết về lá bài
          const cardDetails = await TarotCard.findByPk(actualCardId);
          if (!cardDetails) {
            throw new Error(`Card with ID ${actualCardId} not found`);
          }

          return {
            id: cardDetails.id,
            name: cardDetails.name,
            position: index + 1,
            positionName: index + 1,
            isReversed: typeof cardItem === 'object' ? cardItem.isReversed : false,
            meaning: cardDetails.general_upright_meaning || cardDetails.description,
            reversedMeaning: cardDetails.general_reversed_meaning || cardDetails.description
          };
        })
      );

      // Tạo bản ghi TarotReading
      console.log('Creating new AI reading with user_id:', userId);
      const newReading = await TarotReading.create({
        user_id: userId, // Lấy user_id từ token xác thực
        topic_id: effectiveTopicId || 1,  // Mặc định là topic 1 (love) nếu không có
        spread_id: finalSpreadId || 1,    // Mặc định là spread 1 (three-card) nếu không có
        type: 'ai',
        question: question,
        domain: domain || 'general',
        created_at: new Date()
      });

      console.log('Created new AI reading with ID:', newReading.id, 'user_id:', newReading.user_id);

      // Lưu thông tin các lá bài được chọn
      await Promise.all(
        cardsForAI.map(async (card) => {
          const cardId = typeof card.id === 'object' ? (card.id.id || card.id.toString()) : card.id;
          await TarotReadingCard.create({
            reading_id: newReading.id,
            card_id: cardId,
            position_in_spread: card.position,
            is_reversed: card.isReversed,
            interpretation_source: 'AI'
          });
        })
      );

      // Tạo diễn giải AI
      const aiResponse = await generateAIInterpretation(cardsForAI, question, domain);

      // Cập nhật diễn giải vào các lá bài
      for (const cardInterpretation of aiResponse.cards || []) {
        await TarotReadingCard.update(
          {
            interpretation: cardInterpretation.interpretation,
            interpretation_source: 'AI'
          },
          {
            where: {
              reading_id: newReading.id,
              position_in_spread: cardInterpretation.position
            }
          }
        );
      }

      // Cập nhật diễn giải tổng quan vào bản ghi TarotReading
      await newReading.update({
        summary: aiResponse.summary || '',
        combined_interpretation: aiResponse.combined || '',
        conclusion: aiResponse.conclusion || '',
        interpretation_source: 'AI'
      });

      // Định dạng dữ liệu phản hồi
      // Trước tiên tìm và chuẩn bị tất cả thông tin card
      const enhancedCards = [];
      for (let i = 0; i < cardsForAI.length; i++) {
        const card = cardsForAI[i];
        const cardData = {
          ...card,
          interpretation: aiResponse.cards && aiResponse.cards[i] ?
            aiResponse.cards[i].interpretation : 'Không có diễn giải'
        };

        // Thêm thông tin image_url nếu cần
        if (!card.image_url && !card.imageUrl) {
          try {
            const cardDetails = await TarotCard.findByPk(card.id);
            if (cardDetails) {
              cardData.image_url = cardDetails.image_url;
              cardData.imageUrl = cardDetails.image_url;
            }
          } catch (err) {
            console.error(`Error getting image URL for card ${card.id}:`, err);
          }
        } else {
          // Đảm bảo có cả hai trường
          cardData.image_url = card.image_url || card.imageUrl;
          cardData.imageUrl = card.imageUrl || card.image_url;
        }

        enhancedCards.push(cardData);
      }

      responseData = {
        id: newReading.id,
        question: question,
        domain: domain || 'general',
        type: 'ai',
        selectedCards: enhancedCards,
        overall: aiResponse.overall || aiResponse.combined,
        advice: aiResponse.advice || aiResponse.conclusion,
        summary: aiResponse.summary,
        createdAt: newReading.created_at
      };
    } catch (aiError) {
      console.error('AI Interpretation error:', aiError);
      console.error('AI Error details:', aiError.message, aiError.stack);

      // Tạo diễn giải đơn giản nếu AI thất bại - include error for debugging
      const fallbackResult = createTemporaryAIReading(
        finalSelectedCards,
        effectiveTopicId,
        finalSpreadId || 1,
        question,
        domain,
        aiError.message // Pass error message
      );

      // Add error info to help debugging
      fallbackResult.aiError = aiError.message || 'Unknown AI error';
      responseData = fallbackResult;
    }

    // Trả về kết quả
    return res.status(201).json({
      status: 'success',
      data: responseData
    });
  } catch (error) {
    console.error('Error in createAIReading:', error);
    // Try to return temporary result even on main error
    const fallbackCards = (req.body.selectedCards || req.body.selected_cards || []);
    const fallbackData = createTemporaryAIReading(
      fallbackCards.length ? fallbackCards : [],
      req.body.topic_id || 1,
      req.body.spread_id || 1,
      req.body.question || '',
      req.body.domain || 'general'
    );

    return res.status(200).json({ // Return 200 with temporary result
      status: 'success',
      data: fallbackData
    });
  }
};

/**
 * Tạo kết quả đọc bài tạm thời khi không thể kết nối đến database
 */
function createTemporaryAIReading(selectedCards, topic_id, spread_id, question, domain, errorMsg = null) {
  const temporaryReadingId = Date.now();

  // Tạo kết quả tạm thời
  const tempSelectedCards = [];

  // Xử lý thông tin từ cards
  if (selectedCards && Array.isArray(selectedCards)) {
    for (let i = 0; i < selectedCards.length; i++) {
      // Handle both card object and card info object structure
      const cardInput = selectedCards[i];
      // If cardInput has property 'card' or similar, or just flat properties?
      // Based on previous code, input seems to be the card object itself or ID

      // Normalize card info
      let cardInfo = cardInput;
      // Check if we need to look up details (mock logic or use passed info)
      // If it sends full card objects, use them.

      const positions = ['Bản thân', 'Hoàn cảnh', 'Thử thách'];
      const positionDescriptions = [
        'Đại diện cho bạn trong tình huống hiện tại.',
        'Thể hiện hoàn cảnh xung quanh bạn.',
        'Biểu thị kết quả tiềm năng hoặc lời khuyên.'
      ];

      const isReversed = cardInfo.isReversed !== undefined ? cardInfo.isReversed : Math.random() < 0.4;

      const interpretation = generateCardInterpretation(
        cardInfo,
        positions[i],
        isReversed,
        positionDescriptions[i],
        domain
      );

      tempSelectedCards.push({
        id: cardInfo.id || i, // Fallback ID
        name: cardInfo.name || 'Card ' + (i + 1),
        position: positions[i],
        position_in_spread: i + 1,
        imageUrl: cardInfo.imageUrl || cardInfo.image_url || '',
        image_url: cardInfo.image_url || cardInfo.imageUrl || '',
        type: cardInfo.type,
        suit: cardInfo.suit,
        number: cardInfo.number,
        isReversed: isReversed,
        meaning: cardInfo.meaning || "Nghĩa chưa xác định",
        interpretation: interpretation,
        interpretation_source: 'AI'
      });
    }
  }

  // Tạo AI interpretation mẫu - HIỂN THỊ LỖI CỤ THỂ ĐỂ DEBUG
  const domainText = domain || 'general';

  const aiInterpretation = {
    summary: `Diễn giải AI cho câu hỏi: "${question}"`,
    // Show the actual error in the main text area so user can see it
    combined: errorMsg ?
      `Hệ thống gặp lỗi khi kết nối với AI: ${errorMsg}. Vui lòng kiểm tra API Key (.env) hoặc kết nối mạng.` :
      `Dựa trên bộ ba lá bài này và câu hỏi của bạn về ${domainText}, đây là một phân tích tổng hợp về tình huống của bạn...`,
    sections: tempSelectedCards.map(card => ({
      title: `${card.position}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
      sections: [], // Fix structure to match expected format if needed, or keep simple
      content: card.interpretation
    })),
    conclusion: "Kết luận dựa trên các lá bài và câu hỏi của bạn..."
  };

  // Tạo kết quả đọc bài tạm thời
  return {
    id: temporaryReadingId,
    type: 'ai',
    topic_id: topic_id,
    spread_id: spread_id,
    question: question,
    domain: domain,
    selectedCards: tempSelectedCards,
    createdAt: new Date().toISOString(),
    interpretation: aiInterpretation,
    temporary: true,
    message: "Kết quả tạm thời - không lưu vào database do lỗi kết nối"
  };
}

/**
 * Tạo nội dung diễn giải AI cho cả 3 lá bài và câu hỏi
 */
async function generateAIInterpretation(cards, question, domain) {
  try {
    // Chuẩn bị dữ liệu để gửi đến AI Service
    const cardsInfo = cards.map((card, index) => {
      const positions = ['Bản thân', 'Hoàn cảnh', 'Thử thách'];
      return {
        name: card.name,
        position: index + 1,
        positionName: positions[index] || `Vị trí ${index + 1}`,
        isReversed: card.isReversed,
        meaning: card.isReversed ? (card.reversedMeaning || card.meaning) : card.meaning
      };
    });

    // Tạo prompt từ thông tin bài tarot và câu hỏi
    const domainText = {
      'love': 'tình yêu',
      'career': 'sự nghiệp',
      'finance': 'tài chính',
      'health': 'sức khỏe',
      'spiritual': 'tâm linh',
      'general': 'tổng quát'
    }[domain] || 'tổng quát';

    const prompt = `
      Bạn là một chuyên gia về Tarot. Nhiệm vụ của bạn là trả về kết quả phân tích dưới dạng JSON thuần túy, KHÔNG được viết thêm bất kỳ lời dẫn hay văn bản nào bên ngoài JSON.
      
      Hãy phân tích kết quả trải bài Tarot dưới đây và đưa ra diễn giải chi tiết.
      
      THÔNG TIN TRẢI BÀI:
      - Chủ đề: ${domainText}
      - Câu hỏi: ${question || 'Không có câu hỏi cụ thể'}
      
      CÁC LÁ BÀI:
      ${cardsInfo.map(card => `
        Vị trí ${card.position} (${card.positionName}):
        - Lá bài: ${card.name} ${card.isReversed ? '(Ngược)' : '(Xuôi)'}
        - Ý nghĩa: ${card.meaning}
      `).join('\n')}
      
      YÊU CẦU:
      1. Phân tích ý nghĩa của từng lá bài trong vị trí của nó (quan trọng)
      2. Phân tích mối quan hệ giữa các lá bài (tương sinh, tương khắc, bổ trợ)
      3. Đưa ra diễn giải tổng thể về tình huống dựa trên sự kết hợp bài
      4. Đề xuất lời khuyên cụ thể hoặc hướng đi tiếp theo
      5. Đưa ra kết luận tóm tắt ngắn gọn

      Định dạng kết quả dưới dạng JSON với cấu trúc sau:
      {
        "cards": [
          {
            "position": 1,
            "name": "Tên lá bài 1",
            "interpretation": "Phân tích chi tiết ý nghĩa của lá bài tại vị trí này"
          },
          {
            "position": 2,
            "name": "Tên lá bài 2",
            "interpretation": "Phân tích chi tiết ý nghĩa của lá bài tại vị trí này" 
          },
          {
            "position": 3,
            "name": "Tên lá bài 3",
            "interpretation": "Phân tích chi tiết ý nghĩa của lá bài tại vị trí này"
          }
        ],
        "summary": "Tóm tắt ngắn gọn về trải bài (1-2 câu)",
        "combined": "Phân tích chuyên sâu về sự kết hợp giữa các lá bài và câu chuyện tổng thể",
        "conclusion": "Lời khuyên cốt lõi và định hướng hành động"
      }
    `;

    console.log('Sending AI prompt for interpretation');

    // Gọi AI service để tạo diễn giải (nếu có)
    let aiResponse;
    try {
      const aiResponseText = await generateAIResponse(prompt);
      console.log('AI response received, parsing...');
      console.log('Raw AI response:', aiResponseText.substring(0, 200) + '...');

      // Phân tích kết quả JSON từ AI
      try {
        // Step 1: Remove markdown code blocks if present
        let cleanedText = aiResponseText.trim();

        // Remove ```json and ``` markers
        cleanedText = cleanedText.replace(/^```json\s*/i, '');
        cleanedText = cleanedText.replace(/^```\s*/i, '');
        cleanedText = cleanedText.replace(/\s*```$/i, '');

        // Step 2: Extract JSON object
        // Find the first occurrence of "{" and take everything from there to the end
        const firstBraceIndex = cleanedText.indexOf('{');
        let jsonString = firstBraceIndex !== -1 ? cleanedText.substring(firstBraceIndex) : cleanedText;

        // Remove markdown block end if present at the end of string
        jsonString = jsonString.replace(/\s*```$/i, '');

        // Step 3: Try to fix common JSON issues
        // Remove trailing commas before closing brackets/braces
        jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');

        // Step 4: Repair truncated JSON (Simple heuristic)
        // If the string doesn't end with "}", try to close it
        if (!jsonString.trim().endsWith('}')) {
          console.log('Detected truncated JSON, attempting to repair...');
          const lastChar = jsonString.trim().slice(-1);

          // Close string if open
          if (lastChar !== '"' && lastChar !== '}' && lastChar !== ']') {
            jsonString += '"';
          }

          // Close array/object hierarchy (simplified)
          // Count open/close braces
          const openBraces = (jsonString.match(/\{/g) || []).length;
          const closeBraces = (jsonString.match(/\}/g) || []).length;
          const openBrackets = (jsonString.match(/\[/g) || []).length;
          const closeBrackets = (jsonString.match(/\]/g) || []).length;

          for (let i = 0; i < (openBrackets - closeBrackets); i++) jsonString += ']';
          for (let i = 0; i < (openBraces - closeBraces); i++) jsonString += '}';

          console.log('Repaired JSON candidates:', jsonString.slice(-50));
        }

        aiResponse = JSON.parse(jsonString);
        console.log('Successfully parsed AI response as JSON');
      } catch (parseError) {
        console.error('Error parsing AI response as JSON:', parseError);
        console.error('Failed text snippet:', aiResponseText.substring(0, 500));

        // Fallback: Use the raw text as combined interpretation
        aiResponse = {
          summary: `Diễn giải AI cho câu hỏi: "${question}"`,
          combined: "Hệ thống không thể phân tích tổng hợp từ AI do lỗi định dạng. Vui lòng xem ý nghĩa chi tiết từng lá bài bên dưới.",
          cards: cards.map((card, index) => {
            // Use database meaning if available
            let originalMeaning = card.isReversed ? (card.reversedMeaning || card.meaning) : card.meaning;
            // Clean up repetitive prefix if present in DB text
            if (originalMeaning) {
              originalMeaning = originalMeaning.replace(/^Ý nghĩa chung của .*? là /i, '');
              originalMeaning = originalMeaning.charAt(0).toUpperCase() + originalMeaning.slice(1);
            }

            return {
              position: index + 1,
              name: card.name,
              interpretation: originalMeaning || `Xem phần tổng hợp để hiểu ý nghĩa của lá bài ${card.name}.`
            };
          }),
          conclusion: "Vui lòng xem ý nghĩa chi tiết từng lá bài."
        };
      }
    } catch (error) {
      console.error('Error generating AI interpretation:', error);
      // Fallback nếu AI service gặp lỗi
      aiResponse = {
        summary: `Diễn giải cho câu hỏi: "${question}"`,
        combined: `Không thể tạo diễn giải từ AI: ${error.message || 'Lỗi kết nối'}. Vui lòng thử lại sau.`,
        cards: cards.map((card, index) => {
          // Use database meaning if available
          let originalMeaning = card.isReversed ? (card.reversedMeaning || card.meaning) : card.meaning;
          // Clean up repetitive prefix if present in DB text
          if (originalMeaning) {
            originalMeaning = originalMeaning.replace(/^Ý nghĩa chung của .*? là /i, '');
            originalMeaning = originalMeaning.charAt(0).toUpperCase() + originalMeaning.slice(1);
          }

          return {
            position: index + 1,
            name: card.name,
            interpretation: originalMeaning || `Phân tích cho lá bài ${card.name} ở vị trí ${index + 1}...`
          };
        }),
        conclusion: "Kết luận dựa trên các lá bài và câu hỏi của bạn..."
      };
    }

    // Đảm bảo cards được định dạng đúng
    const formattedCards = cards.map((card, index) => {
      // Tìm diễn giải tương ứng trong AI response
      const aiCard = aiResponse.cards && Array.isArray(aiResponse.cards)
        ? aiResponse.cards.find(c => c.position === index + 1 || c.position === card.position)
        : null;

      return {
        position: index + 1,
        name: card.name,
        interpretation: aiCard ? aiCard.interpretation : `Phân tích cho lá bài ${card.name}...`
      };
    });

    return {
      cards: formattedCards,
      summary: aiResponse.summary || "Tóm tắt diễn giải của bạn",
      combined: aiResponse.combined || aiResponse.overall || "Phân tích tổng hợp các lá bài",
      conclusion: aiResponse.conclusion || aiResponse.advice || "Lời khuyên dựa trên các lá bài"
    };
  } catch (error) {
    console.error('Error in generateAIInterpretation:', error);
    // Trả về interpretation mặc định nếu có lỗi
    return {
      cards: cards.map((card, index) => {
        return {
          position: index + 1,
          name: card.name,
          interpretation: card.meaning || "Không có diễn giải"
        };
      }),
      combined: "Không thể tạo diễn giải AI do lỗi hệ thống. Vui lòng thử lại sau.",
      summary: "Không thể tạo tóm tắt do lỗi hệ thống",
      conclusion: "Không thể tạo kết luận do lỗi hệ thống"
    };
  }
}

// Lưu kết quả bói bài
exports.saveReading = async (req, res, next) => {
  try {
    console.log('Saving reading with data:', JSON.stringify(req.body, null, 2));
    console.log('User ID from token:', req.user ? req.user.id : null);

    // Nếu không có user, trả về lỗi
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'User authentication required to save reading'
      });
    }

    // Lấy thông tin từ request body
    const { id, type, domain, question, selectedCards } = req.body;

    // Nếu reading đã có ID, kiểm tra xem đã tồn tại chưa
    let existingReading = null;
    if (id) {
      existingReading = await TarotReading.findOne({
        where: { id: id }
      });
    }

    let reading;

    if (existingReading) {
      // Nếu đã tồn tại, cập nhật reading
      await existingReading.update({
        user_id: req.user.id,  // Đảm bảo cập nhật user_id
        type: type || existingReading.type,
        domain: domain || existingReading.domain,
        question: question || existingReading.question,
        summary: req.body.summary || existingReading.summary,
        combined_interpretation: req.body.combined_interpretation || existingReading.combined_interpretation,
        conclusion: req.body.conclusion || existingReading.conclusion,
        interpretation_source: req.body.interpretation_source || existingReading.interpretation_source
      });
      reading = existingReading;
    } else {
      // Nếu chưa tồn tại, tạo reading mới
      reading = await TarotReading.create({
        user_id: req.user.id,
        type: type || 'standard',
        domain: domain || 'general',
        question: question || '',
        summary: req.body.summary,
        combined_interpretation: req.body.combined_interpretation,
        conclusion: req.body.conclusion,
        interpretation_source: req.body.interpretation_source || 'Normal',
        created_at: new Date()
      });
    }

    // Lưu các lá bài được chọn
    if (selectedCards && Array.isArray(selectedCards)) {
      // Nếu là reading đã tồn tại, xóa các card cũ
      if (existingReading) {
        await TarotReadingCard.destroy({
          where: { reading_id: reading.id }
        });
      }

      // Lưu các card mới
      await Promise.all(
        selectedCards.map(async (card, index) => {
          const cardId = typeof card.id === 'object' ? (card.id.id || card.id.toString()) : card.id;
          await TarotReadingCard.create({
            reading_id: reading.id,
            card_id: cardId,
            position_in_spread: card.position_in_spread || index + 1,
            is_reversed: card.isReversed || false,
            interpretation: card.interpretation || '',
            interpretation_source: 'Save'
          });
        })
      );
    }

    // Trả về kết quả
    res.status(200).json({
      status: 'success',
      message: 'Reading saved successfully',
      data: {
        id: reading.id,
        type: reading.type,
        domain: reading.domain,
        question: reading.question,
        created_at: reading.created_at,
        user_id: reading.user_id
      }
    });
  } catch (error) {
    console.error('Error saving reading:', error);
    next(error);
  }
}; 