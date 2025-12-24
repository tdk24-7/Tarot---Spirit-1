import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaHeart, FaRegHeart, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';

/**
 * Component hiển thị chi tiết của một lá bài Tarot
 * @param {Object} props - Component props
 * @param {Object} props.card - Thông tin lá bài
 * @param {Function} props.onBack - Callback khi nhấn nút quay lại
 * @param {Function} props.onNext - Callback khi nhấn nút lá bài kế tiếp
 * @param {Function} props.onPrevious - Callback khi nhấn nút lá bài trước đó
 * @param {boolean} props.isFavorite - Trạng thái yêu thích của lá bài
 * @param {Function} props.onToggleFavorite - Callback khi toggle yêu thích
 */
const TarotCardDetailView = ({
  card,
  onBack,
  onNext,
  onPrevious,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [isReversed, setIsReversed] = useState(false);
  const [activeTab, setActiveTab] = useState('meaning');
  
  if (!card) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Không tìm thấy thông tin lá bài</p>
      </div>
    );
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };
  
  const cardImageVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };
  
  // Nội dung các tab
  const tabs = [
    { id: 'meaning', label: 'Ý nghĩa' },
    { id: 'description', label: 'Mô tả' },
    { id: 'symbols', label: 'Biểu tượng' },
    { id: 'related', label: 'Lá bài liên quan' },
  ];
  
  // Generate fallback image URL nếu không có hình ảnh
  const generateFallbackImage = (cardName) => {
    const encodedName = encodeURIComponent(cardName || 'Tarot Card');
    return `https://via.placeholder.com/600x900/2a1045/9370db?text=${encodedName}`;
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={card.id}
        className="w-full max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header với navigation */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-800 p-3 sm:p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-2 sm:mr-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
              {card.name}
              {card.number !== undefined && 
                <span className="ml-2 text-gray-300 text-sm sm:text-base font-normal">({card.number})</span>
              }
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsReversed(!isReversed)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label={isReversed ? "Show upright" : "Show reversed"}
            >
              {isReversed ? <FaArrowUp size={16} /> : <FaArrowDown size={16} />}
            </button>
            
            <button
              onClick={onToggleFavorite}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaHeart size={16} className="text-red-500" /> : <FaRegHeart size={16} />}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevious}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Previous card"
              >
                <FaArrowLeft size={16} />
              </button>
              <button
                onClick={onNext}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Next card"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Card image */}
            <motion.div
              className={`relative mx-auto md:mx-0 max-w-[220px] md:max-w-none ${isReversed ? 'rotate-180' : ''} transition-transform duration-500`}
              variants={cardImageVariants}
            >
              <div className="aspect-[3/5] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={card.imageUrl.replace('/src/', '/') || generateFallbackImage(card.name)}
                  alt={card.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = generateFallbackImage(card.name);
                  }}
                />
              </div>
              
              {/* Card type info */}
              <div className="mt-3 sm:mt-4 bg-gray-700 rounded-lg p-2 sm:p-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-300">Bộ:</span> 
                    <span className="text-white ml-1 sm:ml-2">{card.arcana === 'Major' ? 'Bộ Ẩn Chính' : 'Bộ Ẩn Phụ'}</span>
                  </div>
                  
                  {card.suit && (
                    <div>
                      <span className="text-gray-300">Loại:</span>
                      <span className="text-white ml-1 sm:ml-2">{card.suit}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Keywords */}
              {((card.keywordsViet && card.keywordsViet.length > 0) || (card.keywords && card.keywords.length > 0)) && (
                <div className="mt-3 sm:mt-4">
                  <h3 className="text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">Từ khóa:</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {(card.keywordsViet || card.keywords).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-700 text-white rounded-full text-[10px] sm:text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Card details */}
            <div className="md:col-span-2 mt-4 md:mt-0">
              {/* Tabs - Horizontal scrollable on mobile */}
              <div className="border-b border-gray-700 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
                <nav className="flex space-x-4 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-1.5 sm:py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-500'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab content */}
              <div className="min-h-[250px] sm:min-h-[300px]">
                {activeTab === 'meaning' && (
                  <div>
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                        Ý nghĩa khi xuôi
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {card.meaningUprightViet || card.meaningUpright || 'Không có thông tin.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                        Ý nghĩa khi ngược
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {card.meaningReversedViet || card.meaningReversed || 'Không có thông tin.'}
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'description' && (
                  <div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {card.descriptionViet || card.description || 'Không có thông tin mô tả chi tiết cho lá bài này.'}
                    </p>
                    
                    {card.element && (
                      <div className="mt-3 sm:mt-4">
                        <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                          Nguyên tố
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base">{card.element}</p>
                      </div>
                    )}
                    
                    {card.astrology && (
                      <div className="mt-3 sm:mt-4">
                        <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                          Chiêm tinh học
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base">{card.astrology}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'symbols' && (
                  <div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {card.symbolismViet || card.symbolism || 'Không có thông tin về biểu tượng cho lá bài này.'}
                    </p>
                    
                    {(card.colorsViet || card.colors) && (
                      <div className="mt-3 sm:mt-4">
                        <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">
                          Ý nghĩa màu sắc
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base">{card.colorsViet || card.colors}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'related' && (
                  <div>
                    {card.relatedCards && card.relatedCards.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
                        {card.relatedCards.map((relatedCard) => (
                          <div
                            key={relatedCard.id}
                            className="bg-gray-700 rounded-lg p-1 sm:p-2 hover:bg-gray-600 transition-colors cursor-pointer"
                            onClick={() => onCardClick && onCardClick(relatedCard)}
                          >
                            <div className="aspect-[3/5] rounded overflow-hidden mb-1 sm:mb-2">
                              <img
                                src={relatedCard.imageUrl || generateFallbackImage(relatedCard.name)}
                                alt={relatedCard.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-center text-white text-[10px] sm:text-sm truncate">{relatedCard.name}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm sm:text-base">Không có thông tin về các lá bài liên quan.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

TarotCardDetailView.propTypes = {
  card: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
};

export default TarotCardDetailView; 