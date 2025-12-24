import React from 'react';

const Alert = ({ children, type = 'info', className = '' }) => {
  // Define color variants based on type
  const baseClasses = 'p-4 mb-4 rounded-md text-sm';
  
  const typeClasses = {
    info: 'bg-blue-900/30 text-blue-200 border border-blue-800',
    success: 'bg-green-900/30 text-green-200 border border-green-800',
    warning: 'bg-yellow-900/30 text-yellow-200 border border-yellow-800',
    error: 'bg-red-900/30 text-red-200 border border-red-800',
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info} ${className}`}>
      {children}
    </div>
  );
};

export default Alert; 