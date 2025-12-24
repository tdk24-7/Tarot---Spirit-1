import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const DailyTarotCard = ({ message }) => {
  // Nếu không có dữ liệu, hiển thị placeholder
  if (!message) {
    return (
      <div className="flex justify-center">
        <div className="bg-purple-900/40 rounded-xl p-6 sm:p-8 text-center max-w-md">
          <p className="text-purple-300 text-sm sm:text-base">Đang tìm kiếm thông điệp Tarot hôm nay...</p>
        </div>
      </div>
    );
  }

  // Extract card info from message
  const { card, date, message: cardMessage } = message;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Card image */}
          <motion.div 
            className="w-full md:w-1/3 flex justify-center items-center p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-[160px] h-[270px] sm:w-[200px] sm:h-[340px]">
              <motion.div
                className="absolute inset-0 rounded-xl shadow-lg overflow-hidden border-2 border-purple-500/30"
                whileHover={{ scale: 1.05 }}
              >
                {card && card.image_url ? (
                  <img 
                    src={card.image_url} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-purple-600 to-indigo-900 flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg font-bold">{card?.name || 'Tarot Card'}</span>
                  </div>
                )}
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                
                {/* Mystical particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 rounded-full bg-white/50"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                        y: [0, -20, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Card info */}
          <motion.div 
            className="w-full md:w-2/3 p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-purple-500/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-purple-200">
                {new Date(date).toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white">
              {card?.name || 'Thông Điệp Tarot Hôm Nay'}
            </h3>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-purple-200 leading-relaxed">{cardMessage}</p>
            </div>
            
            <div className="border-t border-purple-500/30 pt-3 sm:pt-4">
              <h4 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-white">Lời Khuyên</h4>
              <p className="text-sm sm:text-base text-purple-200 italic">
                {card?.meaning_upright ? 
                  card.meaning_upright : 
                  'Hãy suy ngẫm về thông điệp từ lá bài hôm nay và nhìn nhận nó từ góc độ của bạn.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

DailyTarotCard.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    card: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      image_url: PropTypes.string,
      meaning_upright: PropTypes.string,
      meaning_reversed: PropTypes.string
    }),
    date: PropTypes.string,
    message: PropTypes.string
  })
};

export default DailyTarotCard; 