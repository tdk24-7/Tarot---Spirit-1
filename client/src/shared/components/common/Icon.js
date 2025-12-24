import React from 'react';
import PropTypes from 'prop-types';
import * as LucideIcons from 'lucide-react';

/**
 * Icon component that uses lucide-react icons
 * 
 * @param {string} name - The name of the icon from lucide-react
 * @param {string} size - Size of the icon (sm, md, lg)
 * @param {string} color - Color of the icon
 * @param {string} className - Additional classes
 */
const Icon = ({ name, size = 'md', color = 'currentColor', className = '', ...props }) => {
  // Check if the icon exists in lucide-react
  if (!LucideIcons[name]) {
    console.warn(`Icon '${name}' not found in lucide-react`);
    return null;
  }

  const LucideIcon = LucideIcons[name];
  
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 24;

  return (
    <LucideIcon
      size={pixelSize}
      color={color}
      className={className}
      {...props}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.number
  ]),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Icon; 