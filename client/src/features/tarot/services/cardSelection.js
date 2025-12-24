/**
 * cardSelection.js
 * Cung cấp các hàm để chọn lá bài Tarot và xử lý logic bói bài
 */

/**
 * Lấy 12 lá bài ngẫu nhiên từ 78 lá để trải lên bàn
 * 
 * @param {Array} allCards - Mảng tất cả các lá bài có sẵn (78 lá)
 * @returns {Array} - Mảng 12 lá bài đã chọn ngẫu nhiên
 */
export const getRandomTwelveCards = (allCards) => {
  if (!allCards || !Array.isArray(allCards) || allCards.length === 0) {
    console.error('Không có lá bài để chọn');
    return [];
  }

  // Sao chép và trộn tất cả bài
  const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
  
  // Lấy 12 lá đầu tiên sau khi trộn
  const twelveCards = shuffledCards.slice(0, 12);
  
  return twelveCards;
};

/**
 * Xác định xác suất lá bài ngược dựa trên mức độ ngẫu nhiên
 * 
 * @returns {boolean} - Lá bài có ngược hay không
 */
export const determineReversalProbability = () => {
  // Xác suất cơ bản 25% lá bài sẽ bị ngược
  const reversalProbability = 0.25;
  return Math.random() < reversalProbability;
};

/**
 * Chuẩn bị 3 lá bài đã chọn để diễn giải
 * 
 * @param {Array} selectedCards - Mảng 3 lá bài đã được người dùng chọn từ 12 lá
 * @returns {Array} - Mảng 3 lá bài đã được xử lý với thông tin vị trí và ngược
 */
export const prepareCardsForReading = (selectedCards) => {
  if (!selectedCards || !Array.isArray(selectedCards) || selectedCards.length !== 3) {
    console.error('Phải chọn đúng 3 lá bài');
    return [];
  }
  
  // Vị trí cố định cho 3 lá bài
  const positions = [
    'Bản thân', // Vị trí 1
    'Hoàn cảnh', // Vị trí 2
    'Thử thách'  // Vị trí 3
  ];
  
  // Gán vị trí và xác định ngẫu nhiên nếu lá bài ngược
  const cardsWithPositions = selectedCards.map((card, index) => ({
    ...card,
    position: positions[index],
    positionIndex: index + 1,
    isReversed: determineReversalProbability()
  }));
  
  return cardsWithPositions;
};

/**
 * Hàm hỗ trợ chọn lá bài và chuẩn bị cho trải bài 3 lá
 * 
 * @param {Array} allCards - Mảng tất cả các lá bài có sẵn
 * @param {Array} selectedIndices - Mảng vị trí của 3 lá người dùng chọn từ 12 lá (0-11)
 * @param {string} domain - Lĩnh vực được chọn (love, career, finance, health, spiritual)
 * @returns {Object} - Đối tượng chứa thông tin về trải bài
 */
export const createThreeCardReading = (allCards, selectedIndices, domain = 'general') => {
  // Lấy 12 lá bài ngẫu nhiên
  const twelveCards = getRandomTwelveCards(allCards);
  
  // Lấy 3 lá bài theo chỉ số mà người dùng chọn
  const selectedCards = selectedIndices.map(index => twelveCards[index]);
  
  // Chuẩn bị 3 lá bài với vị trí và thông tin ngược
  const readingCards = prepareCardsForReading(selectedCards);
  
  return {
    domain,
    twelveCards,
    readingCards
  };
}; 