import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Component hiển thị các bước hoạt động dùng chung
 */
const HowItWorksStep = memo(({ number, title, description, icon }) => (
  <div className="flex items-start">
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex-shrink-0 flex items-center justify-center text-white font-bold text-xl mr-4">
      {number || icon}
    </div>
    <div>
      <h3 className="text-lg font-bold mb-2 tracking-vn-tight">{title}</h3>
      <p className="text-gray-400 tracking-vn-tight leading-vn">{description}</p>
    </div>
  </div>
));

HowItWorksStep.propTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node
};

export default HowItWorksStep; 