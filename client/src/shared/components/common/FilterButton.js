import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Component button lọc dùng chung
 */
const FilterButton = memo(({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full mr-2 mb-2 text-sm font-medium transition-colors tracking-vn-tight
    ${active 
      ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white shadow-md' 
      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'}`}
  >
    {label}
  </button>
));

FilterButton.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default FilterButton; 