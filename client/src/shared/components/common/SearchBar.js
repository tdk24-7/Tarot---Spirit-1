import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Component thanh tìm kiếm dùng chung
 */
const SearchBar = memo(({ 
  searchTerm,
  setSearchTerm,
  placeholder = "Tìm kiếm...", 
  className = '', 
  inputClassName = ''
}) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon 
        name="search"
        size={20}
        className="text-gray-400" 
      />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors tracking-wide ${inputClassName}`}
    />
  </div>
));

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string
};

export default SearchBar; 