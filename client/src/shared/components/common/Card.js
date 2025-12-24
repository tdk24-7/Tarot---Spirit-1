import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Component Card dùng chung
 */
const Card = memo(({ children, title, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl ${className}`}>
    {title && <h3 className="text-xl font-bold mb-6 tracking-vn-tight">{title}</h3>}
    {children}
  </div>
));

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
};

export default Card; 