import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Component tiêu đề section dùng chung
 */
const SectionTitle = memo(({ title, subtitle, light = true, centered = false }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight ${light ? 'text-white' : 'text-white'}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg tracking-vn-tight leading-vn ${light ? 'text-gray-300' : 'text-gray-300'}`}>
        {subtitle}
      </p>
    )}
  </div>
));

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  light: PropTypes.bool,
  centered: PropTypes.bool
};

export default SectionTitle; 