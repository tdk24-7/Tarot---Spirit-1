import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Component cho phép người dùng lựa chọn giữa bói thường và bói AI
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.useAI - Trạng thái hiện tại có đang sử dụng AI không
 * @param {Function} props.onToggle - Callback khi người dùng chuyển đổi loại bói
 */
const ReadingTypeSelector = memo(({ useAI, onToggle }) => {
  // Log debugging
  console.log('ReadingTypeSelector rendered với useAI:', useAI);

  const handleToggle = (value) => {
    console.log('ReadingTypeSelector - Toggling to:', value);
    onToggle(value);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-4 tracking-vn-tight flex items-center">
        <span className="text-2xl mr-2">🧠</span> Chọn Cách Bói Bài
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Bói Thường */}
        <motion.div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 
            ${!useAI 
              ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] shadow-lg transform scale-[1.02]' 
              : 'bg-white/5 backdrop-blur-sm border border-purple-900/20 hover:bg-white/10'}`}
          onClick={() => handleToggle(false)}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#2a1045] flex items-center justify-center mr-4">
              <span className="text-2xl">🔮</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1 tracking-vn-tight">Bói Thường</h3>
              <p className="text-sm text-gray-300 tracking-vn-tight">Sử dụng diễn giải có sẵn dựa trên bộ template</p>
            </div>
          </div>
        </motion.div>
        
        {/* Bói AI */}
        <motion.div
          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 
            ${useAI 
              ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] shadow-lg transform scale-[1.02]' 
              : 'bg-white/5 backdrop-blur-sm border border-purple-900/20 hover:bg-white/10'}`}
          onClick={() => handleToggle(true)}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#2a1045] flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1 tracking-vn-tight">Bói AI</h3>
              <p className="text-sm text-gray-300 tracking-vn-tight">Sử dụng trí tuệ nhân tạo phân tích chuyên sâu</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="mt-3 p-3 text-sm text-gray-300 bg-[#2a1045]/40 rounded-lg">
        <div className="flex items-start">
          <span className="text-[#9370db] mr-2">💡</span>
          <p className="tracking-vn-tight">
            {useAI 
              ? "Bói AI sử dụng trí tuệ nhân tạo để phân tích lá bài sâu sắc và cá nhân hóa hơn. Kết quả có thể mất một chút thời gian."
              : "Bói Thường sử dụng thông tin và diễn giải cổ điển có sẵn, phù hợp với những ai muốn đọc nhanh."}
          </p>
        </div>
      </div>
    </div>
  );
});

ReadingTypeSelector.propTypes = {
  useAI: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default ReadingTypeSelector; 