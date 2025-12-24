import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import TarotCardDisplay from './TarotCardDisplay';
// Import ảnh mặt sau
import defaultCardBackImage from '../../../assets/images/ui/card-back.png';

// CSS cho các hiệu ứng 3D
const styles = {
  perspective: {
    perspective: '1000px',
  },
  preserve3d: {
    transformStyle: 'preserve-3d',
  },
  backfaceHidden: {
    backfaceVisibility: 'hidden',
  },
  rotateY180: {
    transform: 'rotateY(180deg)',
  },
};

/**
 * Component hiển thị lưới các lá bài để người dùng chọn
 * @param {Object} props - Component props
 * @param {Array} props.cards - Danh sách các lá bài
 * @param {number} props.maxSelections - Số lượng lá bài tối đa có thể chọn
 * @param {Function} props.onCardsSelected - Callback khi đã chọn xong lá bài
 * @param {boolean} props.allowReversal - Cho phép lá bài xuất hiện ngược hay không
 * @param {string} props.cardBackImage - Đường dẫn hình ảnh mặt sau lá bài
 * @param {Function} props.getCardImagePath - Hàm lấy đường dẫn hình ảnh của lá bài
 */
const CardSelectionGrid = ({
  cards = [],
  maxSelections = 3,
  onCardsSelected,
  allowReversal = true,
  cardBackImage = defaultCardBackImage,
  getCardImagePath,
}) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);
  const [readingStarted, setReadingStarted] = useState(false);
  
  // Hàm helper để lấy đường dẫn ảnh cho lá bài
  const getCardImage = useCallback((card) => {
    // Sử dụng hàm được truyền vào nếu có
    if (getCardImagePath) {
      return getCardImagePath(card);
    }
    
    // Hàm mặc định nếu không có getCardImagePath được truyền vào
    if (!card || !card.name) return cardBackImage;
    
    // Sử dụng imageUrl nếu có
    if (card.imageUrl) return card.imageUrl;
    
    // Trả về URL dựa trên cấu trúc thư mục hiện tại
    if (card.arcana && card.arcana.toLowerCase() === 'major') {
      return `/assets/images/cards/major/${card.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    } else if (card.suit) {
      return `/assets/images/cards/minor/${card.suit.toLowerCase()}/${card.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    }
    
    // Fallback cuối cùng
    return cardBackImage;
  }, [cardBackImage, getCardImagePath]);
  
  // Thuật toán Fisher-Yates cải tiến cho việc xáo trộn thực sự ngẫu nhiên
  const shuffleCards = useCallback((cardsToShuffle) => {
    // Tạo bản sao của mảng đầu vào để không thay đổi mảng gốc
    const shuffled = [...cardsToShuffle];
    
    // Thêm một chút entropy bằng cách random thêm vài lần
    const iterations = 3 + Math.floor(Math.random() * 3); // Random từ 3-5 lần lặp
    
    for (let iteration = 0; iteration < iterations; iteration++) {
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        // Tạo index ngẫu nhiên từ 0 đến i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap phần tử tại i và j
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    }
    
    // Chỉ lấy 7 lá để hiển thị trên bàn
    const tableCards = shuffled.slice(0, 7);
    
    // Thêm thuộc tính isReversed cho mỗi lá bài
    return tableCards.map(card => ({
      ...card,
      isReversed: allowReversal ? Math.random() < 0.2 : false,
    }));
  }, [allowReversal]);
  
  // Shuffle cards khi component mount hoặc khi cards thay đổi
  useEffect(() => {
    if (cards.length > 0 && !readingStarted) {
      initialShuffle();
    }
  }, [cards, readingStarted]);
  
  // Shuffle lại khi người dùng muốn bắt đầu lại
  const resetReading = () => {
    setSelectedCards([]);
    setIsSelectionComplete(false);
    setReadingStarted(false);
    initialShuffle();
  };
  
  // Shuffle ban đầu
  const initialShuffle = () => {
    setIsShuffling(true);
    setReadingStarted(true);
    
    // Clone và shuffle mảng cards
    const shuffled = shuffleCards(cards);
    
    // Cập nhật state sau animation
    setTimeout(() => {
      setShuffledCards(shuffled);
      setIsShuffling(false);
    }, 1000);
  };
  
  // Handler khi chọn một lá bài
  const handleCardSelect = useCallback((card) => {
    if (selectedCards.length >= maxSelections) return;
    
    // Thêm vị trí/ý nghĩa cho lá bài
    const positions = ['Bản Thân', 'Hoàn Cảnh', 'Thử Thách'];
    const positionIndex = selectedCards.length;
    
    const enrichedCard = {
      ...card,
      position: positions[positionIndex],
      positionIndex
    };
    
    // Cập nhật selected cards
    const newSelectedCards = [...selectedCards, enrichedCard];
    setSelectedCards(newSelectedCards);
    
    // Kiểm tra nếu đã chọn đủ số lượng
    if (newSelectedCards.length === maxSelections) {
      setIsSelectionComplete(true);
      // Gọi callback sau khi kết thúc animation
      setTimeout(() => {
        onCardsSelected && onCardsSelected(newSelectedCards);
      }, 800);
    }
  }, [maxSelections, onCardsSelected, selectedCards]);
  
  // Handler khi click nút tự động chọn
  const handleAutoSelect = () => {
    setIsShuffling(true);
    
    // Số lá bài cần chọn thêm
    const remainingSelections = maxSelections - selectedCards.length;
    
    // Lọc các lá bài chưa được chọn
    const availableCards = shuffledCards.filter(
      card => !selectedCards.some(selectedCard => selectedCard.id === card.id)
    );
    
    // Thêm vị trí/ý nghĩa cho lá bài
    const positions = ['Bản Thân', 'Hoàn Cảnh', 'Thử Thách'];
    
    // Chọn ngẫu nhiên các lá bài
    const autoSelectedCards = [];
    for (let i = 0; i < remainingSelections; i++) {
      if (availableCards.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards.splice(randomIndex, 1)[0];
      
      // Thêm thông tin vị trí
      const positionIndex = selectedCards.length + i;
      autoSelectedCards.push({
        ...selectedCard,
        position: positions[positionIndex],
        positionIndex
      });
    }
    
    // Cập nhật sau animation
    setTimeout(() => {
      setIsShuffling(false);
      const newSelectedCards = [...selectedCards, ...autoSelectedCards];
      setSelectedCards(newSelectedCards);
      
      // Nếu đã chọn đủ
      if (newSelectedCards.length === maxSelections) {
        setIsSelectionComplete(true);
        setTimeout(() => {
          onCardsSelected && onCardsSelected(newSelectedCards);
        }, 800);
      }
    }, 1000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 8px rgb(147, 112, 219)",
      transition: { duration: 0.3 }
    },
    selected: {
      scale: 1.1,
      transition: { duration: 0.5 }
    },
    shuffling: {
      rotate: [0, 5, -5, 0],
      transition: { 
        duration: 0.5,
        repeat: 4,
        repeatType: 'reverse',
      }
    }
  };
  
  // Lấy vị trí theo index
  const getPositionName = (index) => {
    const positions = ['Bản Thân', 'Hoàn Cảnh', 'Thử Thách'];
    return positions[index] || '';
  };
  
  // Card display variants
  const cardFrontVariants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 }
  };
  
  const cardBackVariants = {
    hidden: { rotateY: 0, opacity: 1 },
    visible: { rotateY: 180, opacity: 0 }
  };
  
  return (
    <div className="w-full">
      {/* Hiển thị tiến trình chọn lá bài */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <p className="text-base sm:text-lg">
            Đã chọn: <span className="font-semibold text-purple-300">{selectedCards.length}/{maxSelections}</span> lá bài
          </p>
          {selectedCards.length > 0 && !isSelectionComplete && (
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Tiếp theo: <span className="text-purple-300 font-medium">{getPositionName(selectedCards.length)}</span>
            </p>
          )}
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          {readingStarted && (
            <button
              onClick={resetReading}
              disabled={isShuffling}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-white text-sm sm:text-base rounded-lg hover:bg-gray-600 transition-colors
                ${isShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Bói Lại
            </button>
          )}
          
          <button
            onClick={handleAutoSelect}
            disabled={isSelectionComplete || isShuffling || selectedCards.length >= maxSelections}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white text-sm sm:text-base rounded-lg hover:bg-purple-700 transition-colors
              ${(isSelectionComplete || isShuffling || selectedCards.length >= maxSelections) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Tự động chọn{selectedCards.length > 0 ? ' nốt' : ''}
          </button>
        </div>
      </div>
      
      {/* Animation shuffle ban đầu */}
      {isShuffling && (
        <div className="flex justify-center mb-4 sm:mb-6">
          <motion.div
            className="relative w-24 h-36 sm:w-32 sm:h-48"
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0, -5, 0],
            }}
            transition={{
              duration: 1,
              repeat: 2,
              repeatType: 'reverse',
            }}
          >
            <div className="absolute inset-0 bg-purple-900 rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-white text-sm sm:text-base font-medium">Đang xáo bài...</p>
            </div>
          </motion.div>
        </div>
      )}
      
      {!readingStarted && !isShuffling && (
        <div className="text-center py-6 sm:py-10">
          <p className="text-lg sm:text-xl text-purple-200 mb-4 sm:mb-6">Chọn 3 lá bài để xem vận mệnh của bạn</p>
          <button
            onClick={initialShuffle}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base sm:text-lg"
          >
            Bắt Đầu Trải Bài
          </button>
        </div>
      )}
      
      {/* Lưới hiển thị lá bài */}
      {readingStarted && !isShuffling && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {shuffledCards.map((card, index) => {
            // Kiểm tra xem lá bài đã được chọn chưa
            const isSelected = selectedCards.some(selected => selected.id === card.id);
            const selectedIndex = selectedCards.findIndex(c => c.id === card.id);
            
            return (
              <motion.div
                key={card.id || index}
                className="relative cursor-pointer"
                style={styles.perspective}
                variants={cardVariants}
                whileHover={!isSelected && !isSelectionComplete && !isShuffling ? "hover" : ""}
                animate={isSelected ? "selected" : isShuffling ? "shuffling" : "visible"}
                onClick={() => {
                  if (!isSelected && !isSelectionComplete && !isShuffling) {
                    handleCardSelect(card);
                  }
                }}
              >
                <div className="w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 lg:w-32 lg:h-48 relative transition-transform duration-500" 
                  style={{
                    ...styles.preserve3d,
                    transform: isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>
                  
                  {/* Mặt sau của lá bài */}
                  <div 
                    className={`absolute w-full h-full bg-purple-900 rounded-lg shadow-lg overflow-hidden ${isSelected ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    style={styles.backfaceHidden}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800 p-2">
                      <div className="w-full h-full border-2 border-gold rounded-md flex items-center justify-center">
                        <div className="text-gold text-xl sm:text-2xl">♦</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mặt trước lá bài */}
                  <div 
                    className={`absolute w-full h-full bg-purple-900 rounded-lg shadow-lg overflow-hidden ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                    style={{
                      ...styles.backfaceHidden,
                      ...styles.rotateY180
                    }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      animate={{ 
                        rotate: card.isReversed ? 180 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={getCardImage(card)} 
                        alt={card.name || 'Tarot Card'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = cardBackImage;
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0933] to-transparent p-1 sm:p-2">
                        <p className="text-white text-[8px] sm:text-xs font-medium text-center truncate">
                          {card.name || 'Tarot Card'}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Hiển thị vị trí lá bài khi được chọn */}
                {isSelected && (
                  <div className="absolute top-[-15px] sm:top-[-20px] left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-[8px] sm:text-xs font-bold py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-full">
                    {getPositionName(selectedIndex)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
      
      {/* Kết quả xem bài */}
      {isSelectionComplete && selectedCards.length === maxSelections && (
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 tracking-tight text-center">Lá Bài Đã Chọn</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {selectedCards.map((card, index) => (
              <motion.div 
                key={`result-${index}`} 
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative w-[90px] h-[150px] sm:w-[110px] sm:h-[180px] rounded-lg overflow-hidden shadow-lg border border-[#9370db]/30">
                  <motion.div
                    className="w-full h-full"
                    animate={{ rotate: card.isReversed ? 180 : 0 }}
                  >
                    <img 
                      src={getCardImage(card)} 
                      alt={card.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = cardBackImage;
                      }}
                    />
                  </motion.div>
                  
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0933] to-transparent p-1 sm:p-2">
                    <p className="text-white text-[10px] sm:text-xs font-medium text-center truncate">
                      {card.name || 'Tarot Card'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4 w-full">
                  <div className="bg-gradient-to-r from-transparent via-[#9370db]/30 to-transparent h-[1px] mb-2 sm:mb-3"></div>
                  <p className="text-center text-white text-xs sm:text-sm font-semibold">
                    <span className="flex items-center justify-center">
                      <span className="text-[#9370db] mr-1">•</span> {card.position} <span className="text-[#9370db] ml-1">•</span>
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Messaging */}
      {selectedCards.length === 0 && !isShuffling && readingStarted && (
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-300 text-sm sm:text-base">Chọn {maxSelections} lá bài để bắt đầu xem bói</p>
        </div>
      )}
    </div>
  );
};

CardSelectionGrid.propTypes = {
  cards: PropTypes.array.isRequired,
  maxSelections: PropTypes.number,
  onCardsSelected: PropTypes.func.isRequired,
  allowReversal: PropTypes.bool,
  cardBackImage: PropTypes.string,
  getCardImagePath: PropTypes.func,
};

export default CardSelectionGrid; 