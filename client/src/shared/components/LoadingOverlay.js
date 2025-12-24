import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Loading overlay component with spinner animation
 */
const LoadingOverlay = ({ message, fullScreen = false, dark = true }) => {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
      className={`
        ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'} 
        ${dark ? 'bg-black/70' : 'bg-white/70'}
        flex flex-col items-center justify-center backdrop-blur-sm
      `}
    >
      <div className="text-center p-6 rounded-xl">
        <div className={`
          w-16 h-16 mb-4 mx-auto rounded-full
          border-t-2 border-b-2 ${dark ? 'border-purple-500' : 'border-purple-700'}
          animate-spin
        `}></div>
        
        {message && (
          <p className={`text-lg ${dark ? 'text-purple-200' : 'text-purple-900'}`}>
            {message}
          </p>
        )}
      </div>
    </motion.div>
  );
};

LoadingOverlay.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  dark: PropTypes.bool
};

export default LoadingOverlay; 