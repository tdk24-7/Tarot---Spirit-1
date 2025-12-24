import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { performStandardReading, performAIReading } from '../slices/tarotSlice';
import ReadingTypeSelector from './ReadingTypeSelector';

const ReadingTypeCard = memo(({ type, selected, onClick, icon, description }) => (
  <motion.div 
    className={`p-5 rounded-lg cursor-pointer transition-all duration-300 h-full flex
    ${selected 
      ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] shadow-lg transform scale-[1.02]' 
      : 'bg-white/5 backdrop-blur-sm border border-purple-900/20 hover:bg-white/10'}`}
    onClick={() => onClick(type.id)}
    whileHover={{ y: -3, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center w-full">
      <div className="w-14 h-14 rounded-full bg-[#2a1045] flex items-center justify-center mr-4 flex-shrink-0 border border-purple-500/30 shadow-md">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white mb-1 tracking-vn-tight">{type.name}</h3>
        <p className="text-sm text-gray-300 tracking-vn-tight leading-snug">{description}</p>
      </div>
    </div>
  </motion.div>
));

/**
 * Form để bắt đầu một phiên đọc bài Tarot - thiết kế theo hướng hiệu quả và đơn giản hơn
 * @param {Object} props - Component props
 * @param {Function} props.onStart - Callback khi bắt đầu trải bài
 * @param {boolean} props.isLoading - Trạng thái loading
 */
const TarotReadingForm = memo(({ onStart, isLoading = false }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState('love');
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(false); // Thêm state để chọn giữa bói thường và bói AI
  
  // Ghi log để debug
  useEffect(() => {
    console.log('TarotReadingForm - Current useAI state:', useAI);
  }, [useAI]);
  
  // Danh sách các loại trải bài được tối ưu và đơn giản hóa
  const readingTypes = [
    { id: 'love', name: 'Tình Yêu', cards: 3, description: 'Tìm hiểu về tình yêu và các mối quan hệ' },
    { id: 'career', name: 'Sự Nghiệp', cards: 3, description: 'Khám phá con đường sự nghiệp của bạn' },
    { id: 'finance', name: 'Tài Chính', cards: 3, description: 'Nhận lời khuyên về tình hình tài chính' },
    { id: 'health', name: 'Sức Khỏe', cards: 3, description: 'Hiểu rõ về sức khỏe thể chất và tinh thần' },
    { id: 'spiritual', name: 'Tâm Linh', cards: 3, description: 'Khám phá hành trình tâm linh của bạn' }
  ];
  
  // Icons cho các loại trải bài
  const typeIcons = {
    'love': '❤️',
    'career': '💼',
    'finance': '💰',
    'health': '🧘‍♀️',
    'spiritual': '✨'
  };
  
  // Toggle giữa bói thường và bói AI
  const toggleReadingType = (useAIValue) => {
    console.log('TarotReadingForm - Toggling useAI to:', useAIValue);
    setUseAI(useAIValue);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!selectedType) {
      setError('Vui lòng chọn loại trải bài');
      return;
    }
    
    setError('');
    
    // Tìm type đã chọn
    const selectedReadingType = readingTypes.find(type => type.id === selectedType);
    
    // Tạo dữ liệu reading
    const readingData = {
      readingType: selectedType,
      useAI: useAI,
      numCards: selectedReadingType?.cards || 3
    };
    
    console.log('TarotReadingForm - handleSubmit với readingData:', readingData);
    
    // Khi bói AI, chỉ gọi callback onStart để hiển thị form nhập câu hỏi
    // Khi bói thường, thực hiện dispatch action ngay
    if (!useAI) {
      dispatch(performStandardReading(readingData));
    }
    
    // Gọi callback
    if (onStart) {
      onStart(readingData);
    }
  };
  
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 tracking-vn-tight text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="text-[#9370db] mr-2">✨</span>
        Chọn Chủ Đề Bói Bài
        <span className="text-[#9370db] ml-2">✨</span>
      </motion.h2>
      
      {error && (
        <motion.div 
          className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-6"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white tracking-vn-tight">{error}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Thêm phần chọn loại bói (Thường/AI) */}
        <ReadingTypeSelector 
          useAI={useAI}
          onToggle={toggleReadingType}
        />
        
        <motion.div 
          className="mb-8 grid grid-cols-1 gap-4 mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {readingTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="h-full"
            >
              <ReadingTypeCard
                type={type}
                selected={selectedType === type.id}
                onClick={setSelectedType}
                icon={typeIcons[type.id] || '🔮'}
                description={type.description}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white py-4 px-12 rounded-lg font-semibold text-lg shadow-lg shadow-[#9370db]/20 tracking-vn-tight
                      ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ 
              y: -3,
              boxShadow: "0 10px 25px rgba(147, 112, 219, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: ["0 5px 15px rgba(147, 112, 219, 0.3)", "0 8px 25px rgba(147, 112, 219, 0.5)", "0 5px 15px rgba(147, 112, 219, 0.3)"],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">✨</span>
                BẮT ĐẦU BÓI BÀI
                <span className="ml-2">✨</span>
              </span>
            )}
          </motion.button>
          
          <motion.p 
            className="text-gray-400 text-sm mt-3 tracking-vn-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Hãy tập trung vào câu hỏi của bạn trước khi bắt đầu
          </motion.p>
        </motion.div>
      </form>
    </motion.div>
  );
});

TarotReadingForm.propTypes = {
  onStart: PropTypes.func,
  isLoading: PropTypes.bool
};

ReadingTypeCard.propTypes = {
  type: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string
};

export default TarotReadingForm; 