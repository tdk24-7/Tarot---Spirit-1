import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ReadingTypeCard = ({ readingType }) => {
  const { id, name, description, cardCount, image, path } = readingType;
  
  // Tính hiển thị thông tin thẻ
  const getCardCountText = () => {
    if (cardCount === 1) return '1 lá bài';
    return `${cardCount} lá bài`;
  };
  
  // Hiệu ứng hover cho thẻ bài
  const cardVariants = {
    initial: { scale: 1, y: 0, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.03, 
      y: -5, 
      boxShadow: '0 15px 30px rgba(147, 112, 219, 0.3)' 
    }
  };
  
  return (
    <motion.div 
      className="bg-gradient-to-b from-purple-900/40 to-indigo-900/40 rounded-xl overflow-hidden shadow-lg"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-700 to-indigo-900 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{name}</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
        
        {/* Card count badge */}
        <div className="absolute top-3 right-3 bg-purple-600/90 px-2 py-1 rounded-full text-xs text-white font-medium shadow-sm">
          {getCardCountText()}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
        <p className="text-purple-200 mb-6 text-sm min-h-[60px]">{description}</p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={path} 
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            Bắt đầu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          <motion.div
            className="text-purple-300 text-sm cursor-pointer flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            Tìm hiểu thêm
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Tarot card visual on the corner */}
      <motion.div 
        className="absolute -bottom-10 -right-10 w-32 h-32 opacity-10"
        animate={{ 
          rotate: [0, 10, 0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="white">
          <rect x="10" y="10" width="80" height="120" rx="5" ry="5" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" />
          <path d="M35 65 L65 35 M35 35 L65 65" stroke="white" strokeWidth="2" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

ReadingTypeCard.propTypes = {
  readingType: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cardCount: PropTypes.number.isRequired,
    image: PropTypes.string,
    path: PropTypes.string.isRequired
  }).isRequired
};

export default ReadingTypeCard; 