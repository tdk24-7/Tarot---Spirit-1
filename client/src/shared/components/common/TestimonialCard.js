import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Component hiển thị testimonial dùng chung
 */
const TestimonialCard = memo(({ quote, author, avatar = null }) => (
  <Card className="mb-4">
    <p className="italic text-gray-300 mb-4 tracking-vn-tight leading-vn">"{quote}"</p>
    <div className="flex items-center">
      {avatar && (
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
      )}
      <p className="text-[#9370db] font-medium tracking-vn-tight">— {author}</p>
    </div>
  </Card>
));

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

export default TestimonialCard; 