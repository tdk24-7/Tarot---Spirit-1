import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Component Button dùng chung trong toàn bộ ứng dụng
 */
const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  onClick, 
  fullWidth = false, 
  disabled = false,
  type = 'button',
  className = '' 
}) => {
  // Lấy classes dựa trên variant và size
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg',
    secondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20',
    outline: 'bg-transparent border border-[#9370db] text-[#9370db] hover:bg-[#9370db]/10',
    // Dark theme variants
    solidDark: 'bg-purple-600 text-white hover:bg-purple-500',
    outlineDark: 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white',
    text: 'bg-transparent text-gray-600 hover:text-gray-900', // For light backgrounds
    textDark: 'bg-transparent text-purple-400 hover:text-purple-300', // For dark backgrounds
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    small: 'px-2.5 py-1 text-xs', // Adjusted alias for sm to match usage
  };

  const baseClasses = 'rounded-lg font-medium transition-all duration-300 tracking-vn-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Handle size alias
  const currentSize = size === 'small' ? 'sm' : size;

  const buttonClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[currentSize] || sizeClasses.md} ${widthClass} ${disabledClass} ${className}`;

  // Return Link if "to" prop is provided, otherwise return button
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'solidDark', 'outlineDark', 'text', 'textDark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'small']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string
};

export default Button; 