import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
/**
 * Component cho phép người dùng nhập câu hỏi khi bói AI
 * 
 * @param {Object} props - Component props
 * @param {string} props.question - Câu hỏi đã nhập
 * @param {Function} props.onQuestionChange - Callback khi thay đổi câu hỏi
 * @param {Function} props.onSubmit - Callback khi người dùng xác nhận câu hỏi
 * @param {string} props.readingType - Loại bói đã chọn (tình yêu, sự nghiệp, etc.)
 * 
 */

// Khởi tạo Gemini API - Nên đặt API key trong .env
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Hàm test API - chỉ sử dụng cho mục đích phát triển
const testGeminiAPI = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Explain how AI works in a few words");
    console.log("Gemini API Test:", result.response.text());
  } catch (error) {
    console.error("Gemini API Test Error:", error);
  }
};

// Test API khi cần thiết - comment lại khi không sử dụng
// testGeminiAPI();

const AIQuestionInput = memo(({ question, onQuestionChange, onSubmit, readingType }) => {
  const [error, setError] = useState('');
  
  // Danh sách gợi ý câu hỏi theo từng chủ đề
  const questionSuggestions = {
    love: [
      "Mối quan hệ hiện tại của tôi sẽ phát triển như thế nào?",
      "Tôi có gặp được người phù hợp trong tương lai gần không?",
      "Làm thế nào để cải thiện mối quan hệ hiện tại của tôi?"
    ],
    career: [
      "Tôi có nên thay đổi công việc hiện tại không?",
      "Hướng phát triển sự nghiệp nào phù hợp với tôi?",
      "Điều gì đang cản trở sự phát triển trong công việc của tôi?"
    ],
    finance: [
      "Tình hình tài chính của tôi sẽ thay đổi như thế nào trong 6 tháng tới?",
      "Tôi có nên đầu tư vào dự án mới không?",
      "Làm thế nào để cải thiện tình hình tài chính hiện tại?"
    ],
    health: [
      "Làm thế nào để cải thiện sức khỏe tinh thần của tôi?",
      "Điều gì đang ảnh hưởng đến sức khỏe của tôi?",
      "Làm thế nào để đạt được sự cân bằng tốt hơn trong cuộc sống?"
    ],
    spiritual: [
      "Hướng phát triển tâm linh nào phù hợp với tôi?",
      "Làm thế nào để tôi kết nối sâu hơn với bản thân?",
      "Điều gì đang cản trở sự phát triển tâm linh của tôi?"
    ]
  };
  
  // Lấy danh sách gợi ý dựa trên loại bói
  const suggestions = questionSuggestions[readingType] || questionSuggestions.love;
  
  // Xử lý khi người dùng gửi câu hỏi
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('AIQuestionInput - handleSubmit với câu hỏi:', question);
    
    if (!question.trim()) {
      setError('Vui lòng nhập câu hỏi của bạn');
      return;
    }
    
    setError('');
    console.log('AIQuestionInput - Gọi callback onSubmit');
    onSubmit();
  };
  
  // Xử lý khi chọn câu hỏi gợi ý
  const handleSelectSuggestion = (suggestion) => {
    console.log('AIQuestionInput - handleSelectSuggestion với:', suggestion);
    onQuestionChange(suggestion);
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
        Nhập Câu Hỏi Cho AI
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
        <div className="mb-6">
          <label htmlFor="question" className="block text-white mb-2 text-sm font-medium tracking-vn-tight">
            Câu hỏi của bạn:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="w-full h-32 bg-white/10 border border-purple-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 tracking-vn-tight resize-none focus:outline-none focus:ring-2 focus:ring-[#9370db]/50 focus:border-transparent transition-colors"
            placeholder="Ví dụ: Tình yêu của tôi sẽ phát triển như thế nào trong tương lai?"
          />
          <p className="mt-2 text-xs text-gray-400 tracking-vn-tight">
            Câu hỏi càng cụ thể, AI sẽ càng có thể đưa ra diễn giải chính xác hơn.
          </p>
        </div>
        
        <div className="mb-8">
          <p className="text-white text-sm mb-3 tracking-vn-tight">Gợi ý câu hỏi:</p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                type="button"
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-purple-900/20 rounded-lg px-4 py-3 text-sm text-gray-300 tracking-vn-tight transition-colors"
                onClick={() => handleSelectSuggestion(suggestion)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white py-4 px-12 rounded-lg font-semibold text-lg shadow-lg shadow-[#9370db]/20 tracking-vn-tight"
            whileHover={{ 
              y: -3,
              boxShadow: "0 10px 25px rgba(147, 112, 219, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center">
              <span className="mr-2">✨</span>
              TIẾP TỤC BÓI BÀI
              <span className="ml-2">✨</span>
            </span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
});

AIQuestionInput.propTypes = {
  question: PropTypes.string.isRequired,
  onQuestionChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  readingType: PropTypes.string.isRequired
};

export default AIQuestionInput; 