import apiClient from '../../../shared/utils/api/apiClient';
import tarotCardsData from '../../../assets/data/tarot_cards_data.json';

// Chuyển đổi dữ liệu từ file JSON sang định dạng phù hợp với ứng dụng
const TAROT_CARDS = tarotCardsData.map(card => ({
  id: card.id,
  name: card.name,
  imageUrl: card.image_url,
  type: card.arcana === 'Major' ? 'Major Arcana' : `${card.suit}`,
  meaning: card.general_upright_meaning,
  reversed_meaning: card.general_reversed_meaning,
  description: card.description,
  story: card.story,
  keywords: card.keywords || []
}));

// Simulated delay for mock responses
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lấy 12 lá bài ngẫu nhiên từ 78 lá để người dùng chọn
 * 
 * @returns {Array} - Mảng 12 lá bài ngẫu nhiên
 */
const getRandomTwelveCards = () => {
  // Kiểm tra xem có đủ thẻ bài để chọn không
  if (!TAROT_CARDS || TAROT_CARDS.length === 0) {
    return [];
  }
  
  try {
    // Sao chép và trộn tất cả bài
    const shuffledCards = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    
    // Lấy 12 lá đầu tiên sau khi trộn và thêm thuộc tính isReversed với tỉ lệ 40%
    return shuffledCards.slice(0, 12).map(card => ({
      ...card,
      isReversed: Math.random() < 0.4 // 40% xác suất lá bài sẽ ngược
    }));
  } catch (error) {
    // Fallback: Trả về 12 lá bài đầu tiên nếu có lỗi xảy ra
    return TAROT_CARDS.slice(0, 12).map(card => ({
      ...card,
      isReversed: Math.random() < 0.4 // 40% xác suất lá bài sẽ ngược
    }));
  }
};
  
/**
 * Chuẩn bị 3 lá bài đã chọn với vị trí và trạng thái ngược/xuôi
 * 
 * @param {Array} selectedIndices - Mảng chỉ số của 3 lá bài được chọn (0-11)
 * @param {Array} displayedCards - 12 lá bài đang hiển thị
 * @returns {Array} - Mảng 3 lá bài đã được xử lý với thông tin vị trí và ngược/xuôi
 */
const prepareSelectedCards = (selectedIndices, displayedCards) => {
  if (!selectedIndices || !Array.isArray(selectedIndices) || selectedIndices.length !== 3) {
    return [];
  }
  
  if (!displayedCards || !Array.isArray(displayedCards) || displayedCards.length < 12) {
    return [];
  }
  
  // Vị trí cố định cho 3 lá bài
  const positions = [
    'Bản thân', // Vị trí 1
    'Hoàn cảnh', // Vị trí 2
    'Thử thách'  // Vị trí 3
  ];
  
  // Lấy 3 lá bài theo chỉ số được chọn
  const selectedCards = selectedIndices.map((index, arrayIndex) => {
    // Xác định xác suất 40% lá bài sẽ ngược
    const isReversed = Math.random() < 0.4;
    
    // Lấy thông tin lá bài
    const card = displayedCards[index];
    
    // Database field mapping (dựa vào cấu trúc database thật)
    // Bảng tarot_cards có: general_upright_meaning, general_reversed_meaning
    // Bảng tarot_card_meanings có: upright_meaning, reversed_meaning
    
    // Lấy ý nghĩa lá bài từ các thuộc tính khác nhau theo thứ tự ưu tiên
    let meaning = 'Nghĩa chưa được cung cấp';
    if (isReversed) {
      // Nếu bài ngược, thử lấy ý nghĩa ngược từ các trường khác nhau
      meaning = card.reversed_meaning || 
                card.general_reversed_meaning || 
                card.meaning_reversed ||
                'Ý nghĩa khi ngược: Chưa có thông tin chi tiết.';
    } else {
      // Nếu bài xuôi, thử lấy ý nghĩa xuôi từ các trường khác nhau
      meaning = card.meaning || 
                card.general_upright_meaning || 
                card.upright_meaning ||
                'Ý nghĩa khi xuôi: Chưa có thông tin chi tiết.';
    }

    // Chuẩn bị đầy đủ dữ liệu cho lá bài
    const preparedCard = {
      ...card,
      position: positions[arrayIndex],
      position_in_spread: arrayIndex + 1,
      isReversed,
      // Đảm bảo luôn có ý nghĩa hợp lệ cho lá bài
      meaning: meaning
    };
    
    // Ghi log để debug
    console.log('Card data prepared for', card.name, ':', {
      id: card.id,
      name: card.name,
      position: positions[arrayIndex],
      position_in_spread: arrayIndex + 1,
      imageUrl: card.imageUrl || card.image_url,
      image_url: card.imageUrl || card.image_url,
      type: card.type,
      suit: card.suit,
      number: card.number,
      isReversed,
      meaning,
      interpretation: `Lá ${card.name}${isReversed ? ' (Ngược)' : ''} ở vị trí ${positions[arrayIndex]} - ${meaning}`
    });
    
    return preparedCard;
  });
  
  console.log('Sending back reading result with interpretation');
  return selectedCards;
};

// Toggle to use mock data when real API is not available
// ĐẶT BIẾN NÀY THÀNH FALSE ĐỂ SỬ DỤNG API THỰC TẾ THAY VÌ MOCK DATA
const USE_MOCK_API = false;

// Lưu cài đặt USE_MOCK_API vào localStorage để các module khác có thể truy cập
localStorage.setItem('USE_MOCK_API', USE_MOCK_API.toString());

// Get all cards
export const getAllCards = async () => {
  try {
    if (USE_MOCK_API) {
      await mockDelay();
      return TAROT_CARDS;
    }
    
    const response = await apiClient.get('/cards');
    // Đảm bảo xử lý dữ liệu từ server
    if (response && response.data && response.data.cards) {
      response.data.cards = processCardMeanings(response.data.cards);
    }
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      return TAROT_CARDS;
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Hàm xử lý ý nghĩa lá bài từ server
// Đảm bảo các trường meaning được chính xác
function processCardMeanings(cards) {
  return cards.map(card => {
    // Xử lý trường meaning
    let meaning = card.meaning;
    if (!meaning || meaning.includes('chưa được cung cấp')) {
      meaning = card.general_upright_meaning || card.upright_meaning || card.description;
    }
    
    // Xử lý reversed_meaning
    let reversedMeaning = card.reversed_meaning;
    if (!reversedMeaning || reversedMeaning.includes('chưa được cung cấp')) {
      reversedMeaning = card.general_reversed_meaning || card.meaning_reversed;
    }
    
    return {
      ...card,
      meaning: meaning || 'Đang cập nhật ý nghĩa...',
      reversed_meaning: reversedMeaning || 'Đang cập nhật ý nghĩa ngược...'
    };
  });
}

// Get card by id
export const getCardById = async (cardId) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay();
      const card = TAROT_CARDS.find(c => c.id === Number(cardId));
      if (!card) throw { message: 'Card not found' };
      return card;
    }
    
    const response = await apiClient.get(`/cards/${cardId}`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API && TAROT_CARDS.some(c => c.id === Number(cardId))) {
      return TAROT_CARDS.find(c => c.id === Number(cardId));
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Get daily tarot card
export const getDailyTarot = async () => {
  try {
    if (USE_MOCK_API) {
      await mockDelay();
      // Get a random card for daily reading
      const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
      return {
        ...TAROT_CARDS[randomIndex],
        date: new Date().toISOString(),
        isReversed: Math.random() < 0.4
      };
    }
    
    const response = await apiClient.get('/tarot/daily');
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
      return {
        ...TAROT_CARDS[randomIndex],
        date: new Date().toISOString(),
        isReversed: Math.random() < 0.4
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Lấy 12 lá bài ngẫu nhiên để trải lên bàn
export const getTwelveRandomCards = async () => {
  try {
    if (USE_MOCK_API) {
      await mockDelay();
      const randomCards = getRandomTwelveCards();
      
      if (randomCards.length === 0) {
        // Fallback: sử dụng các lá bài cứng nếu không lấy được ngẫu nhiên
        return Promise.resolve(TAROT_CARDS.slice(0, 12));
      }
      
      return Promise.resolve(randomCards);
    }
    
    const response = await apiClient.post('/tarot/random', {
      limit: 12
    });
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      // Fallback khi có lỗi: luôn trả về dữ liệu thay vì throw error
      return Promise.resolve(TAROT_CARDS.slice(0, 12));
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};
      
// Tạo bài đọc từ 3 lá đã chọn (bói thường với diễn giải có sẵn)
export const createStandardReading = async (selectedIndices, displayedCards, domain = 'general', question = '') => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(1000);
      
      // Lưu trữ lại thông tin lá bài đã chọn trước khi gọi prepareSelectedCards
      const originalSelectedCards = selectedIndices.map(index => displayedCards[index]);
      
      // Chuẩn bị 3 lá bài đã chọn với vị trí
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      // Khôi phục lại thuộc tính isReversed từ các lá bài gốc
      selectedCards.forEach((card, i) => {
        const originalCard = originalSelectedCards[i];
        if (originalCard && originalCard.isReversed !== undefined) {
          card.isReversed = originalCard.isReversed;
        }
      });
      
      return {
        id: `mock-${Date.now()}`,
        type: 'standard',
        domain,
        question,
        selectedCards,
        displayedCards,
        createdAt: new Date().toISOString(),
        interpretation: null
      };
    }
    
    // Điều chỉnh format dữ liệu phù hợp với API schema
    const requestBody = {
      topic_id: getTarotTopicId(domain),
      spread_id: 1, // Sử dụng spread ID mặc định cho trải bài 3 lá
      question: question || '',
      selected_cards: selectedIndices.map(index => displayedCards[index].id),
      type: 'standard'
    };
    
    const response = await apiClient.post('/tarot', requestBody);

    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      // Lưu trữ lại thông tin lá bài đã chọn trước khi gọi prepareSelectedCards
      const originalSelectedCards = selectedIndices.map(index => displayedCards[index]);
      
      // Chuẩn bị 3 lá bài đã chọn với vị trí
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      // Khôi phục lại thuộc tính isReversed từ các lá bài gốc
      selectedCards.forEach((card, i) => {
        const originalCard = originalSelectedCards[i];
        if (originalCard && originalCard.isReversed !== undefined) {
          card.isReversed = originalCard.isReversed;
        }
      });
      
      return {
        id: `mock-${Date.now()}`,
        type: 'standard',
        domain,
        question,
        selectedCards,
        displayedCards,
        createdAt: new Date().toISOString(),
        interpretation: null
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Tạo bài đọc từ 3 lá đã chọn (bói AI)
export const createAIReading = async (selectedIndices, displayedCards, domain = 'general', question = '') => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(2500); // Thêm delay dài hơn để giả lập thời gian xử lý của AI
      
      // Lưu trữ lại thông tin lá bài đã chọn trước khi gọi prepareSelectedCards
      const originalSelectedCards = selectedIndices.map(index => displayedCards[index]);
      
      // Chuẩn bị 3 lá bài đã chọn với vị trí
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      // Khôi phục lại thuộc tính isReversed từ các lá bài gốc
      selectedCards.forEach((card, i) => {
        const originalCard = originalSelectedCards[i];
        if (originalCard && originalCard.isReversed !== undefined) {
          card.isReversed = originalCard.isReversed;
        }
      });
      
      // Dữ liệu diễn giải mẫu theo các lĩnh vực
      const domainTexts = {
        love: {
          intro: "Trải bài Tarot về tình yêu của bạn cho thấy một bức tranh thú vị về mối quan hệ hiện tại hoặc tiềm năng.",
          conclusion: "Hãy nhớ rằng tình yêu là một hành trình, và các lá bài Tarot chỉ đơn giản là phản ánh năng lượng hiện tại. Bạn luôn có quyền tự do lựa chọn và thay đổi vận mệnh của mình."
        },
        career: {
          intro: "Trải bài Tarot về sự nghiệp này tiết lộ những yếu tố đang ảnh hưởng đến con đường sự nghiệp của bạn.",
          conclusion: "Đây là thời điểm tốt để suy ngẫm về những mục tiêu nghề nghiệp của bạn và điều chỉnh kế hoạch nếu cần thiết. Nhớ rằng, thành công trong sự nghiệp đến từ sự kiên nhẫn, chuẩn bị kỹ lưỡng và khả năng thích ứng."
        },
        finance: {
          intro: "Trải bài Tarot về tài chính này phản ánh tình hình tài chính hiện tại của bạn và những ảnh hưởng xung quanh nó.",
          conclusion: "Điều quan trọng là giữ sự cân bằng giữa tiết kiệm và chi tiêu, đồng thời luôn có kế hoạch dự phòng. Các lá bài cho thấy rằng với sự quản lý tốt, bạn có thể cải thiện tình hình tài chính của mình."
        },
        health: {
          intro: "Trải bài Tarot về sức khỏe này cung cấp những hiểu biết về tình trạng sức khỏe thể chất và tinh thần của bạn.",
          conclusion: "Hãy nhớ rằng sức khỏe là tài sản quý giá nhất. Dành thời gian chăm sóc bản thân, lắng nghe cơ thể và tâm trí của bạn. Các lá bài gợi ý rằng với sự quan tâm đúng mức, bạn có thể đạt được sự cân bằng và hạnh phúc."
        },
        spiritual: {
          intro: "Trải bài Tarot về khía cạnh tâm linh này tiết lộ hành trình phát triển tinh thần và kết nối của bạn với thế giới bên trong.",
          conclusion: "Hành trình tâm linh là một quá trình liên tục. Tin tưởng vào trực giác và tiếp tục khám phá những câu hỏi sâu sắc về cuộc sống. Các lá bài cho thấy bạn đang trên con đường đúng đắn để phát triển tâm hồn."
        },
        general: {
          intro: "Trải bài Tarot tổng quát này cung cấp cái nhìn tổng thể về tình hình hiện tại của bạn và những ảnh hưởng xung quanh.",
          conclusion: "Hãy nhớ rằng bạn là người nắm quyền kiểm soát vận mệnh của mình. Các lá bài chỉ đơn giản là công cụ hỗ trợ, giúp bạn suy ngẫm và đưa ra quyết định sáng suốt."
        }
      };
      
      // Tạo nội dung diễn giải cho từng lá bài
      const cardInterpretations = selectedCards.map(card => {
        const isReversed = card.isReversed;
        const position = card.position; // Bản thân, Hoàn cảnh, Thử thách
        const cardName = card.name;
        const baseMeaning = isReversed ? card.reversed_meaning || "Ý nghĩa ngược chưa được định nghĩa" : card.meaning || "Ý nghĩa chưa được định nghĩa";
        
        // Tạo diễn giải dựa trên vị trí và ý nghĩa của lá bài
        let positionIntro = "";
        switch (position) {
          case "Bản thân":
            positionIntro = isReversed 
              ? `Lá ${cardName} ở vị trí Bản thân (ngược) cho thấy bạn đang phải đối mặt với một số thách thức nội tâm.` 
              : `Lá ${cardName} ở vị trí Bản thân tiết lộ về năng lượng chính đang ảnh hưởng đến bạn.`;
            break;
          case "Hoàn cảnh":
            positionIntro = isReversed 
              ? `Lá ${cardName} ở vị trí Hoàn cảnh (ngược) chỉ ra rằng tình huống hiện tại của bạn có thể không như vẻ bề ngoài.` 
              : `Lá ${cardName} ở vị trí Hoàn cảnh mô tả các yếu tố bên ngoài đang tác động đến bạn.`;
            break;
          case "Thử thách":
            positionIntro = isReversed 
              ? `Lá ${cardName} ở vị trí Thử thách (ngược) gợi ý những rào cản tiềm ẩn mà bạn có thể chưa nhận thức đầy đủ.` 
              : `Lá ${cardName} ở vị trí Thử thách thể hiện những khó khăn chính mà bạn cần vượt qua.`;
            break;
          default:
            positionIntro = `Lá ${cardName} ${isReversed ? '(ngược)' : ''} tiết lộ về một khía cạnh quan trọng trong tình huống của bạn.`;
        }
        
        // Tạo lời khuyên dựa trên lá bài và vị trí
        let advice = "";
        if (isReversed) {
          advice = `Để vượt qua thách thức này, bạn nên dành thời gian tự suy ngẫm và không nên vội vàng. Lá bài ngược gợi ý rằng có những khía cạnh bạn chưa thấy rõ.`;
        } else {
          advice = `Hãy tận dụng năng lượng tích cực của lá bài này bằng cách chú ý đến trực giác và hành động quyết đoán khi cơ hội xuất hiện.`;
        }
        
        // Kết hợp các phần diễn giải
        return {
          title: `${position}: ${cardName} ${isReversed ? '(Ngược)' : ''}`,
          content: `${positionIntro}\n\n${baseMeaning}\n\n${advice}`
        };
      });
      
      // Tạo diễn giải tổng hợp
      const combinedIntro = domainTexts[domain]?.intro || domainTexts.general.intro;
      let combinedReading = `${combinedIntro}\n\n`;
      
      // Tạo kết luận dựa trên tính chất các lá bài
      const hasMajorArcana = selectedCards.some(card => card.type === 'Major Arcana');
      const hasReversedCards = selectedCards.some(card => card.isReversed);
      
      let combinedInsight = "";
      if (hasMajorArcana && hasReversedCards) {
        combinedInsight = "Ba lá bài này kết hợp với nhau cho thấy bạn đang trải qua một giai đoạn chuyển đổi quan trọng. Sự xuất hiện của lá bài thuộc bộ Arcana Lớn cùng với các lá bài ngược gợi ý rằng đây là thời điểm để bạn đánh giá lại các mục tiêu và kế hoạch của mình.";
      } else if (hasMajorArcana) {
        combinedInsight = "Sự hiện diện của lá bài thuộc bộ Arcana Lớn trong trải bài này cho thấy bạn đang trải qua những thay đổi quan trọng và có ý nghĩa. Đây là thời điểm quyết định để bạn nắm bắt cơ hội và hướng tới tương lai.";
      } else if (hasReversedCards) {
        combinedInsight = "Các lá bài ngược trong trải bài này gợi ý rằng có một số rào cản hoặc năng lượng bị chặn đang ảnh hưởng đến tình huống của bạn. Hãy xem xét những gì bạn có thể làm để giải phóng những năng lượng này.";
      } else {
        combinedInsight = "Ba lá bài xuôi trong trải bài này cho thấy một dòng năng lượng tích cực đang chảy qua cuộc sống của bạn. Đây là thời điểm tốt để tiến lên phía trước với các dự án và mục tiêu của bạn.";
      }
      
      combinedReading += combinedInsight;
      
      // Tạo kết luận cuối cùng
      const conclusion = domainTexts[domain]?.conclusion || domainTexts.general.conclusion;
      
      // Tạo diễn giải AI
      const domainDisplayName = {
        'love': 'Tình Yêu',
        'career': 'Sự Nghiệp',
        'finance': 'Tài Chính',
        'health': 'Sức Khỏe',
        'spiritual': 'Tâm Linh',
        'general': 'Tổng Quát'
      }[domain] || 'Tổng Quát';
      
      const questionText = question ? ` cho câu hỏi: "${question}"` : '';
      
      return {
        id: `ai-${Date.now()}`,
        type: 'ai',
        domain,
        question,
        selectedCards,
        displayedCards,
        createdAt: new Date().toISOString(),
        interpretation: {
          summary: `Diễn giải AI cho trải bài ${domainDisplayName}${questionText}`,
          combined: combinedReading,
          sections: cardInterpretations,
          conclusion: conclusion
        }
      };
    }
    
    // Điều chỉnh format dữ liệu phù hợp với API schema
    const requestBody = {
      topic_id: getTarotTopicId(domain),
      spread_id: 1, // Sử dụng spread ID mặc định cho trải bài 3 lá
      question: question || 'Xin hãy đọc lá bài Tarot cho tôi',
      selected_cards: selectedIndices.map(index => displayedCards[index].id),
      type: 'ai'
    };
    
    // Log request để debug
    console.log('Sending AI reading request:', JSON.stringify(requestBody));
    console.log('Selected indices:', selectedIndices);
    console.log('Display cards:', displayedCards);
    
    const response = await apiClient.post('/tarot/ai', requestBody);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      // Lưu trữ lại thông tin lá bài đã chọn trước khi gọi prepareSelectedCards
      const originalSelectedCards = selectedIndices.map(index => displayedCards[index]);
      
      // Chuẩn bị 3 lá bài đã chọn với vị trí
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      // Khôi phục lại thuộc tính isReversed từ các lá bài gốc
      selectedCards.forEach((card, i) => {
        const originalCard = originalSelectedCards[i];
        if (originalCard && originalCard.isReversed !== undefined) {
          card.isReversed = originalCard.isReversed;
        }
      });
      
      const domainDisplayName = {
        'love': 'Tình Yêu',
        'career': 'Sự Nghiệp',
        'finance': 'Tài Chính',
        'health': 'Sức Khỏe',
        'spiritual': 'Tâm Linh',
        'general': 'Tổng Quát'
      }[domain] || 'Tổng Quát';
      
      return {
        id: `ai-${Date.now()}`,
        type: 'ai',
        domain,
        question,
        selectedCards,
        displayedCards,
        createdAt: new Date().toISOString(),
        interpretation: {
          summary: `Diễn giải AI cho trải bài ${domainDisplayName}`,
          combined: `AI đã phân tích ba lá bài này trong lĩnh vực ${domainDisplayName} và đã tạo ra diễn giải tùy chỉnh dựa trên sự kết hợp độc đáo của các lá bài.`,
          sections: selectedCards.map(card => ({
            title: `${card.position}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
            content: `AI đã phân tích lá bài ${card.name} ở vị trí ${card.position} và tạo ra diễn giải sâu sắc dựa trên ý nghĩa truyền thống của lá bài và vị trí của nó.`
          })),
          conclusion: `Hãy suy ngẫm về diễn giải này và áp dụng những hiểu biết sâu sắc vào hoàn cảnh cụ thể của bạn. Tarot là một công cụ hỗ trợ, và quyết định cuối cùng luôn nằm trong tay bạn.`
        }
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Helper function để chuyển đổi domain thành topic_id phù hợp
function getTarotTopicId(domain) {
  switch(domain) {
    case 'love': return 1;
    case 'career': return 2;
    case 'finance': return 3;
    case 'health': return 4;
    case 'spiritual': return 5;
    default: return 6; // general
  }
}

// Get user readings history
export const getUserReadings = async (params = {}) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay();
      // Generate some mock reading history
      const readings = Array.from({ length: 5 }, (_, i) => {
        const type = Math.random() > 0.5 ? 'standard' : 'ai';
        const domain = ['love', 'career', 'finance', 'health', 'spiritual'][Math.floor(Math.random() * 5)];
        const displayedCards = getRandomTwelveCards();
        const selectedIndices = [0, 1, 2]; // Giả sử chọn 3 lá đầu tiên
        const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
        
        return {
        id: `mock-history-${i}`,
          type,
          domain,
          question: type === 'ai' ? 'Câu hỏi AI mẫu?' : '',
          selectedCards,
        createdAt: new Date(Date.now() - i * 86400000).toISOString() // 1 day apart
        };
      });
      
      return {
        readings,
        totalCount: readings.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    }
    
    const response = await apiClient.get(`/tarot/readings`, { params });
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      const readings = Array.from({ length: 5 }, (_, i) => {
        const type = Math.random() > 0.5 ? 'standard' : 'ai';
        const domain = ['love', 'career', 'finance', 'health', 'spiritual'][Math.floor(Math.random() * 5)];
        const displayedCards = getRandomTwelveCards();
        const selectedIndices = [0, 1, 2]; // Giả sử chọn 3 lá đầu tiên
        const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
        
        return {
        id: `mock-history-${i}`,
          type,
          domain,
          question: type === 'ai' ? 'Câu hỏi AI mẫu?' : '',
          selectedCards,
          createdAt: new Date(Date.now() - i * 86400000).toISOString() // 1 day apart
        };
      });
      
      return {
        readings,
        totalCount: readings.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Lưu kết quả đọc bài vào lịch sử người dùng
export const saveReading = async (reading) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      return {
        ...reading,
        id: reading.id || `saved-${Date.now()}`,
        saved: true,
        savedAt: new Date().toISOString()
      };
    }
    
    const response = await apiClient.post('/tarot/readings/save', reading);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      return {
        ...reading,
        id: reading.id || `saved-${Date.now()}`,
        saved: true,
        savedAt: new Date().toISOString()
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};
    
// Xóa kết quả đọc bài khỏi lịch sử người dùng
export const deleteReading = async (readingId) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(500);
      
      return {
        success: true,
        message: 'Đã xóa kết quả bói bài thành công'
      };
    }
    
    const response = await apiClient.delete(`/tarot/readings/${readingId}`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      return {
        success: true,
        message: 'Đã xóa kết quả bói bài thành công'
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Tạo link chia sẻ công khai cho kết quả đọc bài
export const createShareLink = async (readingId) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      return {
        shareToken: `share-${readingId}-${Date.now()}`,
        shareUrl: `${window.location.origin}/tarot/shared/share-${readingId}-${Date.now()}`
      };
    }
    
    const response = await apiClient.get(`/tarot/readings/${readingId}/share-link`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      return {
        shareToken: `share-${readingId}-${Date.now()}`,
        shareUrl: `${window.location.origin}/tarot/shared/share-${readingId}-${Date.now()}`
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Lấy kết quả đọc bài được chia sẻ công khai
export const getSharedReading = async (shareToken) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      // Tạo dữ liệu đọc bài giả lập
      const domain = ['love', 'career', 'finance', 'health', 'spiritual'][Math.floor(Math.random() * 5)];
      const type = Math.random() > 0.5 ? 'standard' : 'ai';
      const displayedCards = getRandomTwelveCards();
      const selectedIndices = [0, 1, 2]; // Giả sử chọn 3 lá đầu tiên
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      return {
        id: `shared-${Date.now()}`,
        shareToken,
        type,
        domain,
        question: type === 'ai' ? 'Câu hỏi AI mẫu?' : '',
        selectedCards,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        sharedAt: new Date().toISOString()
      };
    }
    
    const response = await apiClient.get(`/tarot/readings/shared/${shareToken}`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      const domain = ['love', 'career', 'finance', 'health', 'spiritual'][Math.floor(Math.random() * 5)];
      const type = Math.random() > 0.5 ? 'standard' : 'ai';
      const displayedCards = getRandomTwelveCards();
      const selectedIndices = [0, 1, 2]; // Giả sử chọn 3 lá đầu tiên
      const selectedCards = prepareSelectedCards(selectedIndices, displayedCards);
      
      return {
        id: `shared-${Date.now()}`,
        shareToken,
        type,
        domain,
        question: type === 'ai' ? 'Câu hỏi AI mẫu?' : '',
        selectedCards,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        sharedAt: new Date().toISOString()
      };
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Lấy danh sách nhật ký của người dùng
export const getJournals = async (params = {}) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      // Tạo dữ liệu mẫu
      const mockJournals = [
        {
          id: 1,
          title: 'Nhật ký hôm nay',
          content: 'Hôm nay tôi đã thực hiện một phiên đọc bài tarot và nhận được những lời khuyên hữu ích về tình hình hiện tại của mình.',
          entry_date: new Date().toISOString(),
          mood: 'Bình yên',
          tags: 'tarot, tâm linh, suy ngẫm',
          is_private: false,
          reading: {
            id: 123,
            question: 'Tôi nên tập trung vào điều gì trong tuần tới?'
          }
        },
        {
          id: 2,
          title: 'Suy nghĩ về cuộc sống',
          content: 'Hôm nay tôi đã dành thời gian để suy ngẫm về hướng đi trong tương lai và những mục tiêu cần đạt được.',
          entry_date: new Date(Date.now() - 86400000).toISOString(), // Hôm qua
          mood: 'Trầm tư',
          tags: 'tương lai, mục tiêu',
          is_private: true
        },
        {
          id: 3,
          title: 'Khoảnh khắc đáng nhớ',
          content: 'Hôm nay là một ngày tuyệt vời với nhiều khoảnh khắc đáng nhớ bên gia đình và bạn bè.',
          entry_date: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
          mood: 'Vui vẻ',
          tags: 'gia đình, bạn bè, kỷ niệm',
          is_private: false
        }
      ];
      
      // Xử lý filter nếu có
      let filteredJournals = [...mockJournals];
      
      if (params.startDate) {
        filteredJournals = filteredJournals.filter(
          journal => new Date(journal.entry_date) >= new Date(params.startDate)
        );
      }
      
      if (params.endDate) {
        filteredJournals = filteredJournals.filter(
          journal => new Date(journal.entry_date) <= new Date(params.endDate)
        );
      }
      
      if (params.mood) {
        filteredJournals = filteredJournals.filter(
          journal => journal.mood.toLowerCase().includes(params.mood.toLowerCase())
        );
      }
      
      if (params.tag) {
        filteredJournals = filteredJournals.filter(
          journal => journal.tags && journal.tags.toLowerCase().includes(params.tag.toLowerCase())
        );
      }
      
      return filteredJournals;
    }
    
    // Thực hiện API call thực tế khi BE sẵn sàng
    const response = await apiClient.get('/journals', { params });
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      return [];
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Lấy chi tiết nhật ký theo ID
export const getJournalById = async (journalId) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      // Mock data cho nhật ký chi tiết
      const mockJournals = [
        {
          id: 1,
          title: 'Nhật ký hôm nay',
          content: 'Hôm nay tôi đã thực hiện một phiên đọc bài tarot và nhận được những lời khuyên hữu ích về tình hình hiện tại của mình.\n\nLá bài "The Hermit" đã xuất hiện, nhắc nhở tôi cần dành thời gian để suy ngẫm và tự khám phá bản thân. Đúng là thời gian gần đây tôi đã quá bận rộn với công việc và cuộc sống xã hội mà quên đi việc chăm sóc nhu cầu tinh thần của mình.\n\nTôi sẽ cố gắng dành thời gian riêng cho bản thân nhiều hơn trong tuần tới.',
          entry_date: new Date().toISOString(),
          mood: 'Bình yên',
          tags: 'tarot, tâm linh, suy ngẫm',
          is_private: false,
          reading: {
            id: 123,
            question: 'Tôi nên tập trung vào điều gì trong tuần tới?',
            date_created: new Date().toISOString()
          }
        },
        {
          id: 2,
          title: 'Suy nghĩ về cuộc sống',
          content: 'Hôm nay tôi đã dành thời gian để suy ngẫm về hướng đi trong tương lai và những mục tiêu cần đạt được.\n\nSau một thời gian dài cảm thấy mất phương hướng, hôm nay tôi quyết định ngồi xuống và ghi ra danh sách những mục tiêu ngắn hạn và dài hạn của mình. Điều này giúp tôi cảm thấy trấn tĩnh hơn và có đường hướng rõ ràng hơn.\n\nTôi nhận ra rằng đôi khi chúng ta quá tập trung vào những vấn đề hiện tại mà quên đi bức tranh lớn của cuộc sống.',
          entry_date: new Date(Date.now() - 86400000).toISOString(), // Hôm qua
          mood: 'Trầm tư',
          tags: 'tương lai, mục tiêu',
          is_private: true
        },
        {
          id: 3,
          title: 'Khoảnh khắc đáng nhớ',
          content: 'Hôm nay là một ngày tuyệt vời với nhiều khoảnh khắc đáng nhớ bên gia đình và bạn bè.\n\nChúng tôi đã tổ chức một buổi picnic nhỏ ở công viên gần nhà. Thời tiết thật đẹp và mọi người đều rất vui vẻ. Đã lâu rồi tôi mới có cơ hội thư giãn và tận hưởng những khoảnh khắc đơn giản như vậy.\n\nĐây là lời nhắc nhở rằng hạnh phúc thường đến từ những điều giản dị nhất trong cuộc sống.',
          entry_date: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
          mood: 'Vui vẻ',
          tags: 'gia đình, bạn bè, kỷ niệm',
          is_private: false
        }
      ];
      
      // Tìm kiếm nhật ký theo ID
      const journal = mockJournals.find(j => j.id === parseInt(journalId));
      
      if (!journal) {
        throw new Error('Không tìm thấy nhật ký');
      }
      
      return journal;
    }
    
    // Thực hiện API call thực tế khi BE sẵn sàng
    const response = await apiClient.get(`/journals/${journalId}`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      throw new Error('Không tìm thấy nhật ký');
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Tạo mới nhật ký
export const createJournal = async (journalData) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(1000);
      
      // Tạo dữ liệu mẫu với ID mới
      return {
        id: Date.now(),
        ...journalData,
        entry_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
    }
    
    // Thực hiện API call thực tế khi BE sẵn sàng
    const response = await apiClient.post('/journals', journalData);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      throw new Error('Lỗi khi tạo nhật ký');
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Cập nhật nhật ký
export const updateJournal = async (journalId, journalData) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(1000);
      
      // Trả về dữ liệu đã cập nhật
      return {
        id: parseInt(journalId),
        ...journalData,
        updated_at: new Date().toISOString()
      };
    }
    
    // Thực hiện API call thực tế khi BE sẵn sàng
    const response = await apiClient.put(`/journals/${journalId}`, journalData);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      throw new Error('Lỗi khi cập nhật nhật ký');
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
};

// Xóa nhật ký
export const deleteJournal = async (journalId) => {
  try {
    if (USE_MOCK_API) {
      await mockDelay(800);
      
      // Trả về kết quả thành công
      return { success: true };
    }
    
    // Thực hiện API call thực tế khi BE sẵn sàng
    const response = await apiClient.delete(`/journals/${journalId}`);
    return response.data;
  } catch (error) {
    if (USE_MOCK_API) {
      throw new Error('Lỗi khi xóa nhật ký');
    }
    throw error.response ? error.response.data : { message: 'Network Error' };
  }
}; 