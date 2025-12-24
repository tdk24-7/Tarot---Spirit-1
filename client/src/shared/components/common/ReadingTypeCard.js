import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './Button';

/**
 * Component card hiển thị loại reading dùng chung
 */
const ReadingTypeCard = memo(({ title, description, iconSrc, to, featured = false }) => (
  <div className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] ${featured ? 'border-2 border-[#9370db]' : 'border border-purple-900/20'}`}>
    <div className="relative h-40 overflow-hidden bg-gradient-to-r from-[#2a1045] to-[#3a1c5a]">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <img 
          src={iconSrc} 
          alt={title} 
          className="h-24 w-24 object-contain filter drop-shadow-lg"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/96?text=Tarot";
          }}
        />
      </div>
      {featured && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white text-xs font-bold px-3 py-1 rounded-full tracking-vn-tight">
          Phổ biến
        </div>
      )}
    </div>
    <div className="p-6 bg-white">
      <h3 className="text-xl font-bold mb-2 tracking-vn-tight text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4 tracking-vn-tight leading-vn min-h-[4rem]">{description}</p>
      <Button to={to} variant="primary" fullWidth>
        Xem ngay
      </Button>
    </div>
  </div>
));

ReadingTypeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconSrc: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  featured: PropTypes.bool
};

export default ReadingTypeCard; 