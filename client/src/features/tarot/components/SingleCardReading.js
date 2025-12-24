import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import TarotCardDisplay from './TarotCardDisplay';

/**
 * Component hiển thị bói bài với một lá duy nhất (Daily Tarot)
 * @param {Object} props - Component props
 * @param {Object} props.card - Lá bài được rút
 * @param {string} props.question - Câu hỏi của người dùng (nếu có)
 * @param {Function} props.onRevealComplete - Callback khi hoàn tất lật bài
 */
const SingleCardReading = memo(({ 
  card, 
  question = '', 
  onRevealComplete 
}) => {
  const [isShuffling, setIsShuffling] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [cards, setCards] = useState([]);
  
  // Tạo bộ bài ảo
  useEffect(() => {
    if (card) {
      // Tạo 30 lá bài ảo để tạo hiệu ứng shuffle
      const dummyCards = Array.from({ length: 30 }, (_, index) => ({
        id: `dummy-${index}`,
        name: 'Tarot Card',
        imageUrl: null
      }));
      setCards(dummyCards);
    }
  }, [card]);
  
  // Xử lý hiệu ứng shuffle và reveal
  useEffect(() => {
    if (cards.length > 0) {
      // Sau 3 giây thì dừng shuffle
      const shuffleTimer = setTimeout(() => {
        setIsShuffling(false);
        
        // Sau 1 giây nữa thì hiển thị lá bài thật
        const revealTimer = setTimeout(() => {
          setIsRevealed(true);
          
          // Sau 2 giây nữa thì hiển thị phần giải thích
          const interpretationTimer = setTimeout(() => {
            setShowInterpretation(true);
            
            if (onRevealComplete) {
              onRevealComplete();
            }
          }, 2000);
          
          return () => clearTimeout(interpretationTimer);
        }, 1000);
        
        return () => clearTimeout(revealTimer);
      }, 3000);
      
      return () => clearTimeout(shuffleTimer);
    }
  }, [cards, onRevealComplete]);
  
  // Xác định lá bài để hiển thị (dùng lá bài thật khi đã reveal, nếu không dùng lá ảo)
  const displayCard = isRevealed ? card : cards.length > 0 ? cards[0] : null;
  
  return (
    <div className="relative py-8">
      {/* Background đẹp */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0933]/50 to-[#3a1c5a]/50 rounded-xl"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/images/stars-bg.png')] bg-repeat opacity-30"></div>
        
        {/* Hiệu ứng ánh sáng */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#9370db]/20 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Container content */}
      <div className="relative z-10">
        {/* Phần câu hỏi */}
        {question && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white/5 backdrop-blur-sm border border-[#9370db]/30 rounded-lg px-5 py-3">
              <p className="text-white/90 tracking-vn-tight italic">"{question}"</p>
            </div>
          </div>
        )}
        
        {/* Khu vực hiển thị bài */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-[350px] flex items-center justify-center mb-6 relative">
            {/* Deck of cards */}
            {isShuffling && (
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`deck-${index}`}
                    className="absolute w-32 h-48 bg-gradient-to-br from-[#2a1045] to-[#3a1c5a] rounded-lg shadow-lg border-2 border-[#9370db]/20"
                    style={{
                      transform: `translateX(${Math.random() * 10 - 5}px) translateY(${
                        Math.random() * 10 - 5
                      }px) rotate(${Math.random() * 4 - 2}deg)`,
                      transition: 'all 0.3s ease',
                      zIndex: 10 - index,
                    }}
                  >
                    <div className="absolute inset-1 bg-[url('/src/assets/images/tarot-back.jpg')] bg-contain bg-center bg-no-repeat"></div>
                  </div>
                ))}
              </div>
            )}
            
            {/* The revealed card */}
            <div className={`transition-all duration-500 ${
              isShuffling 
                ? 'opacity-0 scale-90' 
                : 'opacity-100 scale-100'
            }`}>
              <TarotCardDisplay
                card={displayCard}
                isRevealed={isRevealed}
                size="large"
              />
            </div>
          </div>
          
          {/* Giải thích */}
          {isRevealed && card && (
            <div className={`max-w-xl mx-auto transition-all duration-700 ${
              showInterpretation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-white/5 backdrop-blur-sm border border-[#9370db]/20 rounded-lg p-5">
                <h3 className="text-xl font-medium text-white mb-3 tracking-vn-tight flex items-center">
                  <span className="inline-block w-8 h-8 bg-[#9370db]/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-[#9370db]">✧</span>
                  </span>
                  {card.name} {card.isReversed ? '(Ngược)' : ''}
                </h3>
                
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-gray-300 tracking-vn-tight leading-vn">
                    {card.meaning || 'Đang tải giải thích cho lá bài này...'}
                  </p>
                  
                  {/* Keywords */}
                  {card.keywords && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white mb-2 tracking-vn-tight">Từ khóa:</h4>
                      <div className="flex flex-wrap gap-2">
                        {card.keywords.split(',').map((keyword, i) => (
                          <span 
                            key={i} 
                            className="bg-[#9370db]/20 px-2 py-1 rounded-full text-xs text-white/90"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SingleCardReading.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    meaning: PropTypes.string,
    keywords: PropTypes.string,
    isReversed: PropTypes.bool
  }),
  question: PropTypes.string,
  onRevealComplete: PropTypes.func
};

export default SingleCardReading; 